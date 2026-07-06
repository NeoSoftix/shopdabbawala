import mongoose from "mongoose";
import MealPlan from "../models/mealSchedule.model.js";
import Subscription from "../models/Subcription.model.js"; // corrected model file name
import Meal from "../models/meals.model.js"; // corrected model file name

//Initialize Meal Plan
export const initializeMealPlan = async (req, res) => {
  try {
    const { subscriptionId, address } = req.body;
    const userId = req.user.id; 

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

// Get Customer's Active Meal Plan
export const getMyMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    // Logged-in user ka meal plan dhundhein aur subscription/items ko populate karein
    const mealPlan = await MealPlan.findOne({ user: userId })
      .populate("subscription")
      .populate("schedule.Monday.items")
      .populate("schedule.Tuesday.items")
      .populate("schedule.Wednesday.items")
      .populate("schedule.Thursday.items")
      .populate("schedule.Friday.items")
      .populate("schedule.Saturday.items")
      .populate("schedule.Sunday.items");

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "No active meal plan found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      mealPlan,
    });
  } catch (error) {
    console.error("Get Meal Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Daily Schedule
export const updateDaySchedule = async (req, res) => {
  try {
    const { day, items, addressId } = req.body;
    const userId = req.user.id;

    // Required fields validation
    if (!day) {
      return res.status(400).json({
        success: false,
        message: "Day of the week is required",
      });
    }

    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (!validDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: "Invalid day of the week",
      });
    }

    // Active Meal Plan find karein
    const mealPlan = await MealPlan.findOne({ user: userId }).populate("subscription");
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "No active meal plan found",
      });
    }

    // Subscription status check
    const subscription = mealPlan.subscription;
    if (!subscription || subscription.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Your subscription is not active or has expired",
      });
    }

    // Fetch existing schedule for this day to perform fallback
    const currentDaySchedule = mealPlan.schedule[day] || { items: [], addressId: null };

    // Final values determination (if undefined, fallback to existing database values)
    const finalItems = items !== undefined ? items : currentDaySchedule.items;
    const finalAddressId = addressId !== undefined ? addressId : currentDaySchedule.addressId;

    // Items limit check (only if new items list is provided)
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: "Items must be an array of ObjectIds",
        });
      }
      if (items.length > subscription.maxItemsPerMeal) {
        return res.status(400).json({
          success: false,
          message: `Aap is plan me 1 din me maximum ${subscription.maxItemsPerMeal} items hi add kar sakte hain`,
        });
      }
    }

    // Address verification check (only if new addressId is provided)
    if (addressId !== undefined && addressId !== null) {
      const addressExists = mealPlan.addresses.some(
        (addr) => addr._id.toString() === addressId.toString()
      );
      if (!addressExists) {
        return res.status(400).json({
          success: false,
          message: "Given addressId does not exist in your addresses list",
        });
      }
    }

    // Update schedule for specific day
    mealPlan.schedule[day] = {
      items: finalItems,
      addressId: finalAddressId,
    };

    await mealPlan.save();

    return res.status(200).json({
      success: true,
      message: `${day} schedule updated successfully!`,
      mealPlan,
    });
  } catch (error) {
    console.error("Update Day Schedule Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Address to Meal Plan
export const addMealPlanAddress = async (req, res) => {
  try {
    const { street, city, state, pincode, addressType, isDefault } = req.body;
    const userId = req.user.id;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Street, city, state, and pincode are required",
      });
    }

    const mealPlan = await MealPlan.findOne({ user: userId });
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal plan not found",
      });
    }

    // Generate new address subdocument
    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      street,
      city,
      state,
      pincode,
      addressType: addressType || "Home",
      isDefault: isDefault || false,
    };

    // If isDefault is true, set others to false
    if (newAddress.isDefault) {
      mealPlan.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    mealPlan.addresses.push(newAddress);
    await mealPlan.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      mealPlan,
    });
  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Address from Meal Plan
export const deleteMealPlanAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const mealPlan = await MealPlan.findOne({ user: userId });
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal plan not found",
      });
    }

    // Match index
    const addressIndex = mealPlan.addresses.findIndex(
      (addr) => addr._id.toString() === addressId.toString()
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found in your list",
      });
    }

    const addressToDelete = mealPlan.addresses[addressIndex];

    // User must keep at least 1 address for scheduling
    if (mealPlan.addresses.length === 1) {
      return res.status(400).json({
        success: false,
        message: "You must have at least one delivery address.",
      });
    }

    // Remove the address
    mealPlan.addresses.splice(addressIndex, 1);

    // If default address is deleted, fallback to another default
    if (addressToDelete.isDefault && mealPlan.addresses.length > 0) {
      mealPlan.addresses[0].isDefault = true;
    }

    const defaultAddress = mealPlan.addresses.find((addr) => addr.isDefault) || mealPlan.addresses[0];

    // Reset schedules referencing the deleted address to the fallback default address
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach((day) => {
      if (
        mealPlan.schedule[day] &&
        mealPlan.schedule[day].addressId &&
        mealPlan.schedule[day].addressId.toString() === addressId.toString()
      ) {
        mealPlan.schedule[day].addressId = defaultAddress._id;
      }
    });

    await mealPlan.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully. Schedules using this address fallback to default address.",
      mealPlan,
    });
  } catch (error) {
    console.error("Delete Address Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
