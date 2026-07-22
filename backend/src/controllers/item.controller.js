import Item from "../models/item.model.js";
import mongoose from "mongoose";
import Category from "../models/category.model.js";
import {getPagination} from "../utils/pagination.js"
import cloudinary from "../config/cloudinary.js";
import { removeLocalFile } from "../middleware/upload.middleware.js";

// ➤ Create Item
export const createItem = async (req, res) => {
  try {
    // 1. req.body se allergies ko destructure kiya
    const { name, description, category, allergies } = req.body;

    // Required fields validation (Price hata diya kyunki aapke model mein nahi hai)
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    // Category Id validation
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id",
      });
    }

    // Category exists or not
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Duplicate item check
    const existingItem = await Item.findOne({
      name: name.trim(),
    });

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "Item already exists",
      });
    }

    let parsedAllergies = [];

    if (allergies) {
      if (Array.isArray(allergies)) {
        parsedAllergies = allergies;
      } else {
        try {
          const parsed = JSON.parse(allergies);

          parsedAllergies = Array.isArray(parsed)
            ? parsed
            : [parsed];
        } catch {
          parsedAllergies = [allergies];
        }
      }
    }

    let imageData = { url: "", public_id: "" };
    if (req.file && req.file.path) {
      const filePath = req.file.path;
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "items",
        });
        imageData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } finally {
        removeLocalFile(filePath);
      }
    }

    const item = await Item.create({
      name,
      description,
      category,
      allergies: parsedAllergies,
      image: imageData,
    });

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➤ Get All Items
export const getAllItems = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { category } = req.query;

    const filter = {};
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Category Id",
        });
      }
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate("category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Item.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: items.length,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➤ Get Active Items (user-facing, for dropdowns/checklists)
export const getActiveItems = async (req, res) => {
  try {
    const items = await Item.find({ isActive: true })
      .select("name")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➤ Get Single Item
export const getSingleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➤ Update Item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Item Id",
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    // Handle Allergies (Agar FormData se stringified array aa raha hai)
    if (req.body.allergies) {
      try {
        updateData.allergies = JSON.parse(req.body.allergies);
      } catch (e) {
        // Agar pehle se hi proper array hai ya parse nahi ho paa raha
        updateData.allergies = req.body.allergies;
      }
    }

    if (req.file && req.file.path) {
      const filePath = req.file.path;
      try {
        if (item.image?.public_id) {
          await cloudinary.uploader.destroy(item.image.public_id);
        }

        const result = await cloudinary.uploader.upload(filePath, {
          folder: "items",
        });

        updateData.image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } finally {
        removeLocalFile(filePath);
      }
    } else {
      // No new file uploaded via multipart - `image` may arrive as an empty
      // string from FormData, which would otherwise wipe the existing image.
      delete updateData.image;
    }

    // findByIdAndUpdate short syntax defaults to returning old document unless specified
    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true, // Yeh 'returnDocument: "after"' ki jagah standard Mongoose syntax hai
      runValidators: true,
    }).populate("category");

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating item",
    });
  }
};

// ➤ Delete Item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Item Id",
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.image?.public_id) {
      await cloudinary.uploader.destroy(item.image.public_id);
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting item",
    });
  }
};

// ➤ Disable / Enable Item
export const toggleItemStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Item Id",
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.isActive = !item.isActive;

    await item.save();

    return res.status(200).json({
      success: true,
      message: `Item ${item.isActive ? "activated" : "deactivated"
        } successfully`,
      item,
    });
  } catch (error) {
    console.error("Toggle Item Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating item status",
    });
  }
};

// get item by category
export const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id",
      });
    }

    // Check category exists
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const items = await Item.find({
      category: categoryId,
      isActive: true,
    })
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get Items By Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching items",
    });
  }
};

