import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      index: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    // Snapshot of the subscription's plan name at order time (e.g. "Medium
    // (Veg)") - lets a vendor/admin tell orders apart when a customer has
    // multiple plans, without needing to populate/lookup the subscription.
    planName: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
    },

    // Lets a user pause/resume a specific day's recurring delivery without
    // deleting the schedule entirely.
    active: {
      type: Boolean,
      default: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    deliveryTimeSlot: {
      type: String,
      default: "12:30 PM - 01:00 PM",
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        name: String,
        qty: { type: Number, default: 1 },
      },
    ],

    addons: [
      {
        addon: { type: mongoose.Schema.Types.ObjectId, ref: "AddOns" },
        name: String,
        qty: { type: Number, default: 1 },
        price: Number,
      },
    ],

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Preparing",
        "On the way",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    deliveryMethod: {
      type: String,
      enum: ["Delivery", "Pickup"],
      default: "Delivery",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
