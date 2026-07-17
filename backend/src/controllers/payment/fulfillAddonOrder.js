import Order from "../../models/Order.model.js"
import User from "../../models/User.model.js"
import { formatFullAddress } from "../../utils/formatAddress.js"

// -------- ADDON_ORDER fulfillment branch (extracted from fulfillOrder) --------
// Fallback so the Order still gets created even if the customer abandons the
// post-payment details form (saveCheckoutDetails never runs).
export const fulfillAddonOrder = async (session, payment) => {
  if (payment.order || !Array.isArray(payment.items) || payment.items.length === 0) {
    return;
  }

  const orderUser = await User.findById(payment.user).select("address city state pincode");

  const order = await Order.create({
    user: payment.user,
    deliveryAddress: formatFullAddress({
      address: orderUser?.address,
      city: orderUser?.city,
      state: orderUser?.state,
      pincode: orderUser?.pincode,
    }) || "Not provided",
    addons: payment.items.map((it) => ({
      addon: it.addon,
      name: it.name,
      qty: it.qty,
      price: it.price,
    })),
    status: "Pending",
    deliveryMethod: "Delivery",
  });

  payment.order = order._id;
  await payment.save();
};
