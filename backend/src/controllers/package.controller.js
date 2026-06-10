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
    } = req.body;

    // Required Fields Validation
    if (!name || !validityDays || !totalMeals || !price) {
      return res.status(400).json({
        message: "Name, Validity Days, Total Tiffin and Price are required",
        success: false,
      });
    }

    // Normalize Name
    const normalizedName = name.trim().toLowerCase();

    // Check Existing Package
    const existingPackage = await Package.findOne({
      name: normalizedName,
    });

    if (existingPackage) {
      return res.status(400).json({
        message: "Package name already exists",
        success: false,
      });
    }

    // Numeric Validation
    const numericPrice = Number(price);
    const numericMeal = Number(totalMeals);
    const numericValidityDays = Number(validityDays);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
        success: false,
      });
    }

    if (isNaN(numericMeal) || numericMeal <= 0) {
      return res.status(400).json({
        message: "Total tiffins must be greater than 0",
        success: false,
      });
    }

    if (isNaN(numericValidityDays) || numericValidityDays <= 0) {
      return res.status(400).json({
        message: "Validity days must be greater than 0",
        success: false,
      });
    }

    // Create Package
    const packageData = await Package.create({
      name: normalizedName,
      description,
      price: numericPrice,
      totalMeals: numericMeal,
      validityDays: numericValidityDays,
    });

    return res.status(201).json({
      message: "Package created successfully",
      data: packageData,
      success: true,
    });
  } catch (error) {
    console.error("Create Package Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


// get all package 

export const getAllPackage = async (req, res) => {
    try {
        const packages = await Package.find().lean()

        if(!packages) {
            return res.status("No Package Found")
        }

        return res.status(200).json({
            message:"All Packages Fecth successfully",
            success:false
        })

    } catch (error) {
        
    }
}