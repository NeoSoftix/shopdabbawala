import mongoose from "mongoose";
import DurationPlan from "../models/durationPlan.model.js";
import MealTier from "../models/mealTier.model.js";
import stripe from "../config/stripe.js";

// .lean() ke saath virtuals nahi aate, isliye manually calculate karke add karte hain
const addComputedPrices = (plan) => {
  const discount = (plan.pricePerMeal * plan.discountPercentage) / 100;
  const discountedPricePerMeal = Number((plan.pricePerMeal - discount).toFixed(2));

  const tierPricing = (plan.tierPricing || []).map((tier) => {
    const tierDiscount = (tier.pricePerMeal * tier.discountPercentage) / 100;
    const tierDiscountedPricePerMeal = Number((tier.pricePerMeal - tierDiscount).toFixed(2));

    return {
      ...tier,
      discountedPricePerMeal: tierDiscountedPricePerMeal,
      totalActualPrice: Number((tier.pricePerMeal * plan.totalMeals).toFixed(2)),
      totalDiscountedPrice: Number((tierDiscountedPricePerMeal * plan.totalMeals).toFixed(2)),
    };
  });

  return {
    ...plan,
    tierPricing,
    discountedPricePerMeal,
    totalActualPrice: Number((plan.pricePerMeal * plan.totalMeals).toFixed(2)),
    totalDiscountedPrice: Number((discountedPricePerMeal * plan.totalMeals).toFixed(2)),
    totalSavings: Number(
      ((plan.pricePerMeal * plan.totalMeals) - (discountedPricePerMeal * plan.totalMeals)).toFixed(2)
    ),
  };
};

// tierPricing array (body se aaya raw input) validate + normalize karta hai
const normalizeTierPricing = async (tierPricing) => {
  if (!Array.isArray(tierPricing) || tierPricing.length === 0) {
    return { error: "tierPricing must be a non-empty array with a price for each meal tier" };
  }

  const cleaned = [];
  const seenTiers = new Set();

  for (const entry of tierPricing) {
    const { mealTier, pricePerMeal, discountPercentage } = entry || {};

    if (!mongoose.Types.ObjectId.isValid(mealTier)) {
      return { error: "Each tierPricing entry needs a valid mealTier id" };
    }

    if (seenTiers.has(String(mealTier))) {
      return { error: "Duplicate mealTier entries in tierPricing" };
    }
    seenTiers.add(String(mealTier));

    const numericPrice = Number(pricePerMeal);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return { error: "Each tierPricing entry needs a positive pricePerMeal" };
    }

    const numericDiscount = discountPercentage !== undefined ? Number(discountPercentage) : 0;
    if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
      return { error: "Each tierPricing entry's discountPercentage must be between 0 and 100" };
    }

    cleaned.push({ mealTier, pricePerMeal: numericPrice, discountPercentage: numericDiscount });
  }

  const existingTiers = await MealTier.find({ _id: { $in: cleaned.map((c) => c.mealTier) } }).select("_id");
  if (existingTiers.length !== cleaned.length) {
    return { error: "One or more mealTier ids in tierPricing do not exist" };
  }

  return { cleaned };
};

// create duration plan (admin only)
export const createDurationPlan = async (req, res) => {
  let stripeProduct = null;

  try {
    const { durationLabel, totalMeals, frequencyLabel, sortOrder, labelOrder, tierPricing } = req.body;

    if (!durationLabel || !totalMeals || !frequencyLabel) {
      return res.status(400).json({
        success: false,
        message: "durationLabel, totalMeals and frequencyLabel are required",
      });
    }

    const numericTotalMeals = Number(totalMeals);

    if (isNaN(numericTotalMeals) || numericTotalMeals <= 0) {
      return res.status(400).json({
        success: false,
        message: "totalMeals must be a positive number",
      });
    }

    // Har meal tier (Basic/Medium/Premium) ki apni price yahin se set hoti hai
    const { cleaned: cleanedTierPricing, error: tierPricingError } = await normalizeTierPricing(tierPricing);
    if (tierPricingError) {
      return res.status(400).json({ success: false, message: tierPricingError });
    }

    // Plan-level pricePerMeal/discountPercentage ko display/fallback/Stripe default
    // ke liye pehle tier ki price se derive karte hain
    const numericPrice = cleanedTierPricing[0].pricePerMeal;
    const numericDiscount = cleanedTierPricing[0].discountPercentage;

    const trimmedLabel = durationLabel.trim();

    // New plans under an existing duration label inherit that label's current
    // order unless the admin explicitly overrides it, so the tab doesn't jump.
    let numericLabelOrder;
    if (labelOrder !== undefined && labelOrder !== "") {
      numericLabelOrder = Number(labelOrder);
      if (isNaN(numericLabelOrder)) {
        return res.status(400).json({ success: false, message: "labelOrder must be a number" });
      }
    } else {
      const existingSibling = await DurationPlan.findOne({ durationLabel: trimmedLabel });
      numericLabelOrder = existingSibling?.labelOrder ?? 0;
    }

    const trimmedFrequency = frequencyLabel.trim();
    const discount = (numericPrice * numericDiscount) / 100;
    const discountedPricePerMeal = Number((numericPrice - discount).toFixed(2));
    const totalDiscountedPrice = Number((discountedPricePerMeal * numericTotalMeals).toFixed(2));

    // Create Stripe product + price so the plan is reflected on Stripe
    stripeProduct = await stripe.products.create({
      name: `${trimmedLabel} - ${trimmedFrequency}`,
      metadata: {
        durationLabel: trimmedLabel,
        totalMeals: numericTotalMeals.toString(),
        pricePerMeal: numericPrice.toString(),
        discountPercentage: numericDiscount.toString(),
        frequencyLabel: trimmedFrequency,
      },
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(totalDiscountedPrice * 100),
      currency: "usd",
    });

    await stripe.products.update(stripeProduct.id, {
      default_price: stripePrice.id,
    });

    const plan = await DurationPlan.create({
      durationLabel: trimmedLabel,
      totalMeals: numericTotalMeals,
      pricePerMeal: numericPrice,
      discountPercentage: numericDiscount,
      frequencyLabel: trimmedFrequency,
      sortOrder: sortOrder || 0,
      labelOrder: numericLabelOrder,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
      tierPricing: cleanedTierPricing,
    });

    if (labelOrder !== undefined && labelOrder !== "") {
      await DurationPlan.updateMany(
        { durationLabel: trimmedLabel, _id: { $ne: plan._id } },
        { labelOrder: numericLabelOrder }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Duration plan created",
      data: plan,
    });
  } catch (error) {
    console.error("Create Duration Plan Error:", error);

    // Cleanup Stripe Product if MongoDB save fails
    if (stripeProduct) {
      try {
        await stripe.products.update(stripeProduct.id, { active: false });
      } catch (cleanupError) {
        console.error("Stripe Cleanup Error:", cleanupError.message);
      }
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get all duration plans (admin dashboard)
export const getAllDurationPlans = async (req, res) => {
  try {
    const plans = await DurationPlan.find()
      .sort({ labelOrder: 1, sortOrder: 1, createdAt: 1 })
      .populate("tierPricing.mealTier", "name")
      .lean();

    const plansWithPricing = plans.map(addComputedPrices);

    return res.status(200).json({ success: true, data: plansWithPricing });
  } catch (error) {
    console.error("Get All Duration Plans Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get active duration plans (user-facing dashboard)
export const getActiveDurationPlans = async (req, res) => {
  try {
    const plans = await DurationPlan.find({ isActive: true })
      .sort({ labelOrder: 1, sortOrder: 1, createdAt: 1 })
      .populate("tierPricing.mealTier", "name")
      .lean();

    const plansWithPricing = plans.map(addComputedPrices);

    return res.status(200).json({ success: true, data: plansWithPricing });
  } catch (error) {
    console.error("Get Active Duration Plans Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// update duration plan (admin only)
export const updateDurationPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid plan id" });
    }

    const plan = await DurationPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: "Duration plan not found" });
    }

    const { durationLabel, totalMeals, frequencyLabel, sortOrder, labelOrder, tierPricing } = req.body;

    // Track karo ki Stripe-relevant fields mein se koi actually change hua ya nahi
    let stripeMetadataChanged = false;
    let priceChanged = false;

    if (tierPricing !== undefined) {
      const { cleaned: cleanedTierPricing, error: tierPricingError } = await normalizeTierPricing(tierPricing);
      if (tierPricingError) {
        return res.status(400).json({ success: false, message: tierPricingError });
      }

      plan.tierPricing = cleanedTierPricing;
      // Plan-level pricePerMeal/discountPercentage display/fallback ke liye pehle
      // tier se sync rehta hai
      plan.pricePerMeal = cleanedTierPricing[0].pricePerMeal;
      plan.discountPercentage = cleanedTierPricing[0].discountPercentage;
      stripeMetadataChanged = true;
      priceChanged = true;
    }

    if (durationLabel !== undefined) {
      const trimmedLabel = durationLabel.trim();
      if (trimmedLabel !== plan.durationLabel) {
        stripeMetadataChanged = true;
      }
      plan.durationLabel = trimmedLabel;
    }

    if (totalMeals !== undefined) {
      const numericTotalMeals = Number(totalMeals);

      if (isNaN(numericTotalMeals) || numericTotalMeals <= 0) {
        return res.status(400).json({
          success: false,
          message: "totalMeals must be a positive number",
        });
      }

      if (numericTotalMeals !== plan.totalMeals) {
        stripeMetadataChanged = true;
        priceChanged = true;
      }

      plan.totalMeals = numericTotalMeals;
    }

    if (frequencyLabel !== undefined) {
      const trimmedFrequency = frequencyLabel.trim();
      if (trimmedFrequency !== plan.frequencyLabel) {
        stripeMetadataChanged = true;
      }
      plan.frequencyLabel = trimmedFrequency;
    }

    if (sortOrder !== undefined) {
      plan.sortOrder = Number(sortOrder);
    }

    if (labelOrder !== undefined && labelOrder !== "") {
      const numericLabelOrder = Number(labelOrder);
      if (isNaN(numericLabelOrder)) {
        return res.status(400).json({ success: false, message: "labelOrder must be a number" });
      }
      plan.labelOrder = numericLabelOrder;
    }

    await plan.save();

    // ---------------- STRIPE SYNC (sirf zaroorat hone par) ----------------
    if (plan.stripeProductId) {
      if (stripeMetadataChanged) {
        try {
          await stripe.products.update(plan.stripeProductId, {
            name: `${plan.durationLabel} - ${plan.frequencyLabel}`,
            metadata: {
              durationLabel: plan.durationLabel,
              totalMeals: plan.totalMeals.toString(),
              pricePerMeal: plan.pricePerMeal.toString(),
              discountPercentage: plan.discountPercentage.toString(),
              frequencyLabel: plan.frequencyLabel,
            },
          });
        } catch (stripeErr) {
          console.error("Stripe Product Update Error:", stripeErr.message);
        }
      }

      if (priceChanged) {
        try {
          const discount = (plan.pricePerMeal * plan.discountPercentage) / 100;
          const discountedPricePerMeal = plan.pricePerMeal - discount;
          const totalDiscountedPrice = Number((discountedPricePerMeal * plan.totalMeals).toFixed(2));

          const newStripePrice = await stripe.prices.create({
            product: plan.stripeProductId,
            unit_amount: Math.round(totalDiscountedPrice * 100),
            currency: "usd",
          });

          const oldStripePriceId = plan.stripePriceId;

          await stripe.products.update(plan.stripeProductId, {
            default_price: newStripePrice.id,
          });

          if (oldStripePriceId) {
            try {
              await stripe.prices.update(oldStripePriceId, { active: false });
            } catch (archiveErr) {
              console.error("Old Price Archive Error:", archiveErr.message);
            }
          }

          plan.stripePriceId = newStripePrice.id;
          await plan.save();
        } catch (priceErr) {
          console.error("Stripe Price Update Error:", priceErr.message);
        }
      }
    }

    if (labelOrder !== undefined && labelOrder !== "") {
      await DurationPlan.updateMany(
        { durationLabel: plan.durationLabel, _id: { $ne: plan._id } },
        { labelOrder: plan.labelOrder }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Duration plan updated",
      data: plan,
    });
  } catch (error) {
    console.error("Update Duration Plan Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// toggle active/inactive status (admin only)
export const toggleDurationPlanStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid plan id" });
    }

    const plan = await DurationPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: "Duration plan not found" });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    if (plan.stripeProductId) {
      try {
        await stripe.products.update(plan.stripeProductId, { active: plan.isActive });
      } catch (stripeErr) {
        console.error("Stripe Product Toggle Error:", stripeErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Duration plan ${plan.isActive ? "activated" : "deactivated"}`,
      data: plan,
    });
  } catch (error) {
    console.error("Toggle Duration Plan Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// delete duration plan (admin only)
export const deleteDurationPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid plan id" });
    }

    const plan = await DurationPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: "Duration plan not found" });
    }

    await plan.deleteOne();

    if (plan.stripeProductId) {
      try {
        await stripe.products.update(plan.stripeProductId, { active: false });
      } catch (stripeErr) {
        console.error("Stripe Product Deactivate Error:", stripeErr.message);
      }
    }

    return res.status(200).json({ success: true, message: "Duration plan deleted" });
  } catch (error) {
    console.error("Delete Duration Plan Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};