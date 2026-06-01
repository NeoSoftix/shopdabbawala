import mongoose from "mongoose";
import Category from "../models/category.model.js";

// contoller for create category

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name of category is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description,

      image: {
        url: image?.url || "",
        public_id: image?.public_id || "",
      },

      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.log("Create category error:", error);

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

//  contoller for update category

export const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Category Id",
        success: false,
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    if (name !== undefined) {
      const existingCategory = await Category.findOne({
        name: name.trim().toLowerCase(),
      });

      if (existingCategory && existingCategory._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.name = name.trim().toLowerCase();
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (image) {
      category.image = {
        url: image.url || category.image.url,
        public_id: image.public_id || category.image.public_id,
      };
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log("Update Category error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// disable the category

export const disableCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
         success:false,
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

      data: category
    });
  } catch (error) {
    console.log("Toggle the category error", error)

    return res.status(500).json({
        success: false,
        message:"Internal Server Error"
    })
  }
};


// contoller for delete category 

export const deleteCategory = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id"
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // check linked meals

    // const linkedMeals = await Meal.findOne({
    //   category: id
    // });

    // if (linkedMeals) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Cannot delete category linked with meals"
    //   });
    // }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {

    console.log("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};