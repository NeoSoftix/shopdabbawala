import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"
import AddOn from "../../models/addOns.model.js"

// One-time checkout for a cart of add-on items (User Dashboard "Add-ons" section)
export const createAddonCheckout = async (req, res) => {
  try {
    const { items } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User context missing.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const addonIds = items.map((item) => item.id);
    const addons = await AddOn.find({ _id: { $in: addonIds }, isActive: true });

    const matchedItems = items
      .map((cartItem) => {
        const addon = addons.find((a) => a._id.toString() === cartItem.id);
        if (!addon) return null;

        const quantity = Math.max(1, Number(cartItem.quantity) || 1);

        return { addon, quantity };
      })
      .filter(Boolean);

    if (matchedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid add-ons found in your cart.",
      });
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

    const totalAmount = line_items.reduce(
      (sum, li) => sum + li.price_data.unit_amount * li.quantity,
      0,
    );

    // Snapshot of cart items (with real quantity) to persist on the Payment
    // record, since Stripe session metadata can't reliably hold an arbitrarily
    // large cart. This is what the Order gets built from later.
    const orderItemsSnapshot = matchedItems.map(({ addon, quantity }) => ({
      addon: addon._id,
      name: addon.name,
      qty: quantity,
      price: addon.price,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      phone_number_collection: { enabled: true },
      payment_method_types: ["card"],
      line_items,
      metadata: {
        userId: req.user.id,
        paymentType: "ADDON_ORDER",
      },
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    await Payment.create({
      user: req.user.id,
      paymentType: "ADDON_ORDER",
      stripeSessionId: session.id,
      amount: Math.round(totalAmount / 100),
      currency: "usd",
      status: "pending",
      metadata: session.metadata,
      items: orderItemsSnapshot,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Addon Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
