import mongoose from "mongoose";
import Subscription from "../../models/Subcription.model.js"; // corrected model file name
import Item from "../../models/item.model.js";
import MealSchedule from "../../models/mealSchedule.model.js";

export const createMealSchedule = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      subscriptionId,
      day,
      items,
    } = req.body;

    // ================= VALIDATION =================

    if (!subscriptionId || !day || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID, day and items are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID.",
      });
    }

    const allowedDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    if (!allowedDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: "Invalid day.",
      });
    }

    // ================= CHECK SUBSCRIPTION =================

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId,
      status: "active",
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Active subscription not found.",
      });
    }

    // ================= FORMAT ITEMS =================

    const formattedItems = items.map((meal) => ({
      item: meal.item,
      quantity: Number(meal.quantity) || 1,
    }));

    // ================= VALIDATE ITEM IDS =================

    for (const meal of formattedItems) {
      if (!mongoose.Types.ObjectId.isValid(meal.item)) {
        return res.status(400).json({
          success: false,
          message: `Invalid item ID: ${meal.item}`,
        });
      }

      if (meal.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1.",
        });
      }
    }

    // ================= CHECK ITEMS EXIST =================

    const itemIds = formattedItems.map(
      (meal) => meal.item
    );

    const existingItems = await Item.countDocuments({
      _id: {
        $in: itemIds,
      },
    });

    if (existingItems !== new Set(itemIds).size) {
      return res.status(400).json({
        success: false,
        message: "One or more selected items do not exist.",
      });
    }

    // ================= FIND SCHEDULE =================

    let mealSchedule = await MealSchedule.findOne({
      subscriptionId,
      userId,
      status: "active",
    });

    // ================= CREATE NEW =================

    if (!mealSchedule) {
      mealSchedule = await MealSchedule.create({
        subscriptionId,
        userId,

        schedule: [
          {
            day,
            items: formattedItems,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: `${day} meal schedule created successfully.`,
        data: mealSchedule,
      });
    }

    // ================= UPDATE EXISTING DAY =================

    const dayIndex = mealSchedule.schedule.findIndex(
      (scheduleDay) => scheduleDay.day === day
    );

    if (dayIndex !== -1) {
      mealSchedule.schedule[dayIndex].items =
        formattedItems;
    } else {
      mealSchedule.schedule.push({
        day,
        items: formattedItems,
      });
    }

    await mealSchedule.save();

    return res.status(200).json({
      success: true,
      message: `${day} meal schedule saved successfully.`,
      data: mealSchedule,
    });

  } catch (error) {
    console.error("Create Meal Schedule Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save meal schedule.",
      error: error.message,
    });
  }
};

export const getMyMealPlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subscriptionId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    if (
      !subscriptionId ||
      !mongoose.Types.ObjectId.isValid(subscriptionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID",
      });
    }

    const mealSchedule = await MealSchedule.findOne({
      userId,
      subscriptionId,
      status: "active",
    })
      .populate({
        path: "schedule.items.item",
        model: "Item",
      })
      .populate({
        path: "subscriptionId",
        model: "Subscription",
      });

    if (!mealSchedule) {
      return res.status(200).json({
        success: true,
        message: "No meal schedule created yet",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meal schedule fetched successfully",
      data: mealSchedule,
    });
  } catch (error) {
    console.error(
      "Get Meal Schedule Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meal schedule",
      error: error.message,
    });
  }
};
