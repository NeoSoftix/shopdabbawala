import Subscription from "../models/Subcription.model.js";
import Meal from "../models/meals.model.js"
import mongoose from "mongoose";

export const createSubscription = async (req, res) => {
  try {
    const {
      mealSize,
      preference,
      duration,
      meals,
      quantity,
      deliveryMethod,
      startDate,
    } = req.body;

    // Required Fields
    if (
      !mealSize ||
      !preference ||
      !duration ||
      !meals ||
      !deliveryMethod ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    // Validate Meal Id
    if (!mongoose.Types.ObjectId.isValid(meals)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Meal Id.",
      });
    }

    // Check Meal Exists
    const meal = await Meal.findById(meals);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found.",
      });
    }

    // Meal Plan Configuration
    const mealPlans = {
      Basic: {
        price: 299,
        totalMeals: 15,
        maxItemsPerMeal: 4,
      },
      Medium: {
        price: 499,
        totalMeals: 30,
        maxItemsPerMeal: 8,
      },
      Premium: {
        price: 799,
        totalMeals: 30,
        maxItemsPerMeal: 10,
      },
    };

    const selectedPlan = mealPlans[mealSize];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal size.",
      });
    }

    // Validate Start Date
    const calculatedStartDate = new Date(startDate);

    if (isNaN(calculatedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    // Calculate End Date
    const endDate = new Date(calculatedStartDate);

    switch (duration) {
      case "Trial":
        endDate.setDate(endDate.getDate() + 1);
        break;

      case "Weekly":
        endDate.setDate(endDate.getDate() + 7);
        break;

      case "Monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "Quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid duration.",
        });
    }

    const subscription = await Subscription.create({
      mealSize,
      price: selectedPlan.price,
      totalMeals: selectedPlan.totalMeals,
      mealsUsed: 0,
      maxItemsPerMeal: selectedPlan.maxItemsPerMeal,
      preference,
      duration,
      meals: meal._id,
      quantity: quantity || 1,
      deliveryMethod,
      startDate: calculatedStartDate,
      endDate,
    });

    return res.status(201).json({
      success: true,
      message: "Custom package created successfully.",
      subscription,
    });

  } catch (error) {
    console.error("Create Subscription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
