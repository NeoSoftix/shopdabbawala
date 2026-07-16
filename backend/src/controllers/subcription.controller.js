import mongoose from "mongoose"
import stripe from "../config/stripe.js";
import Subscription from "../models/Subcription.model.js";
import Payment from "../models/payment.model.js";
import Package from "../models/package.model.js";
import DurationPlan from "../models/durationPlan.model.js";
import DeliveryCharge from "../models/deliveryCharge.model.js";
import { getOrCreateCustomPackageProduct } from "../utils/stripeSharedProducts.js";


// create subscription
export const createSubscription = async (req, res) => {
  try {
    const {
      mealSize,
      preference,
      duration,
      quantity = 1,
      deliveryMethod,
      totalMeals,
      startDate,
      pincode,
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

    // Pre-existing plans created before `durationDays` was added won't have
    // it set yet - the admin needs to edit the plan in "Set Duration" once.
    if (!durationPlanDoc.durationDays) {
      return res.status(400).json({
        success: false,
        message: `The "${durationPlanDoc.durationLabel}" duration plan is missing its Duration (Days) setting. Please ask the admin to edit it under Set Duration.`,
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

    // Delivery charge is per-pincode, configured by the admin under
    // "Delivery Charges" - not a flat fee. Pickup orders have none.
    let deliveryCharges = 0.0;
    if (deliveryMethod === "Delivery") {
      if (!pincode) {
        return res.status(400).json({
          success: false,
          message: "Pincode is required for delivery orders.",
        });
      }

      const deliveryChargeDoc = await DeliveryCharge.findOne({
        pincode: String(pincode).trim(),
        isActive: true,
      });

      if (!deliveryChargeDoc) {
        return res.status(400).json({
          success: false,
          message: `No delivery charge configured for pincode ${pincode}. Please contact support or choose Pickup.`,
        });
      }

      deliveryCharges = deliveryChargeDoc.charge;
    }

    const discount = subtotal * (effectiveDiscountPercentage / 100);
    const totalAmount = subtotal - discount + deliveryCharges;

    const calculatedStartDate = new Date(startDate);

    if (isNaN(calculatedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    // Duration math is driven entirely by the DurationPlan's `durationDays` -
    // not by string-matching `duration` against a fixed Trial/Weekly/Monthly/
    // Quarterly set, so any custom label the admin types (e.g. "One") works.
    const endDate = new Date(calculatedStartDate);
    endDate.setDate(endDate.getDate() + durationPlanDoc.durationDays);

    const normalizedDuration = duration.trim();

    // Stripe's day-based recurring interval works uniformly for any duration
    // length (max 365 days), so no per-label lookup is needed here either.
    const recurring = { interval: "day", interval_count: durationPlanDoc.durationDays };

    const customPackageProductId = await getOrCreateCustomPackageProduct();

    // Customer is always charged in full right at checkout (no trial - see
    // above), but if they picked a future start date the *recurring* cycle
    // should still be anchored to that date, not to today, so Stripe's next
    // billing date (and what shows on the checkout/subscription page)
    // matches what the customer actually picked. `proration_behavior: "none"`
    // stops Stripe from also trying to prorate today's charge for the
    // shortened first "stub" period between now and the anchor.
    const nowSec = Math.floor(Date.now() / 1000);
    const startSec = Math.floor(calculatedStartDate.getTime() / 1000);
    const billingCycleAnchor = startSec > nowSec ? startSec : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            // Reuse the single shared "Custom Tiffin Plan" Stripe Product
            // (see getOrCreateCustomPackageProduct) instead of inline
            // product_data, which would create a brand-new Product per
            // checkout and flood the Stripe Product catalog.
            product: customPackageProductId,
            unit_amount: Math.round(totalAmount * 100),
            recurring: {
              interval: recurring.interval,
              interval_count: recurring.interval_count,
            },
          },
          quantity,
        },
      ],
      ...(billingCycleAnchor && {
        subscription_data: {
          billing_cycle_anchor: billingCycleAnchor,
          proration_behavior: "none",
        },
      }),
      metadata: {
        userId: req.user.id,
        paymentType: "CUSTOM_PACKAGE",
        mealSize,
        preference,
        duration: normalizedDuration,
        durationDays: durationPlanDoc.durationDays.toString(),
        quantity: quantity.toString(),
        deliveryMethod,
        pincode: pincode ? String(pincode).trim() : "",
        price: Math.round(totalAmount * 100).toString(),
        totalMeals: durationPlanDoc.totalMeals.toString(),
        maxItemsPerMeal: durationPlanDoc.totalMeals.toString(),
        startDate: calculatedStartDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    await Payment.create({
      user: req.user.id,

      paymentType: "CUSTOM_PACKAGE",

      stripeSessionId: session.id,

      // Stored in standard currency units (dollars), matching every other
      // Payment.amount write (packageCheckout.js, addonCheckout.js,
      // renewSubscription below) — only Stripe's own `unit_amount`/`price`
      // fields need the *100 cents conversion.
      amount: totalAmount,

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

    // 2. Day-based interval works uniformly for any duration length - older
    // subscriptions predating `durationDays` fall back to 30 days.
    const recurring = { interval: "day", interval_count: oldSubscription.durationDays || 30 };

    // 3. Stripe checkout session generate karein (unit_amount direct oldSubscription.price use karega)
    const renewalProductId = await getOrCreateCustomPackageProduct();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      phone_number_collection: { enabled: true },
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            // Same shared product as new custom-plan checkouts (see
            // getOrCreateCustomPackageProduct) instead of inline
            // product_data, which created a new Product per renewal.
            product: renewalProductId,
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
        durationDays: String(oldSubscription.durationDays || 30),
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
      .sort({ createdAt: -1 });

    // Attach the matching Payment (transaction id, gateway, paid-at time) to
    // each subscription so the Purchase History tab can show full details.
    const payments = await Payment.find({
      subscription: { $in: subscriptions.map((sub) => sub._id) },
    }).sort({ createdAt: -1 });

    const paymentBySubscription = new Map();
    for (const payment of payments) {
      const key = payment.subscription?.toString();
      if (key && !paymentBySubscription.has(key)) {
        paymentBySubscription.set(key, payment);
      }
    }

    const subscriptionsWithPayment = subscriptions.map((sub) => {
      const payment = paymentBySubscription.get(sub._id.toString());
      return {
        ...sub.toObject(),
        payment: payment
          ? {
              transactionId: payment.stripeSessionId,
              paymentIntentId: payment.paymentIntentId,
              gateway: "Stripe",
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              paidAt: payment.paidAt,
              createdAt: payment.createdAt,
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      subscriptions: subscriptionsWithPayment,
    });
  } catch (error) {
    console.error("Get My Subscriptions Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
