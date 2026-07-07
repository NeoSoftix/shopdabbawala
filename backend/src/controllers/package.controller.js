import mongoose from "mongoose";
import Package from "../models/package.model.js";
import stripe from "../config/stripe.js";

// create package with stripe
export const createPackage = async (req, res) => {
  let stripeProduct = null;

  try {
    const {
      name,
      validityDays,
      totalMeals,
      price,
      description,
      maxItemsPerMeal,
      features,
    } = req.body;

    // Required Fields Validation
    if (
      !name ||
      !validityDays ||
      !totalMeals ||
      !price ||
      !maxItemsPerMeal ||
      !features
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Price, Total Meals, Validity Days, Max Items Per Meal and Features are required.",
      });
    }

    // Features Validation
    if (!Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array.",
      });
    }

    const cleanedFeatures = features
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);

    if (cleanedFeatures.length < 1 || cleanedFeatures.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Features must contain between 1 and 10 items.",
      });
    }

    // Normalize Name
    const normalizedName = name.trim().toLowerCase();

    // Check Existing Package
    const existingPackage = await Package.findOne({
      name: normalizedName,
    });

    if (existingPackage) {
      return res.status(409).json({
        success: false,
        message: "Package already exists.",
      });
    }

    // Convert Numbers
    const numericPrice = Number(price);
    const numericMeals = Number(totalMeals);
    const numericValidityDays = Number(validityDays);
    const numericMaxItems = Number(maxItemsPerMeal);

    // Numeric Validations
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0.",
      });
    }

    if (isNaN(numericMeals) || numericMeals <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total meals must be greater than 0.",
      });
    }

    if (isNaN(numericValidityDays) || numericValidityDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Validity days must be greater than 0.",
      });
    }

    if (isNaN(numericMaxItems) || numericMaxItems <= 0) {
      return res.status(400).json({
        success: false,
        message: "Max items per meal must be greater than 0.",
      });
    }

    // Recurring Mapping
    const recurringMap = {
      7: { interval: "week", interval_count: 1 },
      15: { interval: "day", interval_count: 15 },
      30: { interval: "month", interval_count: 1 },
      90: { interval: "month", interval_count: 3 },
      180: { interval: "month", interval_count: 6 },
      365: { interval: "year", interval_count: 1 },
    };

    const recurring = recurringMap[numericValidityDays];

    if (!recurring) {
      return res.status(400).json({
        success: false,
        message: "Unsupported validity period.",
      });
    }

    // Create Product on Stripe
    stripeProduct = await stripe.products.create({
      name: normalizedName,
      description: description?.trim() || "",
      metadata: {
        validityDays: numericValidityDays.toString(),
        totalMeals: numericMeals.toString(),
        maxItemsPerMeal: numericMaxItems.toString(),
        features: JSON.stringify(cleanedFeatures),
      },
    });

    // Create Recurring Price on Stripe
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: numericPrice * 100,
      currency: "inr",
      recurring,
    });

    // Create Package
    const packageData = await Package.create({
      name: normalizedName,
      description: description?.trim(),
      price: numericPrice,
      totalMeals: numericMeals,
      validityDays: numericValidityDays,
      maxItemsPerMeal: numericMaxItems,
      features: cleanedFeatures,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: packageData,
    });
  } catch (error) {
    console.error("Create Package Error:", error);

    // Cleanup Stripe Product if MongoDB save fails
    if (stripeProduct) {
      try {
        await stripe.products.update(stripeProduct.id, {
          active: false,
        });
      } catch (cleanupError) {
        console.error("Stripe Cleanup Error:", cleanupError.message);
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Package already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error.",
    });
  }
};

// get all package
export const getAllPackage = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      message: "All Packages Fetched Successfully",
      count:packages.length,
      success: true,
      data: packages,
    });
  } catch (error) {
    console.log("Get All Package Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get one package
export const getOnePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Package Id",
        success: false,
      });
    }

    const packageData = await Package.findById(id).lean();

    if (!packageData) {
      return res.status(404).json({
        message: "Package Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Package fetched successfully",
      data: packageData,
      success: true,
    });
  } catch (error) {
    console.log("Get Package Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get active package
export const getActivePackage = async (req, res) => {
  try {
    const packages = await Package.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Active Packages Fetched Successfully",
      success: true,
      data: packages,
    });
  } catch (error) {
    console.log("Get Active Package Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// update the package

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      totalMeals,
      validityDays,
      maxItemsPerMeal,
      isAddOnAllowed,
      features,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Package Id",
        success: false,
      });
    }

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({
        message: "Package not found",
        success: false,
      });
    }

    // Recurring Mapping (same as createPackage)
    const recurringMap = {
      7: { interval: "week", interval_count: 1 },
      15: { interval: "day", interval_count: 15 },
      30: { interval: "month", interval_count: 1 },
      90: { interval: "month", interval_count: 3 },
      180: { interval: "month", interval_count: 6 },
      365: { interval: "year", interval_count: 1 },
    };

    // Update Name
    if (name !== undefined) {
      const normalizedName = name.trim().toLowerCase();

      const existingPackage = await Package.findOne({
        name: normalizedName,
        _id: { $ne: id },
      });

      if (existingPackage) {
        return res.status(400).json({
          message: "Package already exists",
          success: false,
        });
      }

      packageData.name = normalizedName;
    }

    // Update Description
    if (description !== undefined) {
      packageData.description = description.trim();
    }

    // Update Price (numeric validation only, Stripe price create niche hoga)
    let numericPrice = packageData.price;
    if (price !== undefined) {
      numericPrice = Number(price);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({
          message: "Price should be a positive number",
          success: false,
        });
      }
    }

    // Update Total Meals
    if (totalMeals !== undefined) {
      const numericMeal = Number(totalMeals);

      if (isNaN(numericMeal) || numericMeal <= 0) {
        return res.status(400).json({
          message: "Total meals should be a positive number",
          success: false,
        });
      }

      packageData.totalMeals = numericMeal;
    }

    // Update Max Items Per Meal
    if (maxItemsPerMeal !== undefined) {
      const numericMaxItems = Number(maxItemsPerMeal);

      if (isNaN(numericMaxItems) || numericMaxItems <= 0) {
        return res.status(400).json({
          message: "Max items per meal should be a positive number",
          success: false,
        });
      }

      packageData.maxItemsPerMeal = numericMaxItems;
    }

    // Update Validity Days (numeric validation only, Stripe recurring niche hoga)
    let numericValidityDays = packageData.validityDays;
    if (validityDays !== undefined) {
      numericValidityDays = Number(validityDays);

      if (isNaN(numericValidityDays) || numericValidityDays <= 0) {
        return res.status(400).json({
          message: "Validity days should be a positive number",
          success: false,
        });
      }

      if (!recurringMap[numericValidityDays]) {
        return res.status(400).json({
          message: "Unsupported validity period",
          success: false,
        });
      }
    }

    // Update Add-On Permission
    if (isAddOnAllowed !== undefined) {
      if (typeof isAddOnAllowed !== "boolean") {
        return res.status(400).json({
          message: "isAddOnAllowed must be true or false",
          success: false,
        });
      }

      packageData.isAddOnAllowed = isAddOnAllowed;
    }

    // Update Features
    let cleanedFeatures = packageData.features;
    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array",
        });
      }

      cleanedFeatures = features
        .map((feature) => feature.trim())
        .filter((feature) => feature.length > 0);

      if (cleanedFeatures.length < 1 || cleanedFeatures.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Features must contain between 1 and 10 items",
        });
      }

      packageData.features = cleanedFeatures;
    }

    // ---------------- STRIPE SYNC ----------------

    // 1) Product-level fields update (name, description, metadata)
    await stripe.products.update(packageData.stripeProductId, {
      name: packageData.name,
      description: packageData.description || "",
      metadata: {
        validityDays: numericValidityDays.toString(),
        totalMeals: packageData.totalMeals.toString(),
        maxItemsPerMeal: packageData.maxItemsPerMeal.toString(),
        features: JSON.stringify(cleanedFeatures),
      },
    });

    // 2) Price change hone par nayi price banani padegi (Stripe price immutable hoti hai)
    const priceChanged = price !== undefined && numericPrice !== packageData.price;
    const validityChanged =
      validityDays !== undefined && numericValidityDays !== packageData.validityDays;

    if (priceChanged || validityChanged) {
      const recurring = recurringMap[numericValidityDays];

      const newStripePrice = await stripe.prices.create({
        product: packageData.stripeProductId,
        unit_amount: numericPrice * 100,
        currency: "inr",
        recurring,
      });

      // Purani price ko default se hata kar archive karo
      const oldStripePriceId = packageData.stripePriceId;

      await stripe.products.update(packageData.stripeProductId, {
        default_price: newStripePrice.id,
      });

      if (oldStripePriceId) {
        try {
          await stripe.prices.update(oldStripePriceId, { active: false });
        } catch (archiveErr) {
          console.error("Old Price Archive Error:", archiveErr.message);
        }
      }

      packageData.stripePriceId = newStripePrice.id;
    }

    // DB values update (price/validityDays) after stripe sync success
    packageData.price = numericPrice;
    packageData.validityDays = numericValidityDays;

    await packageData.save();

    return res.status(200).json({
      message: "Package updated successfully",
      data: packageData,
      success: true,
    });
  } catch (error) {
    console.log("Update Package Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// toggle status of package
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid package data",
        success: false,
      });
    }

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({
        message: "Package Not Found",
        success: false,
      });
    }

    const newStatus = !packageData.isActive;

    // ---------------- STRIPE SYNC ----------------

    // Product ka active status toggle karo
    if (packageData.stripeProductId) {
      try {
        await stripe.products.update(packageData.stripeProductId, {
          active: newStatus,
        });
      } catch (productErr) {
        console.error("Stripe Product Toggle Error:", productErr.message);

        return res.status(500).json({
          message: "Failed to update package status on Stripe",
          success: false,
        });
      }
    }

    // Price ka active status bhi toggle karo
    // (Deactivate karte waqt price band ho jaye, activate karte waqt wapas available ho)
    if (packageData.stripePriceId) {
      try {
        await stripe.prices.update(packageData.stripePriceId, {
          active: newStatus,
        });
      } catch (priceErr) {
        console.error("Stripe Price Toggle Error:", priceErr.message);

        // Rollback product status agar price update fail ho jaye (consistency ke liye)
        try {
          await stripe.products.update(packageData.stripeProductId, {
            active: !newStatus,
          });
        } catch (rollbackErr) {
          console.error("Stripe Product Rollback Error:", rollbackErr.message);
        }

        return res.status(500).json({
          message: "Failed to update package price status on Stripe",
          success: false,
        });
      }
    }

    // ---------------- DB UPDATE ----------------
    packageData.isActive = newStatus;
    await packageData.save();

    return res.status(200).json({
      message: `Package ${
        packageData.isActive ? "activated" : "deactivated"
      } successfully`,
      data: packageData,
      success: true,
    });
  } catch (error) {
    console.log("Toggle status of Package error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// delete the package
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid package ID",
        success: false,
      });
    }

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({
        message: "Package Not found",
        success: false,
      });
    }

    // Optional but recommended: check active subscriptions using this package
    // (Agar tumhare paas Subscription/UserPackage jaisa model hai to uncomment karo)
    /*
    const activeSubscribers = await Subscription.findOne({
      packageId: packageData._id,
      status: "active",
    });

    if (activeSubscribers) {
      return res.status(400).json({
        message: "Cannot delete package with active subscribers",
        success: false,
      });
    }
    */

    // ---------------- STRIPE CLEANUP ----------------

    // 1) Archive the Price first (Stripe requires this before archiving product in some flows)
    if (packageData.stripePriceId) {
      try {
        await stripe.prices.update(packageData.stripePriceId, {
          active: false,
        });
      } catch (priceErr) {
        console.error("Stripe Price Archive Error:", priceErr.message);
      }
    }

    // 2) Archive the Product (Stripe doesn't support hard delete if product has prices/usage)
    if (packageData.stripeProductId) {
      try {
        await stripe.products.update(packageData.stripeProductId, {
          active: false,
        });
      } catch (productErr) {
        console.error("Stripe Product Archive Error:", productErr.message);

        // Agar product ke saath koi prices hain jo archive nahi hue, Stripe error de sakta hai
        return res.status(500).json({
          message: "Failed to archive package on Stripe",
          success: false,
        });
      }
    }

    // ---------------- DB DELETE ----------------
    await packageData.deleteOne();

    return res.status(200).json({
      message: "Package Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Delete the package error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
