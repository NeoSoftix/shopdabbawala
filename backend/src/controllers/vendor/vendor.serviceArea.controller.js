import mongoose from "mongoose";
import Vendor from "../../models/vendor.model.js";
import Category from "../../models/category.model.js";

// selectAreaAndCategory
export const selectAreaAndCategory = async (req, res) => {
  try {
    const { category, area } = req.body;

    if (!category || !area) {
      return res.status(400).json({
        message: "Category And Area is required",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        message: "Invalid Category ID format",
        success: false,
      });
    }

    const isCategoryExist = await Category.findById(category).lean();
    if (!isCategoryExist) {
      return res.status(404).json({
        message: "This  category does not exist in our system",
        success: false,
      });
    }

    const formattedArea = area.trim().toLowerCase();

    const currentVendor = await Vendor.findOne({ userId: req.user.id });

    if (!currentVendor) {
      return res.status(400).json({
        message: "Vendor profile not found",
      });
    }

    const globalDuplicate = await Vendor.findOne({
      _id: { $ne: currentVendor.id },
      serviceZones: {
        $elemMatch: {
          area: formattedArea,
          category,
        },
      },
    }).lean();

    if (globalDuplicate) {
      return res.status(400).json({
        message: `A vendor is already serving the ${isCategoryExist.name} category in ${area}. Please select a different area or category.`,
        success: false,
      });
    }

    const localDuplicate = currentVendor.serviceZones.some(
      (zone) =>
        zone.area === formattedArea &&
        String(zone.category) === String(category),
    );

    if (localDuplicate) {
      return res.status(400).json({
        message: `You have already added the selected category for ${area}.`,
        success: false,
      });
    }

    currentVendor.serviceZones.push({
      area: formattedArea,
      category: category,
    });

    await currentVendor.save();

    const updatedVendor = await Vendor.findById(currentVendor._id)
      .populate("userId", "name email phone")
      .populate("serviceZones.category", "name")
      .lean();

    return res.status(200).json({
      message: "Service Zone Added Successfully",
      data: updatedVendor,
      success: true,
    });
  } catch (error) {
    console.log("Select Area and Category Area error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// remove the category and Area
export const removeAreaAndCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the incoming ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Service Zone ID.",
      });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    // Check if the zone exists before attempting removal
    const zoneExists = vendor.serviceZones.some(
      (zone) => zone._id.toString() === id
    );

    if (!zoneExists) {
      return res.status(404).json({
        success: false,
        message: "Service Zone not found. It may have already been deleted.",
      });
    }

    // If the zone exists, pull it from the array
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendor._id,
      {
        $pull: {
          serviceZones: {
            _id: id,
          },
        },
      },
      { new: true }
    ).populate("serviceZones.category", "name");


    return res.status(200).json({
      success: true,
      message: "Service Zone Removed Successfully",
      data: updatedVendor,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get the all service area of a vendor
export const getServiceAreaOfvendor = async (req, res) => {
  try {
    const vendorServiceArea = await Vendor.findOne({
      userId: req.user.id,
    })
      .select("serviceZones")
      .populate("serviceZones.category", "name");

    if (!vendorServiceArea) {
      return res.status(404).json({
        message: "No vendor Service Zone found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Service Zone Fetched Successfully",
      success: true,
      count: vendorServiceArea.serviceZones.length,
      data: vendorServiceArea.serviceZones,
    });
  } catch (error) {
    console.log("Get Vendor Service Error", error);

    return res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
};
