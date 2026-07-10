import VendorAssignment from "../models/vendorAssignment.model.js";
import mongoose from "mongoose";
import Vendor from "../models/vendor.model.js";
import Package from "../models/package.model.js";


// Admin assigns a vendor to serve a package in a pincode
export const assignVendor = async (req, res) => {
  try {
    const { vendor, pincode, package: packageId } = req.body;

    // Required fields
    if (!vendor || !pincode || !packageId) {
      return res.status(400).json({
        success: false,
        message: "Vendor, package and pincode are required.",
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(vendor) ||
      !mongoose.Types.ObjectId.isValid(packageId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vendor or Package ID.",
      });
    }

    const normalizedPincode = pincode.trim();

    // Check Vendor & Package
    const [vendorExists, packageExists] = await Promise.all([
      Vendor.findById(vendor).lean(),
      Package.findById(packageId).lean(),
    ]);

    if (!vendorExists) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    if (!packageExists) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    // Duplicate check — has ANY vendor already been assigned this package in this pincode
    const existingAssignment = await VendorAssignment.findOne({
      package: packageId,
      pincode: normalizedPincode,
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message:
          "This package is already assigned to another vendor in this pincode.",
      });
    }

    // Create Assignment
    const assignment = await VendorAssignment.create({
      vendor,
      package: packageId,
      pincode: normalizedPincode,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor assigned successfully.",
      data: assignment,
    });
  } catch (error) {
    console.error("Assign Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


//  admin reoves from assignment of area to vendor
export const removeAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Assignment ID.",
      });
    }

    const deleted = await VendorAssignment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment removed successfully.",
    });
  } catch (error) {
    console.error("Remove Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// admin views all vendor assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await VendorAssignment.find()
      .populate("vendor", "organizationName pincode")
      .populate("package", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Assignments fetched successfully.",
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error("Get Assignments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
