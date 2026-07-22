import twilio from 'twilio';
import User from '../models/User.model.js';
import Subscription from '../models/Subcription.model.js';
import Package from '../models/package.model.js';
import WhatsAppSession from '../models/whatsappSession.model.js';
import { buildPackageCheckoutSession } from './payment/packageCheckout.js';

const MessagingResponse = twilio.twiml.MessagingResponse;

const BRAND = "Shop Dabba Wala";

// Helper to normalize phone number
const normalizePhone = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  // If it has 12 digits and starts with 91, strip the 91
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  }
  return cleaned;
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// Builds the "N. Name - details" catalog text and the serial->packageId
// snapshot to store on the session, so a later reply of "2" always resolves
// to the exact package shown here, not a live re-query.
const buildCatalog = async () => {
  const packages = await Package.find({ isActive: true }).sort({ price: 1 });

  const catalog = packages.map((pkg, index) => ({
    serial: index + 1,
    packageId: pkg._id,
  }));

  const lines = packages.map((pkg, index) => {
    const hasDiscount = pkg.discountedPrice != null && pkg.discountedPrice < pkg.price;
    const priceLine = hasDiscount
      ? `$${pkg.discountedPrice} (was $${pkg.price})`
      : `$${pkg.price}`;

    return (
      `*${index + 1}. ${pkg.name}*\n` +
      `Meals: ${pkg.totalMeals} | Valid: ${pkg.validityDays} days\n` +
      `Price: ${priceLine}\n` +
      `Features: ${pkg.features.join(", ")}`
    );
  });

  const message =
    `*Our Plans* 📋\n\n${lines.join("\n\n")}\n\n` +
    `Want something custom? Build your own plan on our website: ${process.env.FRONTEND_URL}\n\n` +
    `*Reply with the number of the plan you want to buy.*`;

  return { message, catalog };
};

const buildActivePlansMessage = (subscriptions) => {
  const lines = subscriptions.map((sub) => (
    `*${sub.package?.name || "Custom Plan"}*\n` +
    `Meals left: ${sub.mealsRemaining}/${sub.totalMeals}\n` +
    `Valid till: ${formatDate(sub.endDate)}`
  ));

  return (
    `*Great news! You have ${subscriptions.length} active plan${subscriptions.length > 1 ? "s" : ""}.* ✅\n\n` +
    `${lines.join("\n\n")}\n\n` +
    `Thank you for choosing ${BRAND}! 🍲\n\n` +
    `Want to purchase another plan? *Reply 1.*`
  );
};

const getOrCreateSession = async (phone) => {
  let session = await WhatsAppSession.findOne({ phone });
  if (!session) {
    session = await WhatsAppSession.create({ phone });
  }
  return session;
};

// Webhook for incoming WhatsApp messages
export const handleIncomingWhatsApp = async (req, res) => {
  const twiml = new MessagingResponse();
  const reply = (text) => {
    twiml.message(text);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  };

  try {
    const incomingMsg = req.body.Body ? req.body.Body.trim().toLowerCase() : '';
    const fromNumber = req.body.From; // Format usually: "whatsapp:+14155238886"

    console.log(`Received WhatsApp message from ${fromNumber}: ${incomingMsg}`);

    const session = await getOrCreateSession(fromNumber);

    // Greeting always resets the conversation.
    if (incomingMsg === 'hi' || incomingMsg === 'hello') {
      session.state = 'AWAITING_PHONE';
      session.catalog = [];
      await session.save();
      return reply(
        `Welcome to ${BRAND}! 🍱\n\nPlease reply with your registered 10-digit mobile number to check your plans.`
      );
    }

    // A 10-digit number is treated as a phone number regardless of state,
    // so the user can (re)identify themselves at any point.
    const phoneMatch = incomingMsg.match(/\b\d{10}\b/);

    if (phoneMatch) {
      const normPhone = normalizePhone(phoneMatch[0]);
      const possibleNumbers = [normPhone, `+91${normPhone}`, `91${normPhone}`];
      let user = await User.findOne({ phone: { $in: possibleNumbers } });

      if (!user) {
        user = await User.create({
          phone: `+91${normPhone}`,
          name: 'WhatsApp User',
          role: 'user',
        });

        const { message, catalog } = await buildCatalog();
        session.userId = user._id;
        session.state = 'AWAITING_PLAN_CHOICE';
        session.catalog = catalog;
        await session.save();

        return reply(
          `We have successfully registered your number! 🎉\n\nYou don't have an active plan yet.\n\n${message}`
        );
      }

      session.userId = user._id;

      const activeSubscriptions = await Subscription.find({
        user: user._id,
        status: 'active',
        endDate: { $gte: new Date() },
      }).populate('package');

      if (activeSubscriptions.length > 0) {
        session.state = 'AWAITING_MENU_CHOICE';
        session.catalog = [];
        await session.save();
        return reply(buildActivePlansMessage(activeSubscriptions));
      }

      session.state = 'AWAITING_MENU_CHOICE';
      session.catalog = [];
      await session.save();
      return reply(
        `You don't have an active plan right now. 😢\n\nWant to see our plans? *Reply 1.*`
      );
    }

    // "1" from the plans-gate shows the catalog.
    if (session.state === 'AWAITING_MENU_CHOICE' && incomingMsg === '1') {
      const { message, catalog } = await buildCatalog();
      session.state = 'AWAITING_PLAN_CHOICE';
      session.catalog = catalog;
      await session.save();
      return reply(message);
    }

    // A number while a catalog is showing is a purchase choice.
    if (session.state === 'AWAITING_PLAN_CHOICE' && /^\d+$/.test(incomingMsg)) {
      const serial = Number(incomingMsg);
      const entry = session.catalog.find((c) => c.serial === serial);

      if (!entry) {
        return reply(
          `That's not a valid plan number. Please reply with one of the numbers shown above, or reply 'Hi' to start over.`
        );
      }

      if (!session.userId) {
        session.state = 'AWAITING_PHONE';
        await session.save();
        return reply(`Please share your mobile number first so we can set up your payment.`);
      }

      const { session: checkoutSession, error } = await buildPackageCheckoutSession({
        userId: session.userId,
        packageId: entry.packageId,
        extraMetadata: { source: 'whatsapp', whatsappPhone: fromNumber },
      });

      if (error) {
        return reply(`Sorry, we couldn't start checkout for that plan. Please try again in a moment.`);
      }

      session.state = 'AWAITING_PHONE';
      session.catalog = [];
      await session.save();

      return reply(
        `Here's your secure payment link 💳\n\n${checkoutSession.url}\n\n` +
        `You'll get a confirmation on WhatsApp as soon as your payment is complete.`
      );
    }

    // Default fallback
    return reply(
      `I didn't quite get that. 🤔\n\nPlease reply with 'Hi' to start over, or send your 10-digit registered mobile number.`
    );

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return reply("Sorry, our system is currently experiencing issues. Please try again later.");
  }
};
