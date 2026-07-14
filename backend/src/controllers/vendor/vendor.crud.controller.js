import mongoose from "mongoose";
import Vendor from "../../models/vendor.model.js";
import User from "../../models/User.model.js";
import Package from "../../models/package.model.js";
import cloudinary from "../../config/cloudinary.js";
import bcrypt from "bcryptjs";
import passwordGenerator from "../../utils/generatePassword.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import { vendorWelcomeTemplate } from "../../utils/email/welcomeTemplate.js";
import { removeLocalFile } from "../../middleware/upload.middleware.js";
import { getPagination } from "../../utils/pagination.js";

// Parses the servicePincodes field sent from the client, which arrives as a
// JSON-stringified array (multipart form fields can only carry strings).
const parseServicePincodes = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((p) => String(p).trim()).filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((p) => String(p).trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
};

// Multipart form fields arrive as strings ("true"/"false"), plain JSON
// requests may send a real boolean.
const parseBoolean = (raw) => raw === true || raw === "true";

// A (pincode, package) combination — or (pincode, custom) for the vendor
// designated to handle "Build Your Own Package" orders — may only ever
// belong to one vendor. Returns the conflicting vendor, if any.
const findPincodeConflict = ({ excludeVendorId, isCustomPackageVendor, packageId, pincodes }) => {
  if (!pincodes.length) return null;

  const query = {
    servicePincodes: { $in: pincodes },
    ...(isCustomPackageVendor
      ? { isCustomPackageVendor: true }
      : { package: packageId }),
  };
  if (excludeVendorId) query._id = { $ne: excludeVendorId };

  return Vendor.findOne(query).lean();
};

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
      package: packageId,
    } = req.body;

    const servicePincodes = parseServicePincodes(req.body.servicePincodes);
    const isCustomPackageVendor = parseBoolean(req.body.isCustomPackageVendor);

    // 1. Validation (Sabse pehle check taaki faltu DB processing na ho)
    if (
      !name ||
      !email ||
      !phone ||
      !organizationName ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      (!packageId && !isCustomPackageVendor)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Email, Phone, Organization Name, Address, City, State, Pincode and either a Package or the Custom Package flag are required",
      });
    }

    if (packageId && isCustomPackageVendor) {
      return res.status(400).json({
        success: false,
        message:
          "A vendor can either serve a fixed package or be the custom package vendor, not both.",
      });
    }

    if (packageId) {
      if (!mongoose.Types.ObjectId.isValid(packageId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Package ID.",
        });
      }

      const packageExists = await Package.findById(packageId).lean();
      if (!packageExists) {
        return res.status(404).json({
          success: false,
          message: "Package not found.",
        });
      }
    }

    // A (pincode, package) combination — or (pincode, custom) — can only
    // ever serve one vendor. Delivery pincodes are typically assigned later
    // from the Assign Vendor page, so this only fires if some were provided
    // at creation time.
    const conflictingVendor = await findPincodeConflict({
      isCustomPackageVendor,
      packageId,
      pincodes: servicePincodes,
    });

    if (conflictingVendor) {
      return res.status(409).json({
        success: false,
        message: isCustomPackageVendor
          ? "One or more of these pincodes are already served by another custom package vendor."
          : "One or more of these pincodes are already served by another vendor for this package.",
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
      package: packageId || undefined,
      isCustomPackageVendor,
      servicePincodes,
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
    const { search } = req.query;
    const { page, limit, skip } = getPagination(req);

    let query = {};

    if (search) {
      const matchingUsers = await User.find({
        role: "vendor",
        name: { $regex: search, $options: "i" },
      }).select("_id");

      query = {
        $or: [
          { organizationName: { $regex: search, $options: "i" } },
          { userId: { $in: matchingUsers.map((u) => u._id) } },
        ],
      };
    }

    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .populate("userId", "name phone email")
        .populate("package", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Vendor.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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
      .populate("package", "name")
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
      package: packageId,
    } = req.body;

    const servicePincodes =
      req.body.servicePincodes !== undefined
        ? parseServicePincodes(req.body.servicePincodes)
        : undefined;

    const isCustomPackageVendorProvided = req.body.isCustomPackageVendor !== undefined;
    const requestedIsCustomPackageVendor = isCustomPackageVendorProvided
      ? parseBoolean(req.body.isCustomPackageVendor)
      : undefined;

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

    // The route allows role "vendor" so vendors can edit their own profile,
    // but that only proves *a* vendor is calling this - it doesn't stop
    // vendor A from passing vendor B's id. Only admins may touch any vendor;
    // a vendor caller must own the record they're updating.
    if (req.user.role === "vendor" && String(vendor.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this vendor profile.",
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

    // Package / custom-package-vendor change
    const effectiveIsCustomPackageVendor =
      requestedIsCustomPackageVendor !== undefined
        ? requestedIsCustomPackageVendor
        : vendor.isCustomPackageVendor;

    if (effectiveIsCustomPackageVendor && packageId) {
      return res.status(400).json({
        success: false,
        message:
          "A vendor can either serve a fixed package or be the custom package vendor, not both.",
      });
    }

    if (packageId) {
      if (!mongoose.Types.ObjectId.isValid(packageId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Package ID.",
        });
      }

      const packageExists = await Package.findById(packageId).lean();
      if (!packageExists) {
        return res.status(404).json({
          success: false,
          message: "Package not found.",
        });
      }
    }

    const effectivePackageId = packageId || vendor.package;
    if (!effectiveIsCustomPackageVendor && !effectivePackageId) {
      return res.status(400).json({
        success: false,
        message: "Package is required unless this vendor is the custom package vendor.",
      });
    }

    const packageChanged = packageId && packageId !== String(vendor.package);
    const customFlagChanged =
      requestedIsCustomPackageVendor !== undefined &&
      requestedIsCustomPackageVendor !== vendor.isCustomPackageVendor;

    // Service pincodes and/or package/custom-flag change — re-check the
    // (pincode, package) or (pincode, custom) uniqueness rule against every
    // other vendor. This must also run when only the package/flag changes
    // (servicePincodes omitted), since the vendor's existing pincodes now
    // need to be unique under the new package/flag too. Empty array is
    // allowed (unassigns delivery areas).
    if (servicePincodes !== undefined || packageChanged || customFlagChanged) {
      const effectivePincodes =
        servicePincodes !== undefined ? servicePincodes : vendor.servicePincodes;

      const conflictingVendor = await findPincodeConflict({
        excludeVendorId: vendor._id,
        isCustomPackageVendor: effectiveIsCustomPackageVendor,
        packageId: effectivePackageId,
        pincodes: effectivePincodes,
      });

      if (conflictingVendor) {
        return res.status(409).json({
          success: false,
          message: effectiveIsCustomPackageVendor
            ? "One or more of these pincodes are already served by another custom package vendor."
            : "One or more of these pincodes are already served by another vendor for this package.",
        });
      }

      if (servicePincodes !== undefined) {
        vendor.servicePincodes = servicePincodes;
      }
    }

    if (requestedIsCustomPackageVendor !== undefined) {
      vendor.isCustomPackageVendor = requestedIsCustomPackageVendor;
    }

    if (effectiveIsCustomPackageVendor) {
      vendor.package = null;
    } else if (packageId) {
      vendor.package = packageId;
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
    // validateModifiedOnly so a partial update (e.g. just servicePincodes)
    // doesn't fail on unrelated fields missing from older vendor documents
    // created before those fields existed on the schema.
    await vendor.save({ validateModifiedOnly: true });

    const updatedVendor = await Vendor.findById(vendor._id)
      .populate("userId", "name email phone role")
      .populate("package", "name")
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
