import stripe from "../config/stripe.js"
import Package from "../models/package.model.js"
import Payment from "../models/payment.model.js"
import Subscription from "../models/Subcription.model.js"

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
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: pkg.name,
              description: pkg.description,
            },

            unit_amount: pkg.price * 100,
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId: req.user.id,
        packageId: pkg._id.toString(),
        paymentType: "ADMIN_PACKAGE",
      },

      success_url: `${process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancel`,
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

        payment.status = "paid";
        payment.paymentIntentId = session.payment_intent;
        payment.paidAt = new Date();

        await payment.save();

        // -------- ADMIN PACKAGE --------
        if (session.metadata.paymentType === "ADMIN_PACKAGE") {
          const pkg = await Package.findById(session.metadata.packageId);

          if (!pkg) {
            return res.status(404).json({
              success: false,
              message: "Package not found",
            });
          }

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

        // -------- CUSTOM PACKAGE --------
        if (session.metadata.paymentType === "CUSTOM_PACKAGE") {
          const subscription = await Subscription.create({
            user: session.metadata.userId,

            mealSize: session.metadata.mealSize,
            preference: session.metadata.preference,
            duration: session.metadata.duration,

            meals: session.metadata.meals,

            quantity: Number(session.metadata.quantity),

            deliveryMethod: session.metadata.deliveryMethod,

            price: Number(session.metadata.price),

            totalMeals: Number(session.metadata.totalMeals),

            mealsUsed: 0,

            maxItemsPerMeal: Number(
              session.metadata.maxItemsPerMeal
            ),

            startDate: new Date(session.metadata.startDate),

            endDate: new Date(session.metadata.endDate),
          });

          payment.subscription = subscription._id;

          await payment.save();
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