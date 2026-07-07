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
      required: false,
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

    pincode: {
      type: String,
      trim: true,
      required: false,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    stripeSubscriptionId: {
      type: String,
      default: null,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    stripeSubscriptionScheduleId: {
      type: String,
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
