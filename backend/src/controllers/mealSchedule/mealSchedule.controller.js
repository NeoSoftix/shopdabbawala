import mongoose from "mongoose";
import Subscription from "../../models/Subcription.model.js"; // corrected model file name
import Item from "../../models/item.model.js";
import MealSchedule from "../../models/mealSchedule.model.js";
import User from "../../models/User.model.js";
import Order from "../../models/Order.model.js";
import { findServingVendor } from "../../utils/findServingVendor.js";
import { notifyOrderEvent } from "../../utils/notifyOrderEvent.js";

const notifyVendorOfOrder = async ({ vendorId, orderId, userName, day, itemCount, isNewOrder, planName }) => {
  const title = isNewOrder ? "New Order Received" : "Order Updated";
  const planSuffix = planName ? ` (${planName} plan)` : "";
  const message = isNewOrder
    ? `${userName || "A customer"} placed a meal order for ${day}${planSuffix} (${itemCount} item${itemCount === 1 ? "" : "s"}).`
    : `${userName || "A customer"} updated their ${day} meal order${planSuffix} (${itemCount} item${itemCount === 1 ? "" : "s"}).`;

  await notifyOrderEvent({
    vendorId,
    orderId,
    title,
    message,
    emailHeading: isNewOrder ? "New Meal Order Received" : "Meal Order Updated",
    emailLines: [
      { label: "Customer", value: userName || "A customer" },
      { label: "Plan", value: planName || "N/A" },
      { label: "Day", value: day },
      { label: "Items", value: itemCount },
    ],
  });
};

// Upserts the Order that represents this weekday's meal order. Always
// creates/updates the order (so admin sees every order placed), and attaches
// the vendor serving the user's pincode when one can be resolved (so vendor
// dashboards only see orders for their own service area). Never throws - a
// failure here shouldn't block the meal schedule itself from being saved.
const syncVendorOrder = async ({ userId, subscriptionId, subscription, day, formattedItems }) => {
  try {
    const user = await User.findById(userId).select("pincode address name");
    const pincode = subscription.pincode || user?.pincode || "";

    const vendor = pincode ? await findServingVendor(pincode) : null;

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
      day,
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
        day,
        deliveryAddress,
        planName: planName || undefined,
        items: orderItems,
        status: "Pending",
      });
      orderId = createdOrder._id;
      isNewOrder = true;
    }

    if (vendor?._id) {
      await notifyVendorOfOrder({
        vendorId: vendor._id,
        orderId,
        userName: user?.name,
        day,
        itemCount: orderItems.length,
        isNewOrder,
        planName,
      });
    }
  } catch (error) {
    console.error("Sync Vendor Order Error:", error);
  }
};

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

      await syncVendorOrder({ userId, subscriptionId, subscription, day, formattedItems });

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

    await syncVendorOrder({ userId, subscriptionId, subscription, day, formattedItems });

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

    const orders = await Order.find({ user: userId, subscription: subscriptionId }).select("day active status");

    const statusByDay = {};
    orders.forEach((order) => {
      if (order.day) {
        statusByDay[order.day] = { active: order.active, orderId: order._id, status: order.status };
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
    const { subscriptionId, day, active } = req.body;

    if (!subscriptionId || !day || typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "subscriptionId, day and active are required.",
      });
    }

    const order = await Order.findOne({ user: userId, subscription: subscriptionId, day });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found for this day.",
      });
    }

    order.active = active;
    await order.save();

    if (order.vendor) {
      const user = await User.findById(userId).select("name");
      const customerName = user?.name || "A customer";
      const planLabel = order.planName ? ` for their ${order.planName} plan` : "";

      await notifyOrderEvent({
        vendorId: order.vendor,
        orderId: order._id,
        title: active ? "Order Resumed" : "Order Paused",
        message: active
          ? `${customerName} resumed their ${day} meal order${planLabel} — resume delivery for this day.`
          : `${customerName} paused their ${day} meal order${planLabel} — do NOT deliver on this day.`,
        emailHeading: active ? "Meal Order Resumed" : "Meal Order Paused",
        emailIntro: active
          ? `${customerName} has switched their ${day} order${planLabel} back to active. Please resume delivering to them on this day.`
          : `${customerName} has marked their ${day} order${planLabel} as inactive. This means they should NOT be delivered a meal on this day until they resume it.`,
        emailLines: [
          { label: "Customer", value: customerName },
          { label: "Plan", value: order.planName || "N/A" },
          { label: "Day", value: day },
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
