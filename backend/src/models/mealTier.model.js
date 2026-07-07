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

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],

    selectionCount: {
      type: Number,
      default: 1,
      min: 1,
      // Customer ko is tier ke items pool mein se kitne items choose karne
      // honge order karte waqt (e.g. "10 items included, choose 5").
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