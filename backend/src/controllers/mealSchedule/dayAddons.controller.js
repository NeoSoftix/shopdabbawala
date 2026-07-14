import mongoose from "mongoose";
import Order from "../../models/Order.model.js";

// Add-ons already paid for + saved per day for a subscription - powers the
// "already purchased" display and the extra-charge badge shown per day.
// Add-ons themselves are attached via the paid checkout flow (see
// backend/src/controllers/payment/dayAddonCheckout.js +
// fulfillDayAddonOrder.js), never written here directly.
export const getDayAddonsSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subscriptionId } = req.params;

    if (!subscriptionId || !mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID",
      });
    }

    const orders = await Order.find({
      user: userId,
      subscription: subscriptionId,
      "addons.0": { $exists: true },
    }).select("date addons");

    const addonsByDay = {};
    orders.forEach((order) => {
      if (!order.date) return;
      const key = order.date.toISOString().slice(0, 10);
      addonsByDay[key] = {
        addons: order.addons.map((a) => ({
          addonId: a.addon?.toString(),
          name: a.name,
          qty: a.qty,
          price: a.price,
        })),
        extraCharge: order.addons.reduce((sum, a) => sum + (a.price || 0) * (a.qty || 0), 0),
      };
    });

    return res.status(200).json({
      success: true,
      addonsByDay,
    });
  } catch (error) {
    console.error("Get Day Addons Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch add-ons summary",
      error: error.message,
    });
  }
};
