import mongoose from "mongoose"
import stripe from "../config/stripe.js";
import Subscription from "../models/Subcription.model.js";
import Meal from "../models/meals.model.js";
import Payment from "../models/payment.model.js";
import User from "../models/User.model.js";
import Package from "../models/package.model.js";
import DurationPlan from "../models/durationPlan.model.js";


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
      !deliveryMethod ||
      !totalMeals ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    // Meal Timing is optional
    let meal = null;
    if (meals) {
      if (!mongoose.Types.ObjectId.isValid(meals)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Meal Id.",
        });
      }

      meal = await Meal.findById(meals);

      if (!meal) {
        return res.status(404).json({
          success: false,
          message: "Meal not found.",
        });
      }
    }

    // Find the matching duration plan configured by the admin (DurationPlan collection)
    const durationPlanDoc = await DurationPlan.findOne({
      durationLabel: new RegExp(`^${duration}$`, "i"),
      totalMeals: Number(totalMeals),
      isActive: true,
    }).populate("tierPricing.mealTier", "name");

    if (!durationPlanDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal size.",
      });
    }

    // Selected meal tier (Basic/Medium/Premium) ki apni price use karo — har
    // tier ki alag price ho sakti hai, base price sirf fallback hai jab is
    // duration+meal-count combo ke liye us tier ki price set nahi ki gayi.
    const normalizedMealSize = mealSize.trim().toLowerCase();
    const tierPriceEntry = durationPlanDoc.tierPricing.find(
      (t) => t.mealTier?.name?.trim().toLowerCase() === normalizedMealSize
    );
    const effectivePricePerMeal = tierPriceEntry ? tierPriceEntry.pricePerMeal : durationPlanDoc.pricePerMeal;
    const effectiveDiscountPercentage = tierPriceEntry
      ? tierPriceEntry.discountPercentage
      : durationPlanDoc.discountPercentage;

    const subtotal = durationPlanDoc.totalMeals * effectivePricePerMeal * quantity;
    const deliveryCharges = deliveryMethod === "Delivery" ? 15.0 : 0.0;
    const discount = subtotal * (effectiveDiscountPercentage / 100);
    const totalAmount = subtotal - discount + deliveryCharges;

    const calculatedStartDate = new Date(startDate);

    if (isNaN(calculatedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    const endDate = new Date(calculatedStartDate);
    const durationKey = duration.trim().toLowerCase();
    // Subscription model's `duration` enum expects Capitalized values (Trial/Weekly/Monthly/Quarterly)
    const normalizedDuration = durationKey.charAt(0).toUpperCase() + durationKey.slice(1);

    switch (durationKey) {
      case "trial":
        endDate.setDate(endDate.getDate() + 1);
        break;

      case "weekly":
        endDate.setDate(endDate.getDate() + 7);
        break;

      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "quarterly":
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
      trial: {
        interval: "day",
        interval_count: 1,
      },
      weekly: {
        interval: "week",
        interval_count: 1,
      },
      monthly: {
        interval: "month",
        interval_count: 1,
      },
      quarterly: {
        interval: "month",
        interval_count: 3,
      },
    };

    const recurring = recurringMap[durationKey];

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
          duration: normalizedDuration,
          ...(meal && { meals: meal._id.toString() }),
          quantity: quantity.toString(),
          deliveryMethod,
          price: Math.round(totalAmount * 100).toString(),
          totalMeals: durationPlanDoc.totalMeals.toString(),
          maxItemsPerMeal: durationPlanDoc.totalMeals.toString(),
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
                description: `${normalizedDuration} Plan`,
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
          duration: normalizedDuration,
          ...(meal && { meals: meal._id.toString() }),
          quantity: quantity.toString(),
          deliveryMethod,
          price: Math.round(totalAmount * 100).toString(),
          totalMeals: durationPlanDoc.totalMeals.toString(),
          maxItemsPerMeal: durationPlanDoc.totalMeals.toString(),
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
      trial: { interval: "day", interval_count: 1 },
      weekly: { interval: "week", interval_count: 1 },
      monthly: { interval: "month", interval_count: 1 },
      quarterly: { interval: "month", interval_count: 3 },
    };

    const recurring =
      recurringMap[oldSubscription.duration?.trim().toLowerCase()] || { interval: "month", interval_count: 1 };

    // 3. Stripe checkout session generate karein (unit_amount direct oldSubscription.price use karega)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      phone_number_collection: { enabled: true },
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${oldSubscription.mealSize} Custom Package Renewal`,
              description: `Renewal for ${oldSubscription.duration} Plan`,
            },
            unit_amount: oldSubscription.price * 100, // Per-unit cost in cents
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
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    // 4. Payment record me Total Amount (price * quantity) save karein
    await Payment.create({
      user: userId,
      paymentType: "RENEWAL",
      stripeSessionId: session.id,
      amount: oldSubscription.price * oldSubscription.quantity, // Total price calculation
      currency: "usd",
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
