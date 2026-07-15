import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    requiredQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: true } // Generate IDs for sections so frontend can map them easily
);

// One entry per calendar date within the week this document covers.
// A date with no matching entry means nothing is available for that day yet.
const dayMenuSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    sections: [sectionSchema],
  },
  { _id: false }
);

// Admin-configured, per-category, per-week menu: which items are orderable
// on each date of that week. Re-done every week by the admin (not a
// permanent recurring template) - `weekStartDate` is always normalized to
// that week's Monday (UTC midnight).
const weeklyMenuSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    weekStartDate: {
      type: Date,
      required: true,
    },

    days: [dayMenuSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// One menu document per (category, week) - re-saving the same week upserts
// it instead of creating a duplicate.
weeklyMenuSchema.index({ category: 1, weekStartDate: 1 }, { unique: true });

const WeeklyMenu = mongoose.model("WeeklyMenu", weeklyMenuSchema);

export default WeeklyMenu;
