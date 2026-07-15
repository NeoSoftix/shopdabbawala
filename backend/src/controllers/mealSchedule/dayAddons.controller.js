import mongoose from "mongoose";
import Subscription from "../../models/Subcription.model.js";
import AddOn from "../../models/addOns.model.js";
import Order from "../../models/Order.model.js";
import User from "../../models/User.model.js";
import { getActiveWeekWindow } from "../../utils/getActiveWeekWindow.js";
import { notifyOrderEvent, notifyUser } from "../../utils/notifyOrderEvent.js";

// Add-ons are "extra" items riding along on a day that already has a
// regular meal order placed - they aren't tied to any Category/vendor of
// their own, so they always go to whichever vendor is already serving that
// day's meal. Replaces the day's full add-on list (same "full replace"
// semantics as createMealSchedule's items), so removing an add-on is just
// submitting the list without it.
export const updateDayAddons = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subscriptionId, date, addons } = req.body;

    if (!subscriptionId || !date || !Array.isArray(addons)) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID, date and addons are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID.",
      });
    }

    // Date-only value - normalize to UTC midnight (matches every other date
    // key in this app, e.g. createMealSchedule/getDayStatuses).
    const requestDate = new Date(date);
    requestDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(requestDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }

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

    const { windowStart, windowEnd } = getActiveWeekWindow(subscription, new Date());
    if (requestDate < windowStart || requestDate > windowEnd) {
      return res.status(400).json({
        success: false,
        message: "You can only manage add-ons within your current active week.",
      });
    }

    const order = await Order.findOne({
      user: userId,
      subscription: subscriptionId,
      date: requestDate,
    });

    if (!order || !order.items?.length) {
      return res.status(400).json({
        success: false,
        message: "Please schedule a meal for this day before adding add-ons.",
      });
    }

    // Same edit cutoff as the meal itself - 12 PM IST (noon, India Standard
    // Time = UTC+5:30, so 6:30 AM UTC) the day before. Mirrors
    // mealSchedule.controller.js's createMealSchedule cutoff.
    const editCutoff = new Date(requestDate);
    editCutoff.setUTCDate(editCutoff.getUTCDate() - 1);
    editCutoff.setUTCHours(6, 30, 0, 0);

    if (new Date() > editCutoff) {
      return res.status(400).json({
        success: false,
        message: "Add-ons can no longer be changed - changes are only allowed until 12 PM the day before.",
      });
    }

    const addonIds = addons.map((a) => a.addonId);
    for (const id of addonIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid add-on ID: ${id}`,
        });
      }
    }

    const addonDocs = await AddOn.find({ _id: { $in: addonIds }, isActive: true });
    if (addonDocs.length !== new Set(addonIds.map(String)).size) {
      return res.status(400).json({
        success: false,
        message: "One or more selected add-ons are unavailable.",
      });
    }
    const addonById = new Map(addonDocs.map((doc) => [doc._id.toString(), doc]));

    const orderAddons = addons
      .filter((a) => Number(a.quantity) > 0)
      .map((a) => {
        const doc = addonById.get(a.addonId);
        return {
          addon: doc._id,
          name: doc.name,
          qty: Number(a.quantity) || 1,
          price: doc.price,
        };
      });

    order.addons = orderAddons;
    await order.save();

    const extraCharge = orderAddons.reduce((sum, a) => sum + a.price * a.qty, 0);
    const dayLabel = requestDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    if (order.vendor) {
      const orderingUser = await User.findById(userId).select("name");
      await notifyOrderEvent({
        vendorId: order.vendor,
        orderId: order._id,
        title: "Add-ons Updated",
        message: `${orderingUser?.name || "A customer"} updated add-ons for ${dayLabel} ($${extraCharge.toFixed(2)} extra).`,
        emailHeading: "Order Add-ons Updated",
        emailLines: [
          { label: "Customer", value: orderingUser?.name || "A customer" },
          { label: "Date", value: dayLabel },
          { label: "Add-ons", value: orderAddons.map((a) => `${a.name} x${a.qty}`).join(", ") || "None" },
          { label: "Extra Charge", value: `$${extraCharge.toFixed(2)}` },
        ],
      });
    }

    notifyUser({
      userId,
      orderId: order._id,
      title: "Add-ons Updated",
      message: `Your add-ons for ${dayLabel} have been updated ($${extraCharge.toFixed(2)} extra).`,
    });

    return res.status(200).json({
      success: true,
      message: "Add-ons updated successfully.",
      data: order,
      extraCharge,
    });
  } catch (error) {
    console.error("Update Day Addons Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update add-ons.",
      error: error.message,
    });
  }
};

// Add-ons already saved per day for a subscription - powers the "already
// selected" prefill and the extra-charge badge shown per day.
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
