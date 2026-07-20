import User from '../models/User.model.js';
import Subscription from '../models/Subcription.model.js';
import twilio from 'twilio';

const MessagingResponse = twilio.twiml.MessagingResponse;

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

// Webhook for incoming WhatsApp messages
export const handleIncomingWhatsApp = async (req, res) => {
  try {
    const incomingMsg = req.body.Body ? req.body.Body.trim().toLowerCase() : '';
    const fromNumber = req.body.From; // Format usually: "whatsapp:+14155238886"

    const twiml = new MessagingResponse();

    console.log(`Received WhatsApp message from ${fromNumber}: ${incomingMsg}`);

    // State 1: Greeting
    if (incomingMsg === 'hi' || incomingMsg === 'hello' || incomingMsg.includes('plan')) {
      twiml.message("Welcome to Tiffin Delivery! 🍱\n\nPlease reply with your registered 10-digit mobile number to check your active plan.");
      
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    // State 2: Checking Phone Number
    // Simple regex to check if the user sent a 10 digit number
    const phoneRegex = /\b\d{10}\b/;
    const phoneMatch = incomingMsg.match(phoneRegex);

    if (phoneMatch) {
      const extractedNumber = phoneMatch[0];
      const normPhone = normalizePhone(extractedNumber);
      
      // Look for the user
      const possibleNumbers = [normPhone, `+91${normPhone}`, `91${normPhone}`];
      const user = await User.findOne({ phone: { $in: possibleNumbers } });

      if (!user) {
        // Register the new user
        const newUserPhone = `+91${normPhone}`;
        await User.create({
          phone: newUserPhone,
          name: 'WhatsApp User', // Default name
          role: 'user'
        });

        twiml.message(`We have successfully registered your number! 🎉\n\nYou don't have an active plan right now.\n\n*Our Standard Plans:*\n1️⃣ Silver (7 Days)\n2️⃣ Gold (15 Days)\n\nYou can also create your own *Custom Plan* on our website/app! 🚀\n\nVisit: https://tiffin-delivery-app.vercel.app`);
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        return res.end(twiml.toString());
      }

      // Look for active subscription
      const activeSubscription = await Subscription.findOne({
        user: user._id,
        status: 'active',
        endDate: { $gte: new Date() }
      }).populate('package');

      if (activeSubscription) {
        const packageName = activeSubscription.package ? activeSubscription.package.name : 'Custom Plan';
        const remainingMeals = activeSubscription.remainingMeals || 0;
        const expiry = new Date(activeSubscription.endDate).toLocaleDateString();

        twiml.message(`*Great news! You have an Active Plan.* ✅\n\n*Plan:* ${packageName}\n*Remaining Meals:* ${remainingMeals}\n*Valid Till:* ${expiry}\n\nThank you for choosing us! 🍲`);
      } else {
        twiml.message(`You don't have an active plan right now. 😢\n\n*Our Standard Plans:*\n1️⃣ Silver (7 Days)\n2️⃣ Gold (15 Days)\n\nYou can also create your own *Custom Plan* on our website/app! 🚀\n\nVisit: https://tiffin-delivery-app.vercel.app`);
      }

      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    // Default fallback
    twiml.message("I didn't quite get that. 🤔\n\nPlease reply with 'Hi' to start over, or send your 10-digit registered mobile number.");
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    // Even on error, we must return valid XML to Twilio
    const twiml = new MessagingResponse();
    twiml.message("Sorry, our system is currently experiencing issues. Please try again later.");
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }
};
