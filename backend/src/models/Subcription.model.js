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

    // Free-text label (whatever the admin named the DurationPlan - "Trial",
    // "Weekly", "One", etc.) - display only, not used for date math.
    duration: {
      type: String,
      required: true,
      trim: true,
    },

    // Copied from the DurationPlan at purchase time - the actual number of
    // days this subscription runs for. Drives endDate/renewal calculations
    // and Stripe's billing interval, regardless of what `duration` says.
    durationDays: {
      type: Number,
      min: 1,
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
