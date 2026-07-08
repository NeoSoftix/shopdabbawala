import Notification from "../models/notification.model.js";
import Vendor from "../models/vendor.model.js";
import User from "../models/User.model.js";
import { emitToVendor } from "../socket/index.js";
import { sendEmail } from "./email/sendEmail.js";
import { orderEventTemplate } from "./email/orderEventTemplate.js";

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
      const admins = await User.find({ role: "admin", email: { $exists: true, $ne: null } }).select("email");
      console.log(`notifyOrderEvent [${emailHeading || title}]: found ${admins.length} admin(s):`, admins.map((a) => a.email));
      admins.forEach((admin) => {
        if (admin.email) recipients.push(admin.email);
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
