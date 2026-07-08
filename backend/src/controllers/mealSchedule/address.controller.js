import mongoose from "mongoose";
import MealPlan from "../../models/mealSchedule.model.js";

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
