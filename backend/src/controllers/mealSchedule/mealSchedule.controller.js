import mongoose from "mongoose";
import Subscription from "../../models/Subcription.model.js"; // corrected model file name
import Item from "../../models/item.model.js";
import MealSchedule from "../../models/mealSchedule.model.js";
import User from "../../models/User.model.js";
import Order from "../../models/Order.model.js";
import { findServingVendor } from "../../utils/findServingVendor.js";
import { notifyOrderEvent, notifyUser } from "../../utils/notifyOrderEvent.js";

const notifyVendorOfOrder = async ({ vendorId, orderId, userName, date, itemCount, isNewOrder, planName }) => {
  const dayLabel = date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  const title = isNewOrder ? "New Order Received" : "Order Updated";
  const planSuffix = planName ? ` (${planName} plan)` : "";
  const message = isNewOrder
    ? `${userName || "A customer"} placed a meal order for ${dayLabel}${planSuffix} (${itemCount} item${itemCount === 1 ? "" : "s"}).`
    : `${userName || "A customer"} updated their ${dayLabel} meal order${planSuffix} (${itemCount} item${itemCount === 1 ? "" : "s"}).`;

  await notifyOrderEvent({
    vendorId,
    orderId,
    title,
    message,
    emailHeading: isNewOrder ? "New Meal Order Received" : "Meal Order Updated",
    emailLines: [
      { label: "Customer", value: userName || "A customer" },
      { label: "Plan", value: planName || "N/A" },
      { label: "Date", value: dayLabel },
      { label: "Items", value: itemCount },
    ],
  });
};

// Upserts the Order that represents this weekday's meal order. Always
// creates/updates the order (so admin sees every order placed), and attaches
// the vendor serving the user's pincode when one can be resolved (so vendor
// dashboards only see orders for their own service area). Never throws - a
// failure here shouldn't block the meal schedule itself from being saved.
const syncVendorOrder = async ({ userId, subscriptionId, subscription, date, formattedItems }) => {
  try {
    const user = await User.findById(userId).select("pincode address name");
    const pincode = subscription.pincode || user?.pincode || "";

    const vendor = pincode ? await findServingVendor(pincode, subscription.package) : null;

    if (pincode && !vendor) {
      console.warn(`No serving vendor found for pincode ${pincode}; order will be created without a vendor.`);
    } else if (!pincode) {
      console.warn(`No pincode found for user ${userId}; order will be created without a vendor.`);
    }

    const itemIds = formattedItems.map((meal) => meal.item);
    const itemDocs = await Item.find({ _id: { $in: itemIds } }).select("name");
    const nameById = new Map(itemDocs.map((doc) => [doc._id.toString(), doc.name]));

    const orderItems = formattedItems.map((meal) => ({
      item: meal.item,
      name: nameById.get(meal.item.toString()) || "",
      qty: meal.quantity,
    }));

    const deliveryAddress = user?.address || (pincode ? `Pincode: ${pincode}` : "Not set");

    const planName = subscription.mealSize
      ? `${subscription.mealSize}${subscription.preference ? ` (${subscription.preference})` : ""}`
      : "";

    const existingOrder = await Order.findOne({
      user: userId,
      subscription: subscriptionId,
      date,
    });

    let orderId;
    let isNewOrder = false;

    if (existingOrder) {
      existingOrder.items = orderItems;
      existingOrder.vendor = vendor?._id || null;
      existingOrder.pincode = pincode || null;
      existingOrder.deliveryAddress = deliveryAddress;
      existingOrder.planName = planName || existingOrder.planName;
      existingOrder.status = "Pending";
      await existingOrder.save();
      orderId = existingOrder._id;
    } else {
      const createdOrder = await Order.create({
        user: userId,
        subscription: subscriptionId,
        vendor: vendor?._id,
        pincode: pincode || undefined,
        date,
        deliveryAddress,
        planName: planName || undefined,
        items: orderItems,
        status: "Pending",
      });
      orderId = createdOrder._id;
      isNewOrder = true;
    }

    const dayLabel = date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    if (vendor?._id) {
      await notifyVendorOfOrder({
        vendorId: vendor._id,
        orderId,
        userName: user?.name,
        date,
        itemCount: orderItems.length,
        isNewOrder,
        planName,
      });
    }

    notifyUser({
      userId,
      orderId,
      title: isNewOrder ? "Order Placed" : "Order Updated",
      message: isNewOrder
        ? `Your order for ${dayLabel}${planName ? ` (${planName} plan)` : ""} has been placed successfully.`
        : `Your order for ${dayLabel}${planName ? ` (${planName} plan)` : ""} has been updated.`,
    });
  } catch (error) {
    console.error("Sync Vendor Order Error:", error);
  }
};

export const createMealSchedule = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      subscriptionId,
      date,
      items,
    } = req.body;

    // ================= VALIDATION =================

    if (!subscriptionId || !date || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID, date and items are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID.",
      });
    }

    // Normalize with setUTCHours (not setHours) - "date" arrives as a
    // date-only "YYYY-MM-DD" string, which JS parses as UTC midnight. Using
    // the server's local timezone to zero the time can shift the calendar
    // day by ±1, causing this order's date to drift from the day-status key
    // the frontend looks it up by (making a just-scheduled day show as
    // "inactive" since no status is found for it).
    const requestDate = new Date(date);
    requestDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(requestDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (requestDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot schedule a meal for a past date.",
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

    const subStart = new Date(subscription.startDate);
    subStart.setUTCHours(0, 0, 0, 0);

    const subEnd = new Date(subscription.endDate);
    subEnd.setUTCHours(0, 0, 0, 0);

    if (requestDate < subStart || requestDate > subEnd) {
      return res.status(400).json({
        success: false,
        message: "Selected date is outside your plan's validity period.",
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
            date: requestDate,
            items: formattedItems,
          },
        ],
      });

      await syncVendorOrder({ userId, subscriptionId, subscription, date: requestDate, formattedItems });

      return res.status(201).json({
        success: true,
        message: `Meal schedule created successfully.`,
        data: mealSchedule,
      });
    }

    // ================= UPDATE EXISTING DATE =================

    const dayIndex = mealSchedule.schedule.findIndex(
      (scheduleDay) => new Date(scheduleDay.date).getTime() === requestDate.getTime()
    );

    if (dayIndex !== -1) {
      mealSchedule.schedule[dayIndex].items =
        formattedItems;
    } else {
      mealSchedule.schedule.push({
        date: requestDate,
        items: formattedItems,
      });
    }

    await mealSchedule.save();

    await syncVendorOrder({ userId, subscriptionId, subscription, date: requestDate, formattedItems });

    return res.status(200).json({
      success: true,
      message: `Meal schedule saved successfully.`,
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

// ➤ Active/inactive status of each saved day-order for a subscription -
// powers the toggle shown in the weekly preview.
export const getDayStatuses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subscriptionId } = req.params;

    if (!subscriptionId || !mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID",
      });
    }

    const orders = await Order.find({ user: userId, subscription: subscriptionId }).select("date active status");

    const statusByDay = {};
    orders.forEach((order) => {
      if (order.date) {
        const key = order.date.toISOString().slice(0, 10); // "YYYY-MM-DD"
        statusByDay[key] = { active: order.active, orderId: order._id, status: order.status };
      }
    });

    return res.status(200).json({
      success: true,
      statusByDay,
    });
  } catch (error) {
    console.error("Get Day Statuses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch day statuses",
      error: error.message,
    });
  }
};

// ➤ Toggles a single day's order between active/inactive (user pausing or
// resuming that day's delivery) and notifies the assigned vendor.
export const updateDayOrderStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subscriptionId, date, active } = req.body;

    if (!subscriptionId || !date || typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "subscriptionId, date and active are required.",
      });
    }

    const requestDate = new Date(date);
    requestDate.setUTCHours(0, 0, 0, 0);

    const order = await Order.findOne({ user: userId, subscription: subscriptionId, date: requestDate });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found for this date.",
      });
    }

    order.active = active;
    await order.save();

    if (order.vendor) {
      const user = await User.findById(userId).select("name");
      const customerName = user?.name || "A customer";
      const planLabel = order.planName ? ` for their ${order.planName} plan` : "";
      const dayLabel = requestDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

      await notifyOrderEvent({
        vendorId: order.vendor,
        orderId: order._id,
        title: active ? "Order Resumed" : "Order Paused",
        message: active
          ? `${customerName} resumed their ${dayLabel} meal order${planLabel} — resume delivery for this day.`
          : `${customerName} paused their ${dayLabel} meal order${planLabel} — do NOT deliver on this day.`,
        emailHeading: active ? "Meal Order Resumed" : "Meal Order Paused",
        emailIntro: active
          ? `${customerName} has switched their ${dayLabel} order${planLabel} back to active. Please resume delivering to them on this day.`
          : `${customerName} has marked their ${dayLabel} order${planLabel} as inactive. This means they should NOT be delivered a meal on this day until they resume it.`,
        emailLines: [
          { label: "Customer", value: customerName },
          { label: "Plan", value: order.planName || "N/A" },
          { label: "Date", value: dayLabel },
          { label: "Status", value: active ? "Active — deliver" : "Inactive — do not deliver" },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Update Day Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
