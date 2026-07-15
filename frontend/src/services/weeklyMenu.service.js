import API from "./api.js";

// Admin: save/overwrite the item availability for every day of a
// (category, date) - upserts, so re-saving the same day just updates it.
export const saveWeeklyMenu = async ({ category, date, sections }) => {
  try {
    const res = await API.post("/weekly-menu", { category, date, sections });
    return res.data;
  } catch (error) {
    console.error("Save Weekly Menu Error", error);
    throw error;
  }
};

// Admin: fetch the already-configured menu for a (category, date), to
// prefill the edit UI. `data` is null if nothing's been configured yet.
export const getWeeklyMenu = async (category, date) => {
  try {
    const res = await API.get("/weekly-menu", { params: { category, date } });
    return res.data;
  } catch (error) {
    console.error("Get Weekly Menu Error", error);
    throw error;
  }
};

// Customer-facing: items available for a category on one specific date.
export const getAvailableItemsForDate = async (category, date) => {
  try {
    const res = await API.get("/weekly-menu/available-items", { params: { category, date } });
    return res.data;
  } catch (error) {
    console.error("Get Available Items For Date Error", error);
    throw error;
  }
};

// Customer-facing: every date (across all published weeks) the admin has
// configured a menu for, in this category - not limited to the current week.
export const getAvailableMenuDates = async (categoryId) => {
  try {
    const res = await API.get(`/weekly-menu/available-dates/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error("Get Available Menu Dates Error", error);
    throw error;
  }
};
