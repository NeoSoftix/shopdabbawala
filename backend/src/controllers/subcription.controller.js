import mongoose from "mongoose"
import stripe from "../config/stripe.js";
import Subscription from "../models/Subcription.model.js";
import Meal from "../models/meals.model.js";
import Payment from "../models/payment.model.js";
import User from "../models/User.model.js";
import Package from "../models/package.model.js";


// create subscription
export const createSubscription = async (req, res) => {
  try {
    const {
      mealSize,
      preference,
      duration,
      meals,
      quantity = 1,
      deliveryMethod,
      totalMeals,
      startDate,
    } = req.body;

    // Required Fields
    if (
      !mealSize ||
      !preference ||
      !duration ||
      !meals ||
      !deliveryMethod ||
      !totalMeals ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    // Validate Meal Id
    if (!mongoose.Types.ObjectId.isValid(meals)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Meal Id.",
      });
    }

    const meal = await Meal.findById(meals);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found.",
      });
    }

    // Meal Plans
    const mealPlans = {
      "1 Meal": [
        { totalMeals: 1, price: 15.00, label: "Single Tiffin", productId: "" },
      ],
      Weekly: [
        { totalMeals: 4, price: 12.50, label: "4 Meals / Week", productId: "prod_Upn0nTj5lSdjoY" },
        { totalMeals: 5, price: 12.00, label: "5 Meals / Week", productId: "prod_Upn1WgmC4FTua8" },
        { totalMeals: 6, price: 11.50, label: "6 Meals / Week", productId: "prod_Upn2jDR5ogDcV9" },
      ],
      Monthly: [
        { totalMeals: 16, price: 11.95, label: "4 Meals / Week", productId: "prod_Upn5c9rZHfivsw" },
        { totalMeals: 20, price: 11.50, label: "5 Meals / Week", productId: "prod_Upn6dyzCoMEwyc" },
        { totalMeals: 24, price: 10.95, label: "6 Meals / Week", productId: "prod_Upn728ftQwP04L" },
      ],
      Quarterly: [
        { totalMeals: 48, price: 10.95, label: "4 Meals / Week", productId: "prod_Upn0nTj5lSdjoY" },
        { totalMeals: 60, price: 10.50, label: "5 Meals / Week", productId: "prod_Upn0nTj5lSdjoY" },
        { totalMeals: 72, price: 9.95, label: "6 Meals / Week", productId: "prod_Upn0nTj5lSdjoY" },
      ],
    };

    const plans = mealPlans[duration] || mealPlans["1 Meal"];

    if (!plans) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration.",
      });
    }
    const selectedPlan = plans.find(
      plan => plan.totalMeals === Number(totalMeals)
    );

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal size.",
      });
    }

    const subtotal = selectedPlan.totalMeals * selectedPlan.price * quantity;
    const deliveryCharges = deliveryMethod === "Delivery" ? 15.0 : 0.0;
    const discount = subtotal * 0.2;
    const totalAmount = subtotal - discount + deliveryCharges;

    const calculatedStartDate = new Date(startDate);

    if (isNaN(calculatedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    const endDate = new Date(calculatedStartDate);

    switch (duration) {
      case "Trial":
        endDate.setDate(endDate.getDate() + 1);
        break;

      case "Weekly":
        endDate.setDate(endDate.getDate() + 7);
        break;

      case "Monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "Quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid duration.",
        });
    }

    // Recurring Mapping
    const recurringMap = {
      Trial: {
        interval: "day",
        interval_count: 1,
      },
      Weekly: {
        interval: "week",
        interval_count: 1,
      },
      Monthly: {
        interval: "month",
        interval_count: 1,
      },
      Quarterly: {
        interval: "month",
        interval_count: 3,
      },
    };

    const recurring = recurringMap[duration];

    // Calculate trial_end if startDate is at least 48 hours in the future
    // const nowSec = Math.floor(Date.now() / 1000);
    // const startSec = Math.floor(calculatedStartDate.getTime() / 1000);
    // const trialEnd = (startSec > nowSec + 86400) ? startSec : undefined; // at least 48 hours (172800 seconds) in future



    const now = new Date();
    const isToday = calculatedStartDate.toDateString() === now.toDateString();

    const nowSec = Math.floor(Date.now() / 1000);
    const startSec = Math.floor(calculatedStartDate.getTime() / 1000);
    const minTrialEnd = nowSec + 172800; // Stripe's 48hr floor

    // Not today → trial. Clamp to Stripe's minimum if the selected date is too close.
    const trialEnd = isToday ? undefined : Math.max(startSec, minTrialEnd);

    let session;
    if (trialEnd) {
      // Setup Mode for future start dates (No Trial period shown on Stripe)
      const user = await User.findById(req.user.id);
      const customer = await stripe.customers.create({
        email: user?.email || "",
        name: user?.name || user?.phone || "Customer",
        phone: user?.phone || "",
      });

      session = await stripe.checkout.sessions.create({
        mode: "setup",
        customer: customer.id,
        payment_method_types: ["card"],
        metadata: {
          userId: req.user.id,
          paymentType: "CUSTOM_PACKAGE",
          mealSize,
          preference,
          duration,
          meals: meal._id.toString(),
          quantity: quantity.toString(),
          deliveryMethod,
          price: Math.round(totalAmount * 100).toString(),
          totalMeals: selectedPlan.totalMeals.toString(),
          maxItemsPerMeal: selectedPlan.totalMeals.toString(),
          startDate: calculatedStartDate.toISOString(),
          endDate: endDate.toISOString(),
          isScheduled: "true",
        },
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      });
    } else {
      // Standard Subscription Mode for immediate starts
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${mealSize} Custom Package`,
                description: `${duration} Plan`,
              },
              unit_amount: Math.round(totalAmount * 100),
              recurring: {
                interval: recurring.interval,
                interval_count: recurring.interval_count,
              },
            },
            quantity,
          },
        ],
        metadata: {
          userId: req.user.id,
          paymentType: "CUSTOM_PACKAGE",
          mealSize,
          preference,
          duration,
          meals: meal._id.toString(),
          quantity: quantity.toString(),
          deliveryMethod,
          price: Math.round(totalAmount * 100).toString(),
          totalMeals: selectedPlan.totalMeals.toString(),
          maxItemsPerMeal: selectedPlan.totalMeals.toString(),
          startDate: calculatedStartDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      });
    }

    await Payment.create({
      user: req.user.id,

      paymentType: "CUSTOM_PACKAGE",

      stripeSessionId: session.id,

      amount: Math.round(totalAmount * 100),

      currency: "usd",

      status: "pending",

      metadata: session.metadata,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const renewSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.user.id;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required for renewal",
      });
    }

    // 1. Purani subscription fetch karein
    const oldSubscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId,
    });

    if (!oldSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // 2. Duration mapping (Trial, Weekly, Monthly, Quarterly handles dynamically)
    const recurringMap = {
      Trial: { interval: "day", interval_count: 1 },
      Weekly: { interval: "week", interval_count: 1 },
      Monthly: { interval: "month", interval_count: 1 },
      Quarterly: { interval: "month", interval_count: 3 },
    };

    const recurring = recurringMap[oldSubscription.duration] || { interval: "month", interval_count: 1 };

    // 3. Stripe checkout session generate karein (unit_amount direct oldSubscription.price use karega)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      phone_number_collection: { enabled: true },
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${oldSubscription.mealSize} Custom Package Renewal`,
              description: `Renewal for ${oldSubscription.duration} Plan`,
            },
            unit_amount: oldSubscription.price * 100, // Per-unit cost in paisa
            recurring: {
              interval: recurring.interval,
              interval_count: recurring.interval_count,
            },
          },
          quantity: oldSubscription.quantity,
        },
      ],
      metadata: {
        userId: userId,
        paymentType: "RENEWAL",
        subscriptionId: oldSubscription._id.toString(),
        duration: oldSubscription.duration,
      },
      success_url: `https://tiffin-delivery-app.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://tiffin-delivery-app.vercel.app/payment-cancel`,
    });

    // 4. Payment record me Total Amount (price * quantity) save karein
    await Payment.create({
      user: userId,
      paymentType: "RENEWAL",
      stripeSessionId: session.id,
      amount: oldSubscription.price * oldSubscription.quantity, // Total price calculation
      currency: "inr",
      status: "pending",
      metadata: session.metadata,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });

  } catch (error) {
    console.error("Renew Subscription Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Subscription (Option 2 Logic)
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.user.id;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId,
      status: "active",
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found for this user",
      });
    }

    if (!subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this subscription through Stripe (Stripe ID missing)",
      });
    }

    // Stripe me cancel_at_period_end trigger karein
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // DB update
    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    return res.status(200).json({
      success: true,
      message: "Subscription renewal cancelled. Plan remains active until current billing period ends.",
      cancelAtPeriodEnd: true,
    });
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Instant Upgrade without Stripe
export const instantUpgrade = async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.id;

    if (!packageId) {
      return res.status(400).json({ success: false, message: "Package ID is required" });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + pkg.validityDays);

    const subscription = await Subscription.create({
      user: userId,
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
      status: "active",
    });

    return res.status(200).json({ success: true, message: "Subscription upgraded instantly", subscription });
  } catch (error) {
    console.error("Instant Upgrade Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Subscriptions
export const getMySubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscription.find({ user: userId })
      .populate("package")
      .populate("meals")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("Get My Subscriptions Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
