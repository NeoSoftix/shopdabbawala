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
  (async () => {
    try {
      const recipients = [];

      if (vendorId) {
        const vendor = await Vendor.findById(vendorId).populate("userId", "email");
        if (vendor?.userId?.email) recipients.push(vendor.userId.email);
      }

      const admins = await User.find({ role: "admin", email: { $exists: true, $ne: null } }).select("email");
      admins.forEach((admin) => {
        if (admin.email) recipients.push(admin.email);
      });

      if (recipients.length === 0) return;

      const html = orderEventTemplate({
        heading: emailHeading || title,
        intro: emailIntro,
        lines: emailLines,
      });

      recipients.forEach((email) => {
        sendEmail(email, emailHeading || title, html).catch((error) =>
          console.error(`Order event email failed for ${email}:`, error.message)
        );
      });
    } catch (error) {
      console.error("Notify Order Event Email Error:", error);
    }
  })();
};
