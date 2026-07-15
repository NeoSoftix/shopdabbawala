import mongoose from "mongoose";

const mealTierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // "Basic", "Medium", "Premium"
    },

    features: {
      type: [String],
      required: true,
      // ["Affordable for all", "Free delivery", "Daily fresh cooked"]
    },

    isActive: {
      type: Boolean,
      default: true,
      // false hone par yeh tier user ke dashboard pe nahi dikhega
    },
  },
  { timestamps: true }
);

export default mongoose.model("MealTier", mealTierSchema);