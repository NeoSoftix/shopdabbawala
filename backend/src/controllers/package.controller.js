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
      currency: "usd",
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

    const recurringMap = {
      7: { interval: "week", interval_count: 1 },
      15: { interval: "day", interval_count: 15 },
      30: { interval: "month", interval_count: 1 },
      90: { interval: "month", interval_count: 3 },
      180: { interval: "month", interval_count: 6 },
      365: { interval: "year", interval_count: 1 },
    };

    // Track karo ki Stripe-relevant fields mein se koi actually change hua ya nahi
    let stripeMetadataChanged = false;

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

      if (normalizedName !== packageData.name) {
        stripeMetadataChanged = true;
      }

      packageData.name = normalizedName;
    }

    if (description !== undefined) {
      const trimmedDescription = description.trim();

      if (trimmedDescription !== packageData.description) {
        stripeMetadataChanged = true;
      }

      packageData.description = trimmedDescription;
    }

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

    if (totalMeals !== undefined) {
      const numericMeal = Number(totalMeals);

      if (isNaN(numericMeal) || numericMeal <= 0) {
        return res.status(400).json({
          message: "Total meals should be a positive number",
          success: false,
        });
      }

      if (numericMeal !== packageData.totalMeals) {
        stripeMetadataChanged = true;
      }

      packageData.totalMeals = numericMeal;
    }

    if (maxItemsPerMeal !== undefined) {
      const numericMaxItems = Number(maxItemsPerMeal);

      if (isNaN(numericMaxItems) || numericMaxItems <= 0) {
        return res.status(400).json({
          message: "Max items per meal should be a positive number",
          success: false,
        });
      }

      if (numericMaxItems !== packageData.maxItemsPerMeal) {
        stripeMetadataChanged = true;
      }

      packageData.maxItemsPerMeal = numericMaxItems;
    }

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

    // isAddOnAllowed — Stripe se koi lena dena nahi, isliye stripeMetadataChanged trigger nahi karta
    if (isAddOnAllowed !== undefined) {
      if (typeof isAddOnAllowed !== "boolean") {
        return res.status(400).json({
          message: "isAddOnAllowed must be true or false",
          success: false,
        });
      }

      packageData.isAddOnAllowed = isAddOnAllowed;
    }

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

      // Array comparison — agar content change hua hai to hi flag set karo
      const oldFeaturesStr = JSON.stringify(packageData.features);
      const newFeaturesStr = JSON.stringify(cleanedFeatures);

      if (oldFeaturesStr !== newFeaturesStr) {
        stripeMetadataChanged = true;
      }

      packageData.features = cleanedFeatures;
    }

    const priceChanged = price !== undefined && numericPrice !== packageData.price;
    const validityChanged =
      validityDays !== undefined && numericValidityDays !== packageData.validityDays;

    // validityDays metadata mein bhi store hota hai, isliye ise bhi count karo
    if (validityChanged) {
      stripeMetadataChanged = true;
    }

    // ---------------- DB SAVE PEHLE ----------------
    packageData.price = numericPrice;
    packageData.validityDays = numericValidityDays;

    await packageData.save();

    // ---------------- AB STRIPE SYNC (sirf zaroorat hone par) ----------------
    if (packageData.stripeProductId) {
      // Sirf tab product update karo jab actually kuch relevant change hua ho
      if (stripeMetadataChanged) {
        try {
          await stripe.products.update(packageData.stripeProductId, {
            name: packageData.name,
            description: packageData.description || "",
            metadata: {
              validityDays: packageData.validityDays.toString(),
              totalMeals: packageData.totalMeals.toString(),
              maxItemsPerMeal: packageData.maxItemsPerMeal.toString(),
              features: JSON.stringify(packageData.features),
            },
          });
        } catch (stripeErr) {
          console.error("Stripe Product Update Error:", stripeErr.message);
        }
      }

      // Price/validity change hone par hi nayi price banao
      if (priceChanged || validityChanged) {
        try {
          const recurring = recurringMap[numericValidityDays];

          const newStripePrice = await stripe.prices.create({
            product: packageData.stripeProductId,
            unit_amount: numericPrice * 100,
            currency: "usd",
            recurring,
          });

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
          await packageData.save();
        } catch (priceErr) {
          console.error("Stripe Price Update Error:", priceErr.message);
        }
      }
    }

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
      return res.status(400).json({ message: "Invalid package data", success: false });
    }

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({ message: "Package Not Found", success: false });
    }

    const newStatus = !packageData.isActive;

    // ---------------- STRIPE SYNC ----------------
    if (packageData.stripeProductId) {
      try {
        await stripe.products.update(packageData.stripeProductId, { active: newStatus });
      } catch (productErr) {
        console.error("Stripe Product Toggle Error:", productErr.message);
        return res.status(500).json({ message: "Failed to update package status on Stripe", success: false });
      }
    }

    if (packageData.stripePriceId) {
      try {
        if (!newStatus) {
          // Deactivating: pehle default_price hatao, tabhi price archive hone dega Stripe
          await stripe.products.update(packageData.stripeProductId, { default_price: "" });
          await stripe.prices.update(packageData.stripePriceId, { active: false });
        } else {
          // Reactivating: price ko active karo aur wapas default bana do
          await stripe.prices.update(packageData.stripePriceId, { active: true });
          await stripe.products.update(packageData.stripeProductId, {
            default_price: packageData.stripePriceId,
          });
        }
      } catch (priceErr) {
        console.error("Stripe Price Toggle Error:", priceErr.message);

        try {
          await stripe.products.update(packageData.stripeProductId, { active: !newStatus });
        } catch (rollbackErr) {
          console.error("Stripe Product Rollback Error:", rollbackErr.message);
        }

        return res.status(500).json({ message: "Failed to update package price status on Stripe", success: false });
      }
    }

    // ---------------- DB UPDATE ----------------
    packageData.isActive = newStatus;
    await packageData.save();

    return res.status(200).json({
      message: `Package ${packageData.isActive ? "activated" : "deactivated"} successfully`,
      data: packageData,
      success: true,
    });
  } catch (error) {
    console.log("Toggle status of Package error", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
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

    // ---------------- STRIPE CLEANUP ----------------
    // Sirf product ko archive karo. Price ko chhedne ki zaroorat nahi —
    // product inactive hote hi naye purchases automatically band ho jate hain.
    if (packageData.stripeProductId) {
      try {
        await stripe.products.update(packageData.stripeProductId, {
          active: false,
        });
      } catch (productErr) {
        console.error("Stripe Product Archive Error:", productErr.message);

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
