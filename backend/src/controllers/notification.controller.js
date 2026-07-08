import Notification from "../models/notification.model.js";
import Vendor from "../models/vendor.model.js";

const getVendorId = async (req) => {
  const vendor = await Vendor.findOne({ userId: req.user.id }).select("_id");
  return vendor?._id || null;
};

// ➤ Get latest notifications for the logged-in vendor
export const getVendorNotifications = async (req, res) => {
  try {
    const vendorId = await getVendorId(req);

    if (!vendorId) {
      return res.status(404).json({ success: false, message: "Vendor profile not found." });
    }

    const notifications = await Notification.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Get Vendor Notifications Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch notifications." });
  }
};

// ➤ Unread notification count - powers the sidebar badge
export const getUnreadCount = async (req, res) => {
  try {
    const vendorId = await getVendorId(req);

    if (!vendorId) {
      return res.status(404).json({ success: false, message: "Vendor profile not found." });
    }

    const count = await Notification.countDocuments({ vendor: vendorId, read: false });

    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Get Unread Count Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch unread count." });
  }
};

// ➤ Mark a single notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const vendorId = await getVendorId(req);

    if (!vendorId) {
      return res.status(404).json({ success: false, message: "Vendor profile not found." });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, vendor: vendorId },
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

// ➤ Mark all of this vendor's notifications as read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const vendorId = await getVendorId(req);

    if (!vendorId) {
      return res.status(404).json({ success: false, message: "Vendor profile not found." });
    }

    await Notification.updateMany({ vendor: vendorId, read: false }, { read: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update notifications." });
  }
};
