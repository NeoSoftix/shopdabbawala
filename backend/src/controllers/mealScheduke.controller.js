import mongoose from "mongoose";
import MealPlan from "../models/mealSchedule.model.js";
import Subscription from "../models/Subcription.model.js"; // corrected model file name
import Meal from "../models/meals.model.js"; // corrected model file name

// ➤ Initialize Meal Plan
export const initializeMealPlan = async (req, res) => {
  try {
    const { subscriptionId, address } = req.body;
    const userId = req.user.id; // verifyToken middleware provides this

    // 1. Required fields validation
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    if (!address || !address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({
        success: false,
        message: "A default address with street, city, state, and pincode is required to initialize the schedule",
      });
    }

    // 2. Validate subscriptionId format
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Subscription ID",
      });
    }

    // 3. Find active subscription belonging to the user
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId,
      status: "active",
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Active subscription not found for this user",
      });
    }

    // 4. Check if Meal Plan is already initialized
    let existingPlan = await MealPlan.findOne({ subscription: subscriptionId });
    if (existingPlan) {
      return res.status(409).json({
        success: false,
        message: "Meal plan already initialized for this subscription",
        mealPlan: existingPlan,
      });
    }

    // 5. Generate a new address with Mongoose ObjectId
    const defaultAddress = {
      _id: new mongoose.Types.ObjectId(),
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      addressType: address.addressType || "Home",
      isDefault: true,
    };

    // 6. Initialize schedule with the default address ID
    const initialSchedule = {
      Monday: { items: [], addressId: defaultAddress._id },
      Tuesday: { items: [], addressId: defaultAddress._id },
      Wednesday: { items: [], addressId: defaultAddress._id },
      Thursday: { items: [], addressId: defaultAddress._id },
      Friday: { items: [], addressId: defaultAddress._id },
      Saturday: { items: [], addressId: defaultAddress._id },
      Sunday: { items: [], addressId: defaultAddress._id },
    };

    // 7. Create Meal Plan in DB
    const mealPlan = await MealPlan.create({
      user: userId,
      subscription: subscriptionId,
      addresses: [defaultAddress],
      schedule: initialSchedule,
    });

    return res.status(201).json({
      success: true,
      message: "Meal plan initialized successfully",
      mealPlan,
    });
  } catch (error) {
    console.error("Initialize Meal Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
