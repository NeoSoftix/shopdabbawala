import Package from "../../models/package.model.js";
import stripe from "../../config/stripe.js";
import { getRecurring } from "./package.utils.js";

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
      discountPercentage,
      features,
    } = req.body;

    // Required Fields Validation
    if (
      !name ||
      !validityDays ||
      !totalMeals ||
      !price ||
      !features
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Price, Total Meals, Validity Days and Features are required.",
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

    // Numeric Validations
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0.",
      });
    }

    // Discount Percentage Validation (optional field) — actual discounted price is derived from this
    let numericDiscountedPrice = null;
    if (
      discountPercentage !== undefined &&
      discountPercentage !== null &&
      discountPercentage !== ""
    ) {
      const numericDiscountPercentage = Number(discountPercentage);

      if (
        isNaN(numericDiscountPercentage) ||
        numericDiscountPercentage <= 0 ||
        numericDiscountPercentage >= 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Discount percentage must be between 0 and 100.",
        });
      }

      numericDiscountedPrice = Number(
        (numericPrice - (numericPrice * numericDiscountPercentage) / 100).toFixed(2),
      );
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

    const recurring = getRecurring(numericValidityDays);

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
        features: JSON.stringify(cleanedFeatures),
        discountedPrice:
          numericDiscountedPrice !== null ? numericDiscountedPrice.toString() : "",
      },
    });

    // Create Recurring Price on Stripe (actual price)
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
      discountedPrice: numericDiscountedPrice,
      totalMeals: numericMeals,
      validityDays: numericValidityDays,
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
