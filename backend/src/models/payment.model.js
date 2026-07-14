import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // Snapshot of the add-on cart (id/name/qty/price) at checkout time,
    // used to create the Order with the correct per-item quantity once
    // delivery details are available.
    items: [
      {
        addon: { type: mongoose.Schema.Types.ObjectId, ref: "AddOn" },
        name: String,
        qty: { type: Number, default: 1 },
        price: Number,
      },
    ],

    // The specific (subscription, date) a DAY_ADDON_ORDER's add-ons should
    // be attached to once paid - unused by every other paymentType.
    dayAddonDate: {
      type: Date,
      default: null,
    },

    paymentType: {
      type: String,
      enum: ["ADMIN_PACKAGE", "CUSTOM_PACKAGE", "ADDON_ORDER", "DAY_ADDON_ORDER"],
      required: true,
    },

    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentIntentId: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    metadata: {
      type: Object,
      default: {},
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Guards against sending the admin/vendor "new subscription purchased"
    // email more than once if saveCheckoutDetails is hit again for the same
    // session (e.g. the user resubmits the delivery-details form).
    purchaseNotified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;