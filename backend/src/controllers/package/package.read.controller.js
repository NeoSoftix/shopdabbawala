import mongoose from "mongoose";
import Package from "../../models/package.model.js";

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
