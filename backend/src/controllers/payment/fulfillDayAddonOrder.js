import Payment from "../../models/payment.model.js";
import Order from "../../models/Order.model.js";
import User from "../../models/User.model.js";
import { notifyOrderEvent, notifyUser } from "../../utils/notifyOrderEvent.js";

// -------- DAY_ADDON_ORDER fulfillment branch --------
// Attaches the paid add-ons snapshot to the specific (subscription, date)
// Order they were bought for - appends rather than replaces, so buying
// add-ons for the same day twice never erases a previous paid purchase.
//
// This can be called twice for the same Payment - once from the webhook
// and once more from saveCheckoutDetails as a fallback (in case the webhook
// hasn't fired yet when the success page loads). A plain "if payment.order
// is already set, skip" check is NOT safe here: both calls can read
// payment.order as unset before either has saved it, so both would append
// the add-ons, double-charging the order (while Stripe itself only charged
// once). Instead, atomically claim the payment by flipping `order` from
// null to the target order's id - only one caller can win that update, so
// only one caller ever appends the add-ons.
export const fulfillDayAddonOrder = async (session, payment) => {
  if (!Array.isArray(payment.items) || payment.items.length === 0) {
    return;
  }

  const subscriptionId = session.metadata?.subscriptionId || payment.subscription;
  const dateStr = session.metadata?.date;
  const orderDate = payment.dayAddonDate || (dateStr ? new Date(dateStr) : null);

  if (!subscriptionId || !orderDate) {
    console.error(`fulfillDayAddonOrder: missing subscriptionId/date for payment ${payment._id}`);
    return;
  }

  const normalizedDate = new Date(orderDate);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  const order = await Order.findOne({
    user: payment.user,
    subscription: subscriptionId,
    date: normalizedDate,
  });

  if (!order) {
    // The scheduled meal that this add-on purchase depended on was removed
    // between checkout and payment completing - nothing to attach to. The
    // payment stays "paid" (money was actually charged); this edge case
    // needs manual admin follow-up (refund or reschedule), same as any
    // other post-payment fulfillment failure in this codebase.
    console.error(`fulfillDayAddonOrder: no Order found for user ${payment.user}, subscription ${subscriptionId}, date ${normalizedDate.toISOString()}`);
    return;
  }

  const claimed = await Payment.findOneAndUpdate(
    { _id: payment._id, order: null },
    { $set: { order: order._id } },
    { new: true }
  );

  if (!claimed) {
    // Another concurrent call (webhook vs. saveCheckoutDetails fallback)
    // already claimed and attached the add-ons - skip to avoid duplicating them.
    return;
  }

  payment.order = claimed.order;

  const newAddons = payment.items.map((it) => ({
    addon: it.addon,
    name: it.name,
    qty: it.qty,
    price: it.price,
  }));

  order.addons = [...(order.addons || []), ...newAddons];
  await order.save();

  const extraCharge = newAddons.reduce((sum, a) => sum + (a.price || 0) * (a.qty || 0), 0);
  const dayLabel = normalizedDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  if (order.vendor) {
    const orderingUser = await User.findById(payment.user).select("name");
    // Vendor shouldn't hear about an order at all until admin has approved
    // it - route to admin instead while it's still Pending.
    await notifyOrderEvent({
      vendorId: order.status === "Pending" ? undefined : order.vendor,
      orderId: order._id,
      type: "payment",
      title: "Add-ons Purchased",
      message: `${orderingUser?.name || "A customer"} purchased add-ons for ${dayLabel} ($${extraCharge.toFixed(2)}).`,
      emailHeading: "Order Add-ons Purchased",
      emailLines: [
        { label: "Customer", value: orderingUser?.name || "A customer" },
        { label: "Date", value: dayLabel },
        { label: "Add-ons", value: newAddons.map((a) => `${a.name} x${a.qty}`).join(", ") },
        { label: "Amount", value: `$${extraCharge.toFixed(2)}` },
      ],
    });
  }

  notifyUser({
    userId: payment.user,
    orderId: order._id,
    type: "payment",
    title: "Add-ons Purchased",
    message: `Your add-ons for ${dayLabel} were purchased successfully ($${extraCharge.toFixed(2)}).`,
  });
};
