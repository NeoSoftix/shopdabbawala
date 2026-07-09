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

// Vendor accepted/rejected a specific day's order. Unlike notifyOrderEvent
// (vendor + admin, vendor is the recipient), here the vendor is the *actor*
// - so the customer whose order it is gets emailed the outcome, and admin
// gets a separate email about what the vendor just did. Fire-and-forget,
// never throws.
export const notifyOrderStatusChange = async ({ order, status, vendorName }) => {
  (async () => {
    try {
      const isAccepted = status === "Accepted";
      const accent = isAccepted ? "#16a34a" : "#dc2626";
      const user = await User.findById(order.user).select("email name");
      const customerName = user?.name || "A customer";

      notifyUser({
        userId: order.user,
        orderId: order._id,
        title: isAccepted ? "Order Accepted" : "Order Rejected",
        message: isAccepted
          ? `Your order for ${order.day} has been accepted by ${vendorName || "the vendor"}.`
          : `Your order for ${order.day} was rejected by ${vendorName || "the vendor"}.`,
      });

      if (user?.email) {
        const userHeading = isAccepted ? "Your Order Has Been Accepted! 🎉" : "Your Order Was Rejected";
        const userHtml = orderEventTemplate({
          heading: userHeading,
          intro: isAccepted
            ? `Good news! Your meal order for ${order.day} has been accepted by ${vendorName || "your vendor"} and will be prepared for delivery.`
            : `We're sorry - your meal order for ${order.day} was rejected by ${vendorName || "the vendor"}. Please contact support if you have questions.`,
          lines: [
            { label: "Day", value: order.day },
            { label: "Plan", value: order.planName || "N/A" },
            { label: "Status", value: status },
          ],
          accent,
        });

        sendEmail(user.email, userHeading, userHtml)
          .then(() => console.log(`notifyOrderStatusChange: user email sent OK to ${user.email} (${status})`))
          .catch((error) => console.error(`notifyOrderStatusChange: user email FAILED for ${user.email}:`, error.response?.data || error.message));
      }

      const admins = await User.find({ role: "admin" }).select("email");
      if (admins.length > 0) {
        const adminHeading = isAccepted ? "Vendor Accepted an Order" : "Vendor Rejected an Order";
        const adminIntro = `${vendorName || "A vendor"} has ${isAccepted ? "accepted" : "rejected"} ${customerName}'s order for ${order.day}.`;
        const adminHtml = orderEventTemplate({
          heading: adminHeading,
          intro: adminIntro,
          lines: [
            { label: "Customer", value: customerName },
            { label: "Vendor", value: vendorName || "N/A" },
            { label: "Day", value: order.day },
            { label: "Plan", value: order.planName || "N/A" },
          ],
          accent,
        });

        admins.forEach((admin) => {
          notifyUser({ userId: admin._id, orderId: order._id, title: adminHeading, message: adminIntro });

          if (!admin.email) return;
          sendEmail(admin.email, adminHeading, adminHtml)
            .then(() => console.log(`notifyOrderStatusChange: admin email sent OK to ${admin.email} (${status})`))
            .catch((error) => console.error(`notifyOrderStatusChange: admin email FAILED for ${admin.email}:`, error.response?.data || error.message));
        });
      }
    } catch (error) {
      console.error("notifyOrderStatusChange error:", error);
    }
  })();
};
