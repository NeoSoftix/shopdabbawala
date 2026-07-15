import MealPlan from "../../models/mealSchedule.model.js";

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

    // Items must be an array (only if new items list is provided)
    if (items !== undefined && !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items must be an array of ObjectIds",
      });
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
