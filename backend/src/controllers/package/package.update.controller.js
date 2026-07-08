import mongoose from "mongoose";
import Package from "../../models/package.model.js";
import stripe from "../../config/stripe.js";
import { recurringMap } from "./package.utils.js";

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
