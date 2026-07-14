import mongoose from "mongoose";

// One entry per calendar date within the week this document covers - which
// Items (within `category`) the admin has made available on that specific
// date. A date with no matching entry (or an empty `items` array) means
// nothing is available for that day yet.
const dayMenuSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
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
