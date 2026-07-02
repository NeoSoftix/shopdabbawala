import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      trim: true,
      required: true,
    },

    city: {
      type: String,
      trim: true,
      required: true,
    },

    state: {
      type: String,
      trim: true,
      required: true,
    },

    pincode: {
      type: String,
      trim: true,
      required: true,
    },

    addressType: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const dayScheduleSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],

    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    addresses: {
      type: [addressSchema],
      default: [],
    },

    schedule: {
      Monday: {
        type: dayScheduleSchema,
        default: {},
      },

      Tuesday: {
        type: dayScheduleSchema,
        default: {},
      },

      Wednesday: {
        type: dayScheduleSchema,
        default: {},
      },

      Thursday: {
        type: dayScheduleSchema,
        default: {},
      },

      Friday: {
        type: dayScheduleSchema,
        default: {},
      },

      Saturday: {
        type: dayScheduleSchema,
        default: {},
      },

      Sunday: {
        type: dayScheduleSchema,
        default: {},
      },
    },
  },
  {
    timestamps: true,
  }
);

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;