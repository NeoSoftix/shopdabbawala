import Meal from "../models/meals.model.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import { removeLocalFile } from "../middleware/upload.middleware.js";

// for create the meals

export const createMeal = async (req, res) => {
  try {
    const { name } = req.body;

    let image = {
      url: "",
      public_id: "",
    };

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required",
        success: false,
      });
    }

    const existingMeals = await Meal.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingMeals) {
      return res.status(400).json({
        message: "Meals already exist",
        success: false,
      });
    }

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "meals",
      });

      image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

      fs.unlinkSync(req.file.path);
    }

    const meal = await Meal.create({
      name,
      image,
      createdBy: req.user?.id || null,
    });

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    return res.status(201).json({
      success: true,
      message: "Meals created succesfully",
      data: meal,
    });
  } catch (error) {
    console.log("Create meal error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get meals all meals

export const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Fetch all meals",
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    console.log("Get all meals error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get meals by id

export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Meal Id",
        success: false,
      });
    }

    const meal = await Meal.findById(id);

    if (!meal) {
      return res.status(404).json({
        message: "Meals not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Successfully fetch Meal",
      success: true,
      data: meal,
    });
  } catch (error) {
    console.log("Get Meal By ID error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// update the meal

export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Meal Id",
        success: false,
      });
    }

    const meal = await Meal.findById(id);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
        success: false,
      });
    }
    if (name !== undefined) {
      const trimmedName = name.trim();

      const existingName = await Meal.findOne({
        name: {
          $regex: `^${trimmedName}$`,
          $options: "i",
        },
      });

      if (existingName && existingName._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Meal already exists",
        });
      }

      meal.name = trimmedName;
    }

    // update image
    if (req.file) {
      // delete old cloudinary image
      if (meal.image?.public_id) {
        await cloudinary.uploader.destroy(meal.image.public_id);
      }

      // upload new image
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "meals",
      });

      meal.image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };

      // delete local file
      removeLocalFile(req.file.path);
    }

    await meal.save();

    return res.status(200).json({
      message: "Meal Update Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in updating the Meal", error);

    return res.status(500).json({
      message: "Internal Server error",
      success: false,
      data: meal,
    });
  }
};

// active/disable the meal

export const toggleMealStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Meal ID",
        success: false,
      });
    }

    const meal = await Meal.findById(id);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
        success: false,
      });
    }

    meal.isActive = !meal.isActive;

    await meal.save();

    return res.status(200).json({
      success: true,
      message: `Meal ${meal.isActive ? "Activated" : "Disabled"} successfully`,
      data: meal,
    });
  } catch (error) {
    console.error("Toggle the Meal error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// contoller for delte the meal

export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Meal ID",
        success: false,
      });
    }

    // find meal
    const meal = await Meal.findById(id);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found",
        success: false,
      });
    }

    // delete cloudinary image
    if (meal.image?.public_id) {
      await cloudinary.uploader.destroy(meal.image.public_id);
    }

    // delete meal from db
    await Meal.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Meal deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete Meal Error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get active meal

export const getActiveMeal = async (req, res) => {
  try {
    const meals = await Meal.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Active meals fetched successfully",
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    console.log("Get Active Meals Error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
