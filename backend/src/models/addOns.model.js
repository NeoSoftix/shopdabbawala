import mongoose from "mongoose";

const addOnsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    allergies: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const AddOn = mongoose.model("AddOn", addOnsSchema);

export default AddOn;