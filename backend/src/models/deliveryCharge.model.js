import mongoose from "mongoose";

const deliveryChargeSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    charge: {
      type: Number,
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const DeliveryCharge = mongoose.model("DeliveryCharge", deliveryChargeSchema);

export default DeliveryCharge;
