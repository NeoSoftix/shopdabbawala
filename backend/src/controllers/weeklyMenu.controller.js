import mongoose from "mongoose";
import WeeklyMenu from "../models/weeklyMenu.model.js";
import Category from "../models/category.model.js";
import Item from "../models/item.model.js";

// The Monday (00:00 UTC) of the calendar week containing `date` - mirrors
// backend/src/utils/getActiveWeekWindow.js's mondayOf, kept local here since
// this is the only other place that needs it.
const mondayOf = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const dow = d.getUTCDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
};

// ➤ Admin: create/update the week's menu for a category. Upserts by
// (category, weekStartDate) - saving the same week again overwrites it
// rather than creating a duplicate.
export const upsertWeeklyMenu = async (req, res) => {
  try {
    const { category: categoryId, weekStartDate, days } = req.body;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "A valid category is required." });
    }

    if (!weekStartDate || isNaN(new Date(weekStartDate).getTime())) {
      return res.status(400).json({ success: false, message: "A valid weekStartDate is required." });
    }

    if (!Array.isArray(days)) {
      return res.status(400).json({ success: false, message: "days must be an array." });
    }

    const categoryExists = await Category.findById(categoryId).lean();
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const normalizedWeekStart = mondayOf(weekStartDate);

    // Every item referenced must actually belong to this category - an
    // admin picking items for "North Indian" week menu shouldn't be able to
    // slip in a "Chinese" item by mistake.
    const allItemIds = days.flatMap((d) => (Array.isArray(d.items) ? d.items : []));
    for (const itemId of allItemIds) {
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, message: `Invalid item ID: ${itemId}` });
      }
    }

    if (allItemIds.length > 0) {
      const validItemCount = await Item.countDocuments({
        _id: { $in: allItemIds },
        category: categoryId,
      });
      if (validItemCount !== new Set(allItemIds.map(String)).size) {
        return res.status(400).json({
          success: false,
          message: "One or more items don't exist or don't belong to this category.",
        });
      }
    }

    const normalizedDays = days
      .filter((d) => d.date && !isNaN(new Date(d.date).getTime()))
      .map((d) => {
        const dayDate = new Date(d.date);
        dayDate.setUTCHours(0, 0, 0, 0);
        return { date: dayDate, items: Array.isArray(d.items) ? d.items : [] };
      });

    const weeklyMenu = await WeeklyMenu.findOneAndUpdate(
      { category: categoryId, weekStartDate: normalizedWeekStart },
      {
        $set: {
          days: normalizedDays,
          createdBy: req.user.id,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Weekly menu saved successfully.",
      data: weeklyMenu,
    });
  } catch (error) {
    console.error("Upsert Weekly Menu Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ➤ Admin: fetch the configured menu for a category+week (to prefill the
// edit UI). Returns null data if nothing's been configured for that week yet.
export const getWeeklyMenu = async (req, res) => {
  try {
    const { category: categoryId, weekStartDate } = req.query;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "A valid category is required." });
    }
    if (!weekStartDate || isNaN(new Date(weekStartDate).getTime())) {
      return res.status(400).json({ success: false, message: "A valid weekStartDate is required." });
    }

    const normalizedWeekStart = mondayOf(weekStartDate);

    const weeklyMenu = await WeeklyMenu.findOne({
      category: categoryId,
      weekStartDate: normalizedWeekStart,
    }).populate("days.items", "name image isActive");

    return res.status(200).json({ success: true, data: weeklyMenu || null });
  } catch (error) {
    console.error("Get Weekly Menu Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ➤ Customer-facing: which items are available for a specific category on a
// specific date - powers the day-scoped item picker in the meal scheduler.
// Returns an empty list (not an error) when the admin hasn't configured a
// menu for that week/category/date yet, so the UI can show a clear
// "nothing available yet" state rather than falling back to showing every
// item in the category.
export const getAvailableItemsForDate = async (req, res) => {
  try {
    const { category: categoryId, date } = req.query;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "A valid category is required." });
    }
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ success: false, message: "A valid date is required." });
    }

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const weekStart = mondayOf(targetDate);

    const weeklyMenu = await WeeklyMenu.findOne({
      category: categoryId,
      weekStartDate: weekStart,
    }).populate({
      path: "days.items",
      match: { isActive: true },
      select: "name description image allergies category",
    });

    const dayEntry = weeklyMenu?.days.find(
      (d) => new Date(d.date).getTime() === targetDate.getTime()
    );

    const items = (dayEntry?.items || []).filter(Boolean);

    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("Get Available Items For Date Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
