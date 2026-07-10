import mongoose from "mongoose";

const mealItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const dayScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    items: {
      type: [mealItemSchema],
      default: [],
    },
  },
  {
    _id: false,
  }
);


const mealScheduleSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    schedule: {
      type: [dayScheduleSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const MealSchedule = mongoose.model(
  "MealSchedule",
  mealScheduleSchema
);

export default MealSchedule;