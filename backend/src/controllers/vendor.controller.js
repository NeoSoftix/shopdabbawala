import mongoose from "mongoose";
import Vendor from "../models/vendor.model.js";
import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import passwordGenerator from "../utils/generatePassword.js";
import { sendEmail } from "../utils/email/sendEmail.js";
import { vendorWelcomeTemplate } from "../utils/email/welcomeTemplate.js";
import { removeLocalFile } from "../middleware/upload.middleware.js";
import Category from "../models/category.model.js";

// contoller for create Vendor

export const createVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      description,
      organizationName,
      pincode,
      state,
      city,
      address,
      phone,
    } = req.body;

    // 1. Validation (Sabse pehle check taaki faltu DB processing na ho)
    if (
      !name ||
      !email ||
      !phone ||
      !organizationName ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Email, Phone, Organization Name, Address, City, State and Pincode are required",
      });
    }

    const formattedEmail = email.trim().toLowerCase();
    const formattedPhone = phone.trim();

    // 2. Step-by-Step Execution (Bina Promise.all ke standard await flow)
    const existingUser = await User.findOne({
      $or: [{ email: formattedEmail }, { phone: formattedPhone }],
    }).lean();

    if (existingUser) {
      const isEmailMatch = existingUser.email === formattedEmail;
      return res.status(409).json({
        success: false,
        message: isEmailMatch
          ? "Email already exists"
          : "Phone number already exists",
      });
    }

    // Password Generation & Hashing
    const plainPassword = passwordGenerator();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 3. Safe Cloudinary Upload Flow
    let logoData = { url: "", public_id: "" };
    if (req.file && req.file.path) {
      const filePath = req.file.path; // Path ko variable me safe rakhlein
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "vendors",
        });
        logoData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } finally {
        removeLocalFile(filePath); // Safe file cleanup
      }
    }

    // 4. DB Insertions
    const user = await User.create({
      name: name.trim(),
      email: formattedEmail,
      phone: formattedPhone,
      password: hashedPassword,
      role: "vendor",
    });

    const vendor = await Vendor.create({
      userId: user._id,
      organizationName: organizationName.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      logo: logoData,
      description: description?.trim() || "",
    });

    const populatedVendor = {
      ...(vendor.toObject ? vendor.toObject() : vendor),
      userId: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };

    sendEmail(
      formattedEmail,
      "Welcome to Tiffin Delivery",
      vendorWelcomeTemplate(name.trim(), formattedEmail, plainPassword),
    ).catch((error) =>
      console.error("Background Welcome Email Error:", error.message),
    );

    // 7. Fast Response Return
    return res.status(201).json({
      message: "Vendor Created successfully",
      success: true,
      data: populatedVendor,
    });
  } catch (error) {
    console.error("Create Vendor error", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// contoller for get all vendor

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    console.error("Get All Vendors Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get One Vendor by ID

export const getOneVendor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vendor Id",
      });
    }

    const vendor = await Vendor.findById(id)
      .populate("userId", "name email phone role")
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Get One Vendor Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update the vendor controller
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      organizationName,
      address,
      city,
      state,
      pincode,
      description,
    } = req.body;

    // Validate Vendor Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vendor Id",
      });
    }

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const user = await User.findById(vendor.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Associated user not found",
      });
    }

    // Email duplicate check
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();

      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      user.email = normalizedEmail;
    }

    // Phone duplicate check
    if (phone) {
      const normalizedPhone = phone.trim();

      const existingPhone = await User.findOne({
        phone: normalizedPhone,
        _id: { $ne: user._id },
      });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists",
        });
      }

      user.phone = normalizedPhone;
    }

    // Upload new logo
    if (req.file) {
      try {
        if (vendor.logo?.public_id) {
          await cloudinary.uploader.destroy(vendor.logo.public_id);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "vendors",
        });

        vendor.logo = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } finally {
        removeLocalFile(req.file.path);
      }
    }

    // Update User fields
    user.name = name?.trim() || user.name;

    // Update Vendor fields
    vendor.organizationName =
      organizationName?.trim() || vendor.organizationName;

    vendor.address = address?.trim() || vendor.address;

    vendor.city = city?.trim() || vendor.city;

    vendor.state = state?.trim() || vendor.state;

    vendor.pincode = pincode?.trim() || vendor.pincode;

    vendor.description = description?.trim() || vendor.description;

    await user.save();
    await vendor.save();

    const updatedVendor = await Vendor.findById(vendor._id)
      .populate("userId", "name email phone role")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: updatedVendor,
    });
  } catch (error) {
    console.error("Update Vendor Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// for toggle Vendor active/inActive status
export const toggleVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // 1. Id Validate ki
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vendor Id",
      });
    }

    // 2. Data type Validate kiya
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    // 3. Pehle Vendor ko dhoondo
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // 4. Property badlo aur .save() chala do (No Warning, Auto Updated Data Return)
    vendor.isActive = isActive;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: `Vendor ${isActive ? "activated" : "deactivated"} successfully`,
      data: vendor, // Isme apne aap updated data hi jayega
    });
  } catch (error) {
    console.error("Toggle Vendor Status Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete the vendor cotroller
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Vendor Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vendor Id",
      });
    }

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Delete logo from Cloudinary
    if (vendor.logo?.public_id) {
      await cloudinary.uploader.destroy(vendor.logo.public_id);
    }

    // Delete associated user account
    await User.findByIdAndDelete(vendor.userId);

    // Delete vendor profile
    await Vendor.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("Delete Vendor Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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

// get vendor profile 
export const vendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      userId: req.user.id,
    }).populate("userId", "name email phone")

    if(!vendor) {
      return res.status(404).json({
        message:"Vendor not found",
        success:false
      })
    }

    return res.status(200).json({
      message:"Vendor profile fetch successfully",
      success:true,
      data:vendor
    })
  } catch (error) {
    console.log("Get Profile Of Profile Error")

    return res.status(500).json({
      message:"Internal Server error",
      success:false
    })
  }
}