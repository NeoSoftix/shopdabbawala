import mongoose from "mongoose";
import Package from "../models/package.model.js";

// Create Package
export const createPackage = async (req, res) => {
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

    // Create Package
    const packageData = await Package.create({
      name: normalizedName,
      description: description?.trim(),
      price: numericPrice,
      totalMeals: numericMeals,
      validityDays: numericValidityDays,
      maxItemsPerMeal: numericMaxItems,
      features: cleanedFeatures,
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: packageData,
    });
  } catch (error) {
    console.error("Create Package Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Package already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
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
      isAddOnAllowed,
      features
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

    // Update Price
    if (price !== undefined) {
      const numericPrice = Number(price);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({
          message: "Price should be a positive number",
          success: false,
        });
      }

      packageData.price = numericPrice;
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

    // Update Validity Days
    if (validityDays !== undefined) {
      const numericValidityDays = Number(validityDays);

      if (isNaN(numericValidityDays) || numericValidityDays <= 0) {
        return res.status(400).json({
          message: "Validity days should be a positive number",
          success: false,
        });
      }

      packageData.validityDays = numericValidityDays;
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

    // update faetures
        if (features !== undefined) {
      if (!Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array",
        });
      }

      const cleanedFeatures = features
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

    packageData.isActive = !packageData.isActive;

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

    await packageData.deleteOne();

    return res.status(200).json({
      message: "Package Delete Successfully",
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
