import mongoose from "mongoose";

const durationPlanSchema = new mongoose.Schema(
  {
    durationLabel: {
      type: String,
      required: true,
      trim: true,
    },

    totalMeals: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerMeal: {
      type: Number,
      required: true,
      min: 0,
      // actual price (bina discount ke)
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      // yahi se discounted price calculate hogi
    },

    frequencyLabel: {
      type: String,
      required: true,
      trim: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      // meal-count option order within a duration tab (e.g. 4/5/6 meals)
    },

    labelOrder: {
      type: Number,
      default: 0,
      // duration tab order (e.g. Weekly before Monthly) — synced across all
      // plans sharing the same durationLabel
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    stripeProductId: {
      type: String,
    },

    stripePriceId: {
      type: String,
    },

    // Har active MealTier (Basic/Medium/Premium) ka is duration+meal-count
    // combo ke liye apna alag price — admin set karta hai "Set Duration" se.
    tierPricing: [
      {
        mealTier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MealTier",
          required: true,
        },
        pricePerMeal: {
          type: Number,
          required: true,
          min: 0,
        },
        discountPercentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// per meal discounted price
durationPlanSchema.virtual("discountedPricePerMeal").get(function () {
  const discount = (this.pricePerMeal * this.discountPercentage) / 100;
  return Number((this.pricePerMeal - discount).toFixed(2));
});

// total actual price (strikethrough wala)
durationPlanSchema.virtual("totalActualPrice").get(function () {
  return Number((this.pricePerMeal * this.totalMeals).toFixed(2));
});

// total discounted price (jo user actually pay karega)
durationPlanSchema.virtual("totalDiscountedPrice").get(function () {
  const discount = (this.pricePerMeal * this.discountPercentage) / 100;
  const discountedPerMeal = this.pricePerMeal - discount;
  return Number((discountedPerMeal * this.totalMeals).toFixed(2));
});

// kitna save hua
durationPlanSchema.virtual("totalSavings").get(function () {
  const actual = this.pricePerMeal * this.totalMeals;
  const discount = (this.pricePerMeal * this.discountPercentage) / 100;
  const discounted = (this.pricePerMeal - discount) * this.totalMeals;
  return Number((actual - discounted).toFixed(2));
});

export default mongoose.model("DurationPlan", durationPlanSchema);