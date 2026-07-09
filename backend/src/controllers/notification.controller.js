import Notification from "../models/notification.model.js";
import Vendor from "../models/vendor.model.js";
import { getPagination } from "../utils/pagination.js";

// Vendors see notifications addressed to their vendor profile; regular
// users and admins see notifications addressed to their own account (admins
// are User documents too, so they reuse the same `user` field). Returns
// null if neither applies (e.g. a vendor without a profile yet).
const getRecipientFilter = async (req) => {
  if (req.user.role === "vendor") {
    const vendor = await Vendor.findOne({ userId: req.user.id }).select("_id");
    return vendor ? { vendor: vendor._id } : null;
  }

  if (req.user.role === "user" || req.user.role === "admin") {
    return { user: req.user.id };
  }

  return null;
};

// ➤ Get latest notifications for the logged-in vendor/user/admin (paginated)
export const getMyNotifications = async (req, res) => {
  try {
    const filter = await getRecipientFilter(req);

    if (!filter) {
      return res.status(404).json({ success: false, message: "Notification recipient not found." });
    }

    const { page, limit, skip } = getPagination(req);

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Notification.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

// ➤ Unread notification count - powers the bell/sidebar badge
export const getUnreadCount = async (req, res) => {
  try {
    const filter = await getRecipientFilter(req);

    if (!filter) {
      return res.status(404).json({ success: false, message: "Notification recipient not found." });
    }

    const count = await Notification.countDocuments({ ...filter, read: false });

    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Get Unread Count Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch unread count." });
  }
};

// ➤ Mark a single notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const filter = await getRecipientFilter(req);

    if (!filter) {
      return res.status(404).json({ success: false, message: "Notification recipient not found." });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, ...filter },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update notification." });
  }
};

// ➤ Mark all of this vendor's/user's notifications as read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const filter = await getRecipientFilter(req);

    if (!filter) {
      return res.status(404).json({ success: false, message: "Notification recipient not found." });
    }

    await Notification.updateMany({ ...filter, read: false }, { read: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update notifications." });
  }
};

// for delete the notification 
export const deleteOneNotification = async (req, res) => {
  try {
    const filter = await getRecipientFilter(req);

    if (!filter) {
      return res.status(404).json({
        success: false,
        message: "Notification recipient not found.",
      });
    }

    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      ...filter,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
};