import mongoose from "mongoose";
import Category from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";
import { removeLocalFile } from "../middleware/upload.middleware.js";
import Meal from "../models/meals.model.js";

// contoller for create category
export const createCategory = async (req, res) => {
  try {
    const { name, meal, foodType } = req.body;

    let image = {
      url: "",
      publicId: "",
    };

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name required",
      });
    }

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });

      image = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      };

      removeLocalFile(req.file.path);
    }

    const category = await Category.create({
      name: name.trim(),
      meal,
      foodType,
      image,
      createdBy: req.user?.id || null,
      name,

      image: {
        url: image?.url || "",
        public_id: image?.public_id || "",
      },

      createdBy: null,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.log("Create Category Error", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// contoller for getallcatgries

export const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: allCategories.length,
      data: allCategories,
    });
  } catch (error) {
    console.log("Get all categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get one category controller
export const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Category Id",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Category fetched successfully",
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get Category error", error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

// getActive category

export const getActiveCategory = async (req, res) => {
  try {
    const category = await Category.find({ isActive: true }).sort({
      createAt: -1,
    });

    return res.status(200).json({
      message: "Active Category fetch succesfully",
      success: true,
      data: category,
    });
  } catch (error) {
    console.log("Get Active Category error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//  contoller for update category

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, meal, foodType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // update name + duplicate check
    if (name !== undefined) {
      const trimmedName = name.trim().toLowerCase();

      const existingCategory = await Category.findOne({
        name: trimmedName,
      });

      if (existingCategory && existingCategory._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.name = trimmedName;
    }

    // update meal
    if (meal !== undefined) {
      category.meal = meal;
    }

    // update food type
    if (foodType !== undefined) {
      category.foodType = foodType.toLowerCase();
    }

    // update image
    if (req.file) {
      // delete old cloudinary image
      if (category.image?.publicId) {
        await cloudinary.uploader.destroy(category.image.publicId);
      }

      // upload new image
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });

      category.image = {
        url: uploaded.secure_url,

        publicId: uploaded.public_id,
      };

      // delete local file
      removeLocalFile(req.file.path);
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log("Update Category Error", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// disable the category

export const disableCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not Found",
      });
    }

    category.isActive = !category.isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${
        category.isActive ? "enabled" : "disabled"
      } successfully`,

      data: category,
    });
  } catch (error) {
    console.log("Toggle the category error", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// contoller for delete category

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // check linked meals

    const linkedMeals = await Meal.findOne({
      category: id,
    });

    if (linkedMeals) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category linked with meals",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get category by food type

export const getCategoryByFoodType = async (req, res) => {
  try {
    const { foodType } = req.params

    const allowedType = ["veg", "non-veg"];

    if (!allowedType.includes(foodType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid food type",
      });
    }

    const category = await Category.find({
      foodType: foodType.toLowerCase(),

      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: `${foodType} categories fetched successfully`,
      success: true,
      data: category,
      count : category.length
    });
  } catch (error) {
    console.log("Get category by food type error", error)

    return res.status(500).json({
      message:"Internal Server Error",
      success: false
    })
  }
};
