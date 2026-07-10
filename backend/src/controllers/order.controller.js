import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import Vendor from "../models/vendor.model.js";
import Subscription from "../models/Subcription.model.js";
import { notifyOrderStatusChange } from "../utils/notifyOrderEvent.js";
import { getPagination } from "../utils/pagination.js";

// A vendor id that can never match a real document - used so a vendor
// without a profile yet sees zero orders, instead of falling through to
// `{}` (all orders) or matching orders that are legitimately unassigned
// (vendor: null, e.g. no vendor currently serves that pincode).
const NO_MATCH_ID = new mongoose.Types.ObjectId();

// Two Date instances (ignoring time-of-day) represent the same calendar day.
const isSameCalendarDay = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Builds the Order filter for the calling user: unscoped for admins,
// scoped to their own vendor id for vendors.
const getOrderScopeFilter = async (req) => {
  if (req.user.role !== "vendor") return {};

  const vendor = await Vendor.findOne({ userId: req.user.id });
  return { vendor: vendor?._id || NO_MATCH_ID };
};

// ➤ 1. Get total order count + status breakdown (Admin/Vendor) - powers dashboard stat cards
export const getOrderStats = async (req, res) => {
  try {
    const filter = await getOrderScopeFilter(req);

    const totalOrders = await Order.countDocuments(filter);

    const statusCounts = await Order.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byStatus = {
      Pending: 0,
      Accepted: 0,
      Rejected: 0,
      Preparing: 0,
      "On the way": 0,
      Delivered: 0,
      Cancelled: 0,
    };
    statusCounts.forEach(({ _id, count }) => {
      byStatus[_id] = count;
    });

    return res.status(200).json({
      success: true,
      stats: { totalOrders, byStatus },
    });
  } catch (error) {
    console.error("Get Order Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching order stats",
      error: error.message,
    });
  }
};

// ➤ Get the logged-in user's own orders, newest first (User) - powers the
// Order History / Today's Order tabs on the customer dashboard.
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user: userId })
      .populate("subscription", "mealSize preference duration")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your orders",
      error: error.message,
    });
  }
};

// ➤ 2. Get all orders, newest first (Admin/Vendor) - powers the Orders list page
export const getAllOrders = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = await getOrderScopeFilter(req);

    const { page, limit, skip } = getPagination(req);

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .sort({ orderDate: -1 });

    let filteredOrders = orders;

    if (search) {
      const regex = new RegExp(search, "i");
      filteredOrders = orders.filter(
        (order) =>
          regex.test(order.user?.name || "") ||
          regex.test(order._id.toString()) ||
          regex.test(order.status)
      );
    }

    const totalOrders = filteredOrders.length;

    const paginatedOrders = filteredOrders.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders: paginatedOrders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
      error: error.message,
    });
  }
};

// ➤ 3. Get order counts per day for a given month (Admin/Vendor) - powers the calendar view
export const getOrderCountsByMonth = async (req, res) => {
  try {
    const { year, month } = req.query; // month = 1-12

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "year and month are required",
      });
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 1);
    const filter = await getOrderScopeFilter(req);

    // Group by the order's actual scheduled delivery date (`date`), not
    // `orderDate` (when the record was created) - and skip orders the user
    // has paused, since those aren't real deliveries for that day.
    const orders = await Order.find({
      ...filter,
      date: { $gte: startDate, $lt: endDate },
      active: { $ne: false },
    }).select("date");

    const counts = {};
    orders.forEach((order) => {
      const d = order.date;
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      counts,
    });
  } catch (error) {
    console.error("Get Order Counts Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching order counts",
      error: error.message,
    });
  }
};

// ➤ 4. Get all orders for a specific date (Admin/Vendor)
export const getOrdersByDate = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required",
      });
    }

    const [year, month, day] = date.split("-").map(Number);
    const startDate = new Date(year, month - 1, day);
    const endDate = new Date(year, month - 1, day + 1);
    const filter = await getOrderScopeFilter(req);

    // Same fix as getOrderCountsByMonth: match the scheduled delivery date,
    // and only show orders the user hasn't paused.
    const orders = await Order.find({
      ...filter,
      date: { $gte: startDate, $lt: endDate },
      active: { $ne: false },
    })
      .populate("user", "name email")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders By Date Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
      error: error.message,
    });
  }
};

// ➤ 5. Vendor accepts a pending order assigned to them
export const acceptOrder = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      vendor: vendor._id,
      status: "Pending",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pending order not found",
      });
    }

    if (order.active === false) {
      return res.status(400).json({
        success: false,
        message: "This order was marked inactive by the user. It can't be accepted until they resume it.",
      });
    }

    order.status = "Accepted";
    await order.save();

    notifyOrderStatusChange({ order, status: "Accepted", vendorName: vendor.organizationName });

    return res.status(200).json({
      success: true,
      message: "Order accepted",
      order,
    });
  } catch (error) {
    console.error("Accept Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while accepting the order",
      error: error.message,
    });
  }
};

// ➤ 6. Vendor rejects a pending order assigned to them
export const rejectOrder = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      vendor: vendor._id,
      status: "Pending",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pending order not found",
      });
    }

    order.status = "Rejected";
    await order.save();

    notifyOrderStatusChange({ order, status: "Rejected", vendorName: vendor.organizationName });

    return res.status(200).json({
      success: true,
      message: "Order rejected",
      order,
    });
  } catch (error) {
    console.error("Reject Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while rejecting the order",
      error: error.message,
    });
  }
};

// ➤ 7. Vendor marks an accepted order as ready to deliver - only allowed for
// today's active orders (never a future or past scheduled date).
export const markOrderReadyToDeliver = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      vendor: vendor._id,
      status: "Accepted",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Accepted order not found",
      });
    }

    if (order.active === false) {
      return res.status(400).json({
        success: false,
        message: "This order was marked inactive by the user. It can't be delivered until they resume it.",
      });
    }

    if (!order.date || !isSameCalendarDay(order.date, new Date())) {
      return res.status(400).json({
        success: false,
        message: "You can only mark today's scheduled orders as ready to deliver.",
      });
    }

    order.status = "On the way";
    await order.save();

    notifyOrderStatusChange({ order, status: "On the way", vendorName: vendor.organizationName });

    return res.status(200).json({
      success: true,
      message: "Order marked as ready to deliver",
      order,
    });
  } catch (error) {
    console.error("Mark Order Ready To Deliver Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the order",
      error: error.message,
    });
  }
};

// ➤ 8. Vendor marks an order that's out for delivery as delivered - only
// allowed for today's scheduled date.
export const markOrderDelivered = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      vendor: vendor._id,
      status: "On the way",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not currently out for delivery",
      });
    }

    if (!order.date || !isSameCalendarDay(order.date, new Date())) {
      return res.status(400).json({
        success: false,
        message: "You can only deliver today's scheduled orders.",
      });
    }

    order.status = "Delivered";
    await order.save();

    // Each delivered order consumes exactly one "meal" from the customer's
    // plan quota (a meal = one day's delivery, regardless of how many items
    // it contains) - so the Plan Usage / Consumed-Remaining counters on the
    // dashboard stay in sync with what's actually been delivered.
    if (order.subscription) {
      try {
        const subscription = await Subscription.findById(order.subscription);
        if (subscription && subscription.mealsUsed < subscription.totalMeals) {
          subscription.mealsUsed += 1;
          await subscription.save();
        }
      } catch (error) {
        console.error("Mark Order Delivered: failed to increment mealsUsed:", error.message);
      }
    }

    notifyOrderStatusChange({ order, status: "Delivered", vendorName: vendor.organizationName });

    return res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    console.error("Mark Order Delivered Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the order",
      error: error.message,
    });
  }
};
