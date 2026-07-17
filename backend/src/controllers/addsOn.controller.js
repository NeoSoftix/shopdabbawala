import AddOn from "../models/addOns.model.js";
import mongoose from "mongoose";
import { getPagination } from "../utils/pagination.js";
import cloudinary from "../config/cloudinary.js";
import { removeLocalFile } from "../middleware/upload.middleware.js";

// for create the Add On
export const createAddOn = async (req, res) => {
  try {
    const { name, description, price, allergies } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required",
        success: false,
      });
    }

    const numericPrice = Number(price);

    if (isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid number",
      });
    }

    if (numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    const existingAddOns = await AddOn.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingAddOns) {
      return res.status(409).json({
        message: "Add On already exist",
        success: false,
      });
    }

    let imageData = { url: "", public_id: "" };
    if (req.file && req.file.path) {
      const filePath = req.file.path;
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "addons",
        });
        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } finally {
        removeLocalFile(filePath);
      }
    }

    // FormData (multipart, needed for the image file) can only carry
    // strings, so allergies arrives as a JSON-stringified array - falls
    // back to the raw value for plain-JSON callers that still send an array.
    let parsedAllergies = [];
    if (allergies) {
      if (Array.isArray(allergies)) {
        parsedAllergies = allergies;
      } else {
        try {
          const parsed = JSON.parse(allergies);
          parsedAllergies = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          parsedAllergies = [allergies];
        }
      }
    }

    const addOn = await AddOn.create({
      name: name.trim().toLowerCase(),
      description,
      price: numericPrice,
      allergies: parsedAllergies,
      image: imageData,
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({
      message: "Add-on created successfull",
      success: true,
      data: addOn,
    });
  } catch (error) {
    console.error("Create AddOns error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// for get all addsOn
export const getAllAddOns = async (req, res) => {
  try {

    const {page, limit, skip} = getPagination(req)

    const [addOns, total] = await Promise.all([
      AddOn.find().sort().limit(limit).skip(skip),

      AddOn.countDocuments()

    ])

   return res.status(200).json({
    message: "Add Ons fetched successfully",
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: addOns.length,
      data: addOns,
   })


  } catch (error) {
    console.log("Get all Add Ons error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// for get one Add On
export const getOneAddOns = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Add On Id",
        success: false,
      });
    }

    const addOn = await AddOn.findById(id);

    if (!addOn) {
      return res.status(404).json({
        message: "Add on not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Fetch Add On Successfully",
      success: true,
      data: addOn,
    });
  } catch (error) {
    console.log("Get single Add On error", error);

    return res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
};

// for update add on
export const updateAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, allergies } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Add On Id",
        success: false,
      });
    }

    const addOn = await AddOn.findById(id);

    if (!addOn) {
      return res.status(404).json({
        message: "Add On not found",
        success: false,
      });
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          message: "Price should be a valid positive number",
          success: false,
        });
      }

      addOn.price = numericPrice;
    }

    if (name !== undefined) {
      const trimmedName = name.trim().toLowerCase();

      const existingAddOn = await AddOn.findOne({
        name: trimmedName,
        _id: { $ne: id },
      });

      if (existingAddOn) {
        return res.status(409).json({
          success: false,
          message: "Add On already exists",
        });
      }

      addOn.name = trimmedName;
    }

    if (description !== undefined) {
      addOn.description = description;
    }

    if (allergies !== undefined) {
      if (Array.isArray(allergies)) {
        addOn.allergies = allergies;
      } else {
        try {
          const parsed = JSON.parse(allergies);
          addOn.allergies = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          addOn.allergies = [allergies];
        }
      }
    }

    if (req.file && req.file.path) {
      const filePath = req.file.path;
      try {
        if (addOn.image?.public_id) {
          await cloudinary.uploader.destroy(addOn.image.public_id);
        }

        const result = await cloudinary.uploader.upload(filePath, {
          folder: "addons",
        });

        addOn.image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } finally {
        removeLocalFile(filePath);
      }
    }

    await addOn.save();

    return res.status(200).json({
      message: "Add On updated successfully",
      success: true,
      data: addOn,
    });
  } catch (error) {
    console.log("Update Add On error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// for delete the Add On
export const deleteAddOn = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Add On Id",
        success: false,
      });
    }

    const addOn = await AddOn.findById(id);

    if (!addOn) {
      return res.status(404).json({
        message: "Add On not found",
        success: false,
      });
    }

    if (addOn.image?.public_id) {
      await cloudinary.uploader.destroy(addOn.image.public_id);
    }

    await addOn.deleteOne();

    return res.status(200).json({
      message: "Add On deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Delete Add On error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// toggelStatus the Add On
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Add On Id",
        success: false,
      });
    }

    const addon = await AddOn.findById(id);

    if (!addon) {
      return res.status(404).json({
        message: "Add On not found",
        success: false,
      });
    }

    // Toggle status
    addon.isActive = !addon.isActive;

    await addon.save();

    return res.status(200).json({
      message: `Add On ${
        addon.isActive ? "activated" : "deactivated"
      } successfully`,
      success: true,
      data: addon,
    });
  } catch (error) {
    console.log("Toggle status error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get active Add On
export const getActiveAddOns = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [addOns, total] = await Promise.all([
      AddOn.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      AddOn.countDocuments({ isActive: true }),
    ]);

    return res.status(200).json({
      message: "Active Add Ons fetched successfully",
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: addOns.length,
      data: addOns,
    });
  } catch (error) {
    console.log("Get active Add Ons error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
