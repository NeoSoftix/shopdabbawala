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

    paymentType: {
      type: String,
      enum: ["ADMIN_PACKAGE", "CUSTOM_PACKAGE", "ADDON_ORDER"],
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
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;