import stripe from "../config/stripe.js"
import Package from "../models/package.model.js"
import Payment from "../models/payment.model.js"
import Subscription from "../models/Subcription.model.js"
import { sendEmail } from "../utils/email/sendEmail.js"
import { purchaseSuccessTemplate } from "../utils/email/purchaseSuccessTemplate.js"

export const createPackageCheckout = async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package Id is required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User context missing.",
      });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    if (!pkg.isActive) {
      return res.status(400).json({
        success: false,
        message: "Package is inactive",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      phone_number_collection: { enabled: true },

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: pkg.name,
              description: pkg.description,
            },

            unit_amount: Math.max(pkg.price * 100, 4000), // Stripe requires minimum 50 cents / 40 INR
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId: req.user.id,
        packageId: pkg._id.toString(),
        paymentType: "ADMIN_PACKAGE",
      },

      success_url: `https://tiffin-delivery-app.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `https://tiffin-delivery-app.vercel.app/payment-cancel`,
    });

    await Payment.create({
      user: req.user.id,
      package: pkg._id,

      paymentType: "ADMIN_PACKAGE",

      stripeSessionId: session.id,

      amount: pkg.price,

      currency: "inr",

      status: "pending",

      metadata: session.metadata,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.log("Package Checkout Error", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// weeb hook 
// -------- FULFILL ORDER HELPER --------
const fulfillOrder = async (session, payment) => {
  payment.status = "paid";
  payment.paymentIntentId = session.payment_intent;
  payment.paidAt = new Date();

  await payment.save();

  // -------- ADMIN PACKAGE --------
  if (session.metadata?.paymentType === "ADMIN_PACKAGE") {
    const pkg = await Package.findById(session.metadata.packageId);

    if (pkg) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + pkg.validityDays);

      const subscription = await Subscription.create({
        user: session.metadata.userId,
        package: pkg._id,
        mealSize: pkg.name,
        price: pkg.price,
        totalMeals: pkg.totalMeals,
        mealsUsed: 0,
        maxItemsPerMeal: pkg.maxItemsPerMeal,
        preference: "Veg",
        duration: "Monthly",
        quantity: 1,
        deliveryMethod: "Delivery",
        startDate,
        endDate,
      });

      payment.subscription = subscription._id;
      await payment.save();
    }
  }

  // -------- CUSTOM PACKAGE --------
  if (session.metadata?.paymentType === "CUSTOM_PACKAGE") {
    const subscription = await Subscription.create({
      user: session.metadata.userId,
      stripeSubscriptionId: session.subscription,

      mealSize: session.metadata.mealSize,
      preference: session.metadata.preference,
      duration: session.metadata.duration,
      meals: session.metadata.meals,
      quantity: Number(session.metadata.quantity),
      deliveryMethod: session.metadata.deliveryMethod,
      price: Number(session.metadata.price),
      totalMeals: Number(session.metadata.totalMeals),
      mealsUsed: 0,
      maxItemsPerMeal: Number(session.metadata.maxItemsPerMeal),
      startDate: new Date(session.metadata.startDate),
      endDate: new Date(session.metadata.endDate),
    });

    payment.subscription = subscription._id;
    await payment.save();
  }

  // -------- RENEWAL --------
  if (session.metadata?.paymentType === "RENEWAL") {
    const subId = session.metadata.subscriptionId;
    const duration = session.metadata.duration;

    const newStartDate = new Date();
    const newEndDate = new Date(newStartDate);

    if (duration === "Trial") newEndDate.setDate(newEndDate.getDate() + 1);
    else if (duration === "Weekly") newEndDate.setDate(newEndDate.getDate() + 7);
    else if (duration === "Monthly") newEndDate.setMonth(newEndDate.getMonth() + 1);
    else if (duration === "Quarterly") newEndDate.setMonth(newEndDate.getMonth() + 3);

    const subscription = await Subscription.findByIdAndUpdate(
      subId,
      {
        status: "active",
        startDate: newStartDate,
        endDate: newEndDate,
        mealsUsed: 0,
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: session.subscription,
      },
      { new: true }
    );

    if (subscription) {
      payment.subscription = subscription._id;
      await payment.save();
    }
  }
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook Signature Error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const payment = await Payment.findOne({
          stripeSessionId: session.id,
        });

        if (!payment) {
          return res.status(404).json({
            success: false,
            message: "Payment not found",
          });
        }

        // Duplicate webhook protection
        if (payment.status === "paid") {
          return res.json({ received: true });
        }

        await fulfillOrder(session, payment);

        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object;

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: stripeSub.id },
          { status: "expired", cancelAtPeriodEnd: false }
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const stripeSubId = invoice.subscription;
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);

          const newStartDate = new Date(stripeSub.current_period_start * 1000);
          const newEndDate = new Date(stripeSub.current_period_end * 1000);

          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: stripeSubId },
            {
              status: "active",
              startDate: newStartDate,
              endDate: newEndDate,
              mealsUsed: 0
            }
          );
        }
        break;
      }

      default:
        console.log(`Unhandled Event ${event.type}`);
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.log("Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// save check out detilas 
export const saveCheckoutDetails = async (req, res) => {
  try {
    const { name, email, address, sessionId } = req.body;

    if (!email || !sessionId) {
      return res.status(400).json({ success: false, message: "Email and session ID are required." });
    }

    const payment = await Payment.findOne({ stripeSessionId: sessionId }).populate("package").populate("subscription");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    let finalPayment = payment;
    // FULFILL ORDER INSTANTLY IF NOT PROCESSED YET
    if (payment.status !== "paid") {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          await fulfillOrder(session, payment);
          // Re-fetch to get the newly created subscription details for the email if needed
          finalPayment = await Payment.findById(payment._id).populate("package").populate("subscription");
        }
      } catch (stripeErr) {
        console.error("Stripe retrieval error in saveCheckoutDetails:", stripeErr);
      }
    }

    // Determine plan name and total meals
    let planName = "Custom Subscription";
    let totalMeals = "Varies";
    let amount = finalPayment.amount;

    if (finalPayment.paymentType === "ADMIN_PACKAGE" && finalPayment.package) {
      planName = finalPayment.package.name;
      totalMeals = finalPayment.package.totalMeals || "Pre-defined";
    } else if (finalPayment.paymentType === "CUSTOM_PACKAGE" && finalPayment.subscription) {
      planName = `Custom ${finalPayment.subscription.duration} Plan`;
      totalMeals = finalPayment.subscription.totalMeals;
    }

    // Send the email in the background to prevent blocking the response
    const emailHtml = purchaseSuccessTemplate(name || "Customer", planName, amount, totalMeals);
    sendEmail(email, "Your Tiffin Delivery Subscription is Confirmed! 🎉", emailHtml)
      .catch(err => console.error("Background email sending failed:", err));

    return res.status(200).json({ success: true, message: "Details saved and email processing." });
  } catch (error) {
    console.error("saveCheckoutDetails error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      success: true,
      customer_details: session.customer_details,
    });
  } catch (error) {
    console.error("Get Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};