import Notification from "../models/notification.model.js";
import Vendor from "../models/vendor.model.js";
import User from "../models/User.model.js";
import { emitToVendor, emitToUser } from "../socket/index.js";
import { sendEmail } from "./email/sendEmail.js";
import { orderEventTemplate } from "./email/orderEventTemplate.js";

// Persists + pushes a real-time in-app notification to a customer's own
// bell/drawer (their purchases, order placements, accept/reject outcomes).
// Never throws - a notification failure shouldn't block the action that
// triggered it.
export const notifyUser = async ({ userId, orderId, type = "order", title, message }) => {
  if (!userId) return;

  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      order: orderId || null,
    });

    emitToUser(userId, "notification:new", notification);
  } catch (error) {
    console.error("notifyUser: in-app notification error:", error);
  }
};

// Single entry point for every order-lifecycle event (new subscription
// purchased, new day order created/updated, day paused/resumed): persists +
// pushes the real-time in-app Notification to the vendor, and emails both
// the vendor and every admin. Never throws and never awaits the email leg -
// a slow/failing SMTP send should never block the request that triggered it.
export const notifyOrderEvent = async ({
  vendorId,
  orderId,
  type = "order",
  title,
  message,
  emailHeading,
  emailIntro,
  emailLines = [],
}) => {
  if (vendorId) {
    try {
      const notification = await Notification.create({
        vendor: vendorId,
        type,
        title,
        message,
        order: orderId || null,
      });

      emitToVendor(vendorId, "notification:new", notification);
    } catch (error) {
      console.error("In-app notification error:", error);
    }
  }

  // Fire-and-forget: resolve recipients and send emails in the background.
  // Vendor lookup and admin lookup are isolated in their own try/catch each
  // so a vendor-side failure (bad vendorId, missing linked user, etc.) can
  // never silently swallow the admin notification, or vice versa.
  (async () => {
    const recipients = [];

    if (vendorId) {
      try {
        const vendor = await Vendor.findById(vendorId).populate("userId", "email");
        if (vendor?.userId?.email) {
          recipients.push(vendor.userId.email);
        } else {
          console.warn(`notifyOrderEvent: vendor ${vendorId} has no linked user email - vendor email skipped.`);
        }
      } catch (error) {
        console.error(`notifyOrderEvent: vendor lookup failed for ${vendorId}:`, error.message);
      }
    }

    try {
      const admins = await User.find({ role: "admin" }).select("email");
      console.log(`notifyOrderEvent [${emailHeading || title}]: found ${admins.length} admin(s):`, admins.map((a) => a.email));
      admins.forEach((admin) => {
        if (admin.email) recipients.push(admin.email);
        notifyUser({ userId: admin._id, orderId, type, title, message });
      });
    } catch (error) {
      console.error("notifyOrderEvent: admin lookup failed:", error.message);
    }

    console.log(`notifyOrderEvent [${emailHeading || title}]: final recipients ->`, recipients);

    if (recipients.length === 0) return;

    const html = orderEventTemplate({
      heading: emailHeading || title,
      intro: emailIntro,
      lines: emailLines,
    });

    recipients.forEach((email) => {
      sendEmail(email, emailHeading || title, html)
        .then(() => console.log(`notifyOrderEvent: email sent OK to ${email} (${emailHeading || title})`))
        .catch((error) =>
          console.error(`notifyOrderEvent: email FAILED for ${email} (${emailHeading || title}):`, error.response?.data || error.message)
        );
    });
  })();
};

// Formats an Order's `date` field (the actual scheduled delivery day) for
// use in notification copy - falls back to a generic phrase if unset.
const formatOrderDayLabel = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    : "your scheduled day";

// Per-status copy for every vendor-actor-driven order status change. Keeping
// this as data (rather than branching per status inline) lets
// notifyOrderStatusChange stay one generic function as new statuses
// (On the way, Delivered) were added alongside the original Accepted/Rejected.
const STATUS_NOTIFICATION_CONFIG = {
  Accepted: {
    accent: "#16a34a",
    userTitle: "Order Accepted",
    userMessage: (dayLabel, vendorName) => `Your order for ${dayLabel} has been accepted by ${vendorName || "the vendor"}.`,
    userEmailHeading: "Your Order Has Been Accepted! 🎉",
    userEmailIntro: (dayLabel, vendorName) => `Good news! Your meal order for ${dayLabel} has been accepted by ${vendorName || "your vendor"} and will be prepared for delivery.`,
    adminTitle: "Vendor Accepted an Order",
    adminIntro: (customerName, dayLabel, vendorName) => `${vendorName || "A vendor"} has accepted ${customerName}'s order for ${dayLabel}.`,
  },
  Rejected: {
    accent: "#dc2626",
    userTitle: "Order Rejected",
    userMessage: (dayLabel, vendorName) => `Your order for ${dayLabel} was rejected by ${vendorName || "the vendor"}.`,
    userEmailHeading: "Your Order Was Rejected",
    userEmailIntro: (dayLabel, vendorName) => `We're sorry - your meal order for ${dayLabel} was rejected by ${vendorName || "the vendor"}. Please contact support if you have questions.`,
    adminTitle: "Vendor Rejected an Order",
    adminIntro: (customerName, dayLabel, vendorName) => `${vendorName || "A vendor"} has rejected ${customerName}'s order for ${dayLabel}.`,
  },
  "On the way": {
    accent: "#2563eb",
    userTitle: "Order Out For Delivery",
    userMessage: (dayLabel, vendorName) => `Your order for ${dayLabel} is ready and on its way with ${vendorName || "the vendor"}!`,
    userEmailHeading: "Your Order Is On The Way! 🚴",
    userEmailIntro: (dayLabel, vendorName) => `Good news! ${vendorName || "Your vendor"} has marked your ${dayLabel} meal order as ready to deliver - it'll reach you shortly.`,
    adminTitle: "Vendor Marked an Order Ready to Deliver",
    adminIntro: (customerName, dayLabel, vendorName) => `${vendorName || "A vendor"} is out delivering ${customerName}'s order for ${dayLabel}.`,
  },
  Delivered: {
    accent: "#16a34a",
    userTitle: "Order Delivered",
    userMessage: (dayLabel, vendorName) => `Your order for ${dayLabel} has been delivered by ${vendorName || "the vendor"}. Enjoy your meal!`,
    userEmailHeading: "Your Order Has Been Delivered! 🎉",
    userEmailIntro: (dayLabel, vendorName) => `${vendorName || "Your vendor"} has delivered your ${dayLabel} meal order. We hope you enjoy it!`,
    adminTitle: "Vendor Delivered an Order",
    adminIntro: (customerName, dayLabel, vendorName) => `${vendorName || "A vendor"} has delivered ${customerName}'s order for ${dayLabel}.`,
  },
};

// Vendor accepted/rejected/marked-ready/delivered a specific order. Unlike
// notifyOrderEvent (vendor + admin, vendor is the recipient), here the
// vendor is the *actor* - so the customer whose order it is gets emailed the
// outcome, and admin gets a separate email about what the vendor just did.
// Fire-and-forget, never throws.
export const notifyOrderStatusChange = async ({ order, status, vendorName }) => {
  (async () => {
    try {
      const config = STATUS_NOTIFICATION_CONFIG[status];
      if (!config) {
        console.error(`notifyOrderStatusChange: no notification config for status "${status}"`);
        return;
      }

      const dayLabel = formatOrderDayLabel(order.date);
      const user = await User.findById(order.user).select("email name");
      const customerName = user?.name || "A customer";

      notifyUser({
        userId: order.user,
        orderId: order._id,
        title: config.userTitle,
        message: config.userMessage(dayLabel, vendorName),
      });

      if (user?.email) {
        const userHtml = orderEventTemplate({
          heading: config.userEmailHeading,
          intro: config.userEmailIntro(dayLabel, vendorName),
          lines: [
            { label: "Date", value: dayLabel },
            { label: "Plan", value: order.planName || "N/A" },
            { label: "Status", value: status },
          ],
          accent: config.accent,
        });

        sendEmail(user.email, config.userEmailHeading, userHtml)
          .then(() => console.log(`notifyOrderStatusChange: user email sent OK to ${user.email} (${status})`))
          .catch((error) => console.error(`notifyOrderStatusChange: user email FAILED for ${user.email}:`, error.response?.data || error.message));
      }

      const admins = await User.find({ role: "admin" }).select("email");
      if (admins.length > 0) {
        const adminIntro = config.adminIntro(customerName, dayLabel, vendorName);
        const adminHtml = orderEventTemplate({
          heading: config.adminTitle,
          intro: adminIntro,
          lines: [
            { label: "Customer", value: customerName },
            { label: "Vendor", value: vendorName || "N/A" },
            { label: "Date", value: dayLabel },
            { label: "Plan", value: order.planName || "N/A" },
          ],
          accent: config.accent,
        });

        admins.forEach((admin) => {
          notifyUser({ userId: admin._id, orderId: order._id, title: config.adminTitle, message: adminIntro });

          if (!admin.email) return;
          sendEmail(admin.email, config.adminTitle, adminHtml)
            .then(() => console.log(`notifyOrderStatusChange: admin email sent OK to ${admin.email} (${status})`))
            .catch((error) => console.error(`notifyOrderStatusChange: admin email FAILED for ${admin.email}:`, error.response?.data || error.message));
        });
      }
    } catch (error) {
      console.error("notifyOrderStatusChange error:", error);
    }
  })();
};
