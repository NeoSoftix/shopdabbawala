import mongoose from "mongoose";
import MealTier from "../models/mealTier.model.js"

// create meal tier
export const createMealTier = async (req, res) => {
  try {
    const { name, features, items, selectionCount } = req.body;

    if (!name || !features || !items) {
      return res.status(400).json({
        success: false,
        message: "Name, Features and Items are required.",
      });
    }

    if (!Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array.",
      });
    }

    const cleanedFeatures = features.map((f) => f.trim()).filter((f) => f.length > 0);

    if (cleanedFeatures.length < 1 || cleanedFeatures.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Features must contain between 1 and 10 items.",
      });
    }

    if (!Array.isArray(items) || items.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Items must be a non-empty array.",
      });
    }

    let cleanedSelectionCount = 1;
    if (selectionCount !== undefined) {
      cleanedSelectionCount = Number(selectionCount);
      if (!Number.isInteger(cleanedSelectionCount) || cleanedSelectionCount < 1 || cleanedSelectionCount > items.length) {
        return res.status(400).json({
          success: false,
          message: `Selection count must be a whole number between 1 and ${items.length} (total items).`,
        });
      }
    }

    const normalizedName = name.trim();

    const existingTier = await MealTier.findOne({ name: normalizedName });
    if (existingTier) {
      return res.status(409).json({
        success: false,
        message: "Tier already exists.",
      });
    }

    const tier = await MealTier.create({
      name: normalizedName,
      features: cleanedFeatures,
      items,
      selectionCount: cleanedSelectionCount,
    });

    return res.status(201).json({
      success: true,
      message: "Meal tier created successfully.",
      data: tier,
    });
  } catch (error) {
    console.error("Create Meal Tier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// get all meal tiers (admin)
export const getAllMealTiers = async (req, res) => {
  try {
    const tiers = await MealTier.find().populate("items", "name").sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      data: tiers,
    });
  } catch (error) {
    console.error("Get All Meal Tiers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// get one meal tier
export const getOneMealTier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tier Id.",
      });
    }

    const tier = await MealTier.findById(id).populate("items", "name").lean();

    if (!tier) {
      return res.status(404).json({
        success: false,
        message: "Tier not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tier,
    });
  } catch (error) {
    console.error("Get One Meal Tier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// update meal tier
export const updateMealTier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tier Id.",
      });
    }

    const tier = await MealTier.findById(id);

    if (!tier) {
      return res.status(404).json({
        success: false,
        message: "Tier not found.",
      });
    }

    const { name, features, items, selectionCount } = req.body;

    if (name !== undefined) {
      const normalizedName = name.trim();

      const existingTier = await MealTier.findOne({
        name: normalizedName,
        _id: { $ne: id },
      });

      if (existingTier) {
        return res.status(409).json({
          success: false,
          message: "Tier already exists.",
        });
      }

      tier.name = normalizedName;
    }

    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array.",
        });
      }

      const cleanedFeatures = features.map((f) => f.trim()).filter((f) => f.length > 0);

      if (cleanedFeatures.length < 1 || cleanedFeatures.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Features must contain between 1 and 10 items.",
        });
      }

      tier.features = cleanedFeatures;
    }

    if (items !== undefined) {
      if (!Array.isArray(items) || items.length < 1) {
        return res.status(400).json({
          success: false,
          message: "Items must be a non-empty array.",
        });
      }

      tier.items = items;
    }

    if (selectionCount !== undefined) {
      const cleanedSelectionCount = Number(selectionCount);
      if (!Number.isInteger(cleanedSelectionCount) || cleanedSelectionCount < 1 || cleanedSelectionCount > tier.items.length) {
        return res.status(400).json({
          success: false,
          message: `Selection count must be a whole number between 1 and ${tier.items.length} (total items).`,
        });
      }
      tier.selectionCount = cleanedSelectionCount;
    } else if (tier.selectionCount > tier.items.length) {
      tier.selectionCount = tier.items.length;
    }

    await tier.save();

    return res.status(200).json({
      success: true,
      message: "Meal tier updated successfully.",
      data: tier,
    });
  } catch (error) {
    console.error("Update Meal Tier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// delete meal tier
export const deleteMealTier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tier Id.",
      });
    }

    const tier = await MealTier.findById(id);

    if (!tier) {
      return res.status(404).json({
        success: false,
        message: "Tier not found.",
      });
    }

    await tier.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Tier deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Meal Tier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// toggle status of meal tier
export const toggleMealTierStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tier Id.",
      });
    }

    const tier = await MealTier.findById(id);

    if (!tier) {
      return res.status(404).json({
        success: false,
        message: "Tier not found.",
      });
    }

    tier.isActive = !tier.isActive;
    await tier.save();

    return res.status(200).json({
      success: true,
      message: `Tier ${tier.isActive ? "activated" : "deactivated"} successfully.`,
      data: tier,
    });
  } catch (error) {
    console.error("Toggle Meal Tier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// user-facing — sirf active tiers
export const getActiveMealTiers = async (req, res) => {
  try {
    const tiers = await MealTier.find({ isActive: true }).populate("items", "name").lean();

    return res.status(200).json({
      success: true,
      data: tiers,
    });
  } catch (error) {
    console.error("Get Active Meal Tiers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
