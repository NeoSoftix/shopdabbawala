import mongoose from "mongoose";
import Vendor from "../models/vendor.model.js";
import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import { passwordGenerator } from "../utils/generatePassword.js";
import { sendEmail } from "../utils/email/sendEmail.js";
import vendorWelcomeTemplate from "../utils/email/welcomeTemplate.js";
import { removeLocalFile } from "../middleware/upload.middleware.js";

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

    const existingUser = await User.findOne({
      $or: [{ email: email.trim().toLowerCase() }, { phone: phone.trim() }],
    }).lean();

    if (existingUser) {
      const isEmailMatch = existingUser.email === email.trim().toLowerCase();

      return res.status(409).json({
        success: false,
        message: isEmailMatch
          ? "Email already exists"
          : "Phone number already exists",
      });
    }

    // generate password
    const plainPassword = passwordGenerator();

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Upload logo
    let logoData = {
      url: "",
      public_id: "",
    };
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "vendors",
        });

        logoData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } finally {
        removeLocalFile(req.file.path);
      }
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
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

    const populatedVendor = await Vendor.findById(vendor._id)
      .populate("userId", "name email phone")
      .lean();

    // Send Welcome Email
    try {
      await sendEmail(
        email,
        "Welcome to Tiffin Delivery",
        vendorWelcomeTemplate(name, email, plainPassword),
      );
    } catch (error) {
      console.error("Welcome Email Error:", error.message);
    }

    return res.status(201).json({
      message: "Vendor Create successfully",
      success: true,
      data: populatedVendor,
    });
  } catch (error) {
    console.log("Create Vendor error", error);

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
          await cloudinary.uploader.destroy(
            vendor.logo.public_id
          );
        }

        const result = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "vendors",
          }
        );

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
      organizationName?.trim() ||
      vendor.organizationName;

    vendor.address =
      address?.trim() ||
      vendor.address;

    vendor.city =
      city?.trim() ||
      vendor.city;

    vendor.state =
      state?.trim() ||
      vendor.state;

    vendor.pincode =
      pincode?.trim() ||
      vendor.pincode;

    vendor.description =
      description?.trim() ||
      vendor.description;

    await user.save();
    await vendor.save();

    const updatedVendor = await Vendor.findById(
      vendor._id
    )
      .populate(
        "userId",
        "name email phone role"
      )
      .lean();

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: updatedVendor,
    });
  } catch (error) {
    console.error(
      "Update Vendor Error:",
      error.message
    );

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vendor Id",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.isActive = isActive;

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: `Vendor ${isActive ? "activated" : "deactivated"} successfully`,
      data: vendor,
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

    // Delete vendor from MongoDB
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
