import mongoose from "mongoose";
import WeeklyMenu from "../models/weeklyMenu.model.js";
import Category from "../models/category.model.js";
import Item from "../models/item.model.js";

const mondayOf = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const dow = d.getUTCDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
};

// ➤ Admin: create/update the menu for a specific date (upserts into WeeklyMenu).
export const upsertWeeklyMenu = async (req, res) => {
  try {
    const { category: categoryId, date, sections } = req.body;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "A valid category is required." });
    }
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ success: false, message: "A valid date is required." });
    }
    if (!Array.isArray(sections)) {
      return res.status(400).json({ success: false, message: "sections must be an array." });
    }

    const categoryExists = await Category.findById(categoryId).lean();
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const normalizedWeekStart = mondayOf(targetDate);

    // Validate items
    const allItemIds = sections.flatMap((s) => (Array.isArray(s.items) ? s.items : []));
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

    let weeklyMenu = await WeeklyMenu.findOne({
      category: categoryId,
      weekStartDate: normalizedWeekStart,
    });

    if (!weeklyMenu) {
      weeklyMenu = new WeeklyMenu({
        category: categoryId,
        weekStartDate: normalizedWeekStart,
        days: [],
        createdBy: req.user.id,
      });
    }

    const dayIndex = weeklyMenu.days.findIndex(
      (d) => new Date(d.date).getTime() === targetDate.getTime()
    );

    if (dayIndex >= 0) {
      weeklyMenu.days[dayIndex].sections = sections;
    } else {
      weeklyMenu.days.push({ date: targetDate, sections });
    }

    await weeklyMenu.save();

    return res.status(200).json({
      success: true,
      message: "Daily menu saved successfully.",
      data: weeklyMenu,
    });
  } catch (error) {
    console.error("Upsert Daily Menu Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ➤ Admin: fetch the configured menu for a category+date.
export const getWeeklyMenu = async (req, res) => {
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
    const normalizedWeekStart = mondayOf(targetDate);

    const weeklyMenu = await WeeklyMenu.findOne({
      category: categoryId,
      weekStartDate: normalizedWeekStart,
    }).populate("days.sections.items", "name isActive");

    const dayMenu = weeklyMenu?.days?.find(
      (d) => new Date(d.date).getTime() === targetDate.getTime()
    );

    return res.status(200).json({ success: true, data: dayMenu || null });
  } catch (error) {
    console.error("Get Daily Menu Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ➤ Customer-facing: Get sections available for a specific category on a date.
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
      path: "days.sections.items",
      match: { isActive: true },
      select: "name description allergies category",
    });

    const dayEntry = weeklyMenu?.days.find(
      (d) => new Date(d.date).getTime() === targetDate.getTime()
    );

    const sections = dayEntry?.sections || [];

    return res.status(200).json({ success: true, data: sections });
  } catch (error) {
    console.error("Get Available Items For Date Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ➤ Customer-facing: Get an array of all dates that have a menu for a category.
export const getAvailableMenuDates = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "A valid category ID is required." });
    }

    // Get all weekly menus for this category
    const menus = await WeeklyMenu.find({ category: categoryId }).lean();
    
    let availableDates = [];
    menus.forEach((menu) => {
      if (menu.days) {
        menu.days.forEach((day) => {
          if (day.sections && day.sections.length > 0) {
            availableDates.push(new Date(day.date).toISOString());
          }
        });
      }
    });

    // Deduplicate and sort
    availableDates = [...new Set(availableDates)].sort((a, b) => new Date(a) - new Date(b));

    return res.status(200).json({ success: true, availableDates });
  } catch (error) {
    console.error("Get Available Menu Dates Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
