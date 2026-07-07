import mongoose from "mongoose";
import DurationPlan from "../models/durationPlan.model.js";

// .lean() ke saath virtuals nahi aate, isliye manually calculate karke add karte hain
const addComputedPrices = (plan) => {
  const discount = (plan.pricePerMeal * plan.discountPercentage) / 100;
  const discountedPricePerMeal = Number((plan.pricePerMeal - discount).toFixed(2));

  return {
    ...plan,
    discountedPricePerMeal,
    totalActualPrice: Number((plan.pricePerMeal * plan.totalMeals).toFixed(2)),
    totalDiscountedPrice: Number((discountedPricePerMeal * plan.totalMeals).toFixed(2)),
    totalSavings: Number(
      ((plan.pricePerMeal * plan.totalMeals) - (discountedPricePerMeal * plan.totalMeals)).toFixed(2)
    ),
  };
};

// create duration plan (admin only)
export const createDurationPlan = async (req, res) => {
  try {
    const { durationLabel, totalMeals, pricePerMeal, discountPercentage, frequencyLabel, sortOrder } = req.body;

    if (!durationLabel || !totalMeals || !pricePerMeal || !frequencyLabel) {
      return res.status(400).json({
        success: false,
        message: "durationLabel, totalMeals, pricePerMeal and frequencyLabel are required",
      });
    }

    const numericTotalMeals = Number(totalMeals);
    const numericPrice = Number(pricePerMeal);
    const numericDiscount = discountPercentage !== undefined ? Number(discountPercentage) : 0;

    if (isNaN(numericTotalMeals) || numericTotalMeals <= 0) {
      return res.status(400).json({
        success: false,
        message: "totalMeals must be a positive number",
      });
    }

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "pricePerMeal must be a positive number",
      });
    }

    if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
      return res.status(400).json({
        success: false,
        message: "discountPercentage must be between 0 and 100",
      });
    }

    const plan = await DurationPlan.create({
      durationLabel: durationLabel.trim(),
      totalMeals: numericTotalMeals,
      pricePerMeal: numericPrice,
      discountPercentage: numericDiscount,
      frequencyLabel: frequencyLabel.trim(),
      sortOrder: sortOrder || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Duration plan created",
      data: plan,
    });
  } catch (error) {
    console.error("Create Duration Plan Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get all duration plans (admin dashboard)
export const getAllDurationPlans = async (req, res) => {
  try {
    const plans = await DurationPlan.find()
      .sort({ sortOrder: 1, createdAt: 1 })
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
      .sort({ sortOrder: 1, createdAt: 1 })
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

    const { durationLabel, totalMeals, pricePerMeal, discountPercentage, frequencyLabel, sortOrder } = req.body;

    if (durationLabel !== undefined) {
      plan.durationLabel = durationLabel.trim();
    }

    if (totalMeals !== undefined) {
      const numericTotalMeals = Number(totalMeals);

      if (isNaN(numericTotalMeals) || numericTotalMeals <= 0) {
        return res.status(400).json({
          success: false,
          message: "totalMeals must be a positive number",
        });
      }

      plan.totalMeals = numericTotalMeals;
    }

    if (pricePerMeal !== undefined) {
      const numericPrice = Number(pricePerMeal);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "pricePerMeal must be a positive number",
        });
      }

      plan.pricePerMeal = numericPrice;
    }

    if (discountPercentage !== undefined) {
      const numericDiscount = Number(discountPercentage);

      if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
        return res.status(400).json({
          success: false,
          message: "discountPercentage must be between 0 and 100",
        });
      }

      plan.discountPercentage = numericDiscount;
    }

    if (frequencyLabel !== undefined) {
      plan.frequencyLabel = frequencyLabel.trim();
    }

    if (sortOrder !== undefined) {
      plan.sortOrder = Number(sortOrder);
    }

    await plan.save();

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

    return res.status(200).json({ success: true, message: "Duration plan deleted" });
  } catch (error) {
    console.error("Delete Duration Plan Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};