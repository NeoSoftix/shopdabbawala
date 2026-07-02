import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: false,
    },

    mealSize: {
      type: String,
      enum: ["Basic", "Medium", "Premium"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMeals: {
      type: Number,
      required: true,
      min: 1,
    },

    mealsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxItemsPerMeal: {
      type: Number,
      required: true,
      min: 1,
    },

    preference: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      required: true,
    },

    duration: {
  type: String,
  enum: ["Trial", "Weekly", "Monthly", "Quarterly"],
  required: true,
},

    meals: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    deliveryMethod: {
      type: String,
      enum: ["Delivery", "Pickup"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

   startDate: {
  type: Date,
  required: true,
},

    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual field for calculation
subscriptionSchema.virtual("mealsRemaining").get(function () {
  return this.totalMeals - this.mealsUsed;
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
