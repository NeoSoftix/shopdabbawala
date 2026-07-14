import API from "./api.js";

// Admin: save/overwrite the item availability for every day of a
// (category, week) - upserts, so re-saving the same week just updates it.
export const saveWeeklyMenu = async ({ category, weekStartDate, days }) => {
  try {
    const res = await API.post("/weekly-menu", { category, weekStartDate, days });
    return res.data;
  } catch (error) {
    console.error("Save Weekly Menu Error", error);
    throw error;
  }
};

// Admin: fetch the already-configured menu for a (category, week), to
// prefill the edit UI. `data` is null if nothing's been configured yet.
export const getWeeklyMenu = async (category, weekStartDate) => {
  try {
    const res = await API.get("/weekly-menu", { params: { category, weekStartDate } });
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
