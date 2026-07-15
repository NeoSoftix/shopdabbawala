import mongoose from "mongoose";
import stripe from "../../config/stripe.js";
import Payment from "../../models/payment.model.js";
import AddOn from "../../models/addOns.model.js";
import Order from "../../models/Order.model.js";
import Subscription from "../../models/Subcription.model.js";
import { getActiveWeekWindow } from "../../utils/getActiveWeekWindow.js";

// One-time checkout for add-ons attached to a SPECIFIC already-scheduled
// day of a subscription (User Dashboard "Add Ons" section on the meal
// planner) - distinct from the standalone cart-based addon-checkout, which
// isn't tied to any day/subscription.
export const createDayAddonCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId, date, addons } = req.body;

    if (!subscriptionId || !date || !Array.isArray(addons) || addons.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID, date and at least one add-on are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription ID.",
      });
    }

    const requestDate = new Date(date);
    requestDate.setUTCHours(0, 0, 0, 0);
    if (isNaN(requestDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date." });
    }

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: userId,
      status: "active",
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Active subscription not found." });
    }

    const { windowStart, windowEnd } = getActiveWeekWindow(subscription, new Date());
    if (requestDate < windowStart || requestDate > windowEnd) {
      return res.status(400).json({
        success: false,
        message: "You can only add add-ons within your current active week.",
      });
    }

    // Add-ons are extras riding along on a day that already has a meal
    // scheduled - they aren't tied to any Category/vendor of their own.
    const dayOrder = await Order.findOne({
      user: userId,
      subscription: subscriptionId,
      date: requestDate,
    }).select("_id items");

    if (!dayOrder || !dayOrder.items?.length) {
      return res.status(400).json({
        success: false,
        message: "Please schedule a meal for this day before adding add-ons.",
      });
    }

    const addonIds = addons.map((a) => a.id);
    const addonDocs = await AddOn.find({ _id: { $in: addonIds }, isActive: true });

    const matchedItems = addons
      .map((cartItem) => {
        const addon = addonDocs.find((a) => a._id.toString() === cartItem.id);
        if (!addon) return null;
        const quantity = Math.max(1, Number(cartItem.quantity) || 1);
        return { addon, quantity };
      })
      .filter(Boolean);

    if (matchedItems.length === 0) {
      return res.status(400).json({ success: false, message: "No valid add-ons found." });
    }

    const line_items = matchedItems.map(({ addon, quantity }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: addon.name,
          description: addon.description || undefined,
        },
        unit_amount: Math.round(addon.price * 100),
      },
      quantity,
    }));

    const totalAmountCents = line_items.reduce(
      (sum, li) => sum + li.price_data.unit_amount * li.quantity,
      0
    );

    const orderItemsSnapshot = matchedItems.map(({ addon, quantity }) => ({
      addon: addon._id,
      name: addon.name,
      qty: quantity,
      price: addon.price,
    }));

    const dateStr = requestDate.toISOString().slice(0, 10);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      metadata: {
        userId,
        paymentType: "DAY_ADDON_ORDER",
        subscriptionId,
        date: dateStr,
      },
      success_url: `${process.env.FRONTEND_URL}/dashboard?addon_payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?addon_payment=cancelled`,
    });

    await Payment.create({
      user: userId,
      subscription: subscriptionId,
      paymentType: "DAY_ADDON_ORDER",
      stripeSessionId: session.id,
      amount: Math.round(totalAmountCents / 100),
      currency: "usd",
      status: "pending",
      metadata: session.metadata,
      items: orderItemsSnapshot,
      dayAddonDate: requestDate,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Day Addon Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
