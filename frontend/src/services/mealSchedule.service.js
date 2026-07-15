import API from "./api";

// Get user's meal plan
export const getMyMealPlan = async () => {
  try {
    const res = await API.get("/meal-schedule/my-plan");
    return res.data;
  } catch (error) {
    console.error("Get My Meal Plan Error", error);
    throw error;
  }
};

// Create/update a single date's meal schedule
export const createMeal = async (data) => {
  try {
    const res = await API.post("/meal-schedule/create", data);
    return res.data;
  } catch (error) {
    console.error("Update Day Schedule Error", error);
    throw error;
  }
};

export const getMealSchedule = async (
  subscriptionId
) => {
  try {
    const res = await API.get(
      `/meal-schedule/my-plan/${subscriptionId}`
    );

    return res.data;
  } catch (error) {
    console.error(
      "Get meal schedule error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// Active/inactive status of each saved day-order for a subscription
export const getDayStatuses = async (subscriptionId) => {
  try {
    const res = await API.get(`/meal-schedule/day-status/${subscriptionId}`);
    return res.data;
  } catch (error) {
    console.error("Get day statuses error:", error.response?.data || error.message);
    throw error;
  }
};

// Pause/resume a specific date's order
export const updateDayStatus = async ({ subscriptionId, date, active }) => {
  try {
    const res = await API.patch("/meal-schedule/day-status", { subscriptionId, date, active });
    return res.data;
  } catch (error) {
    console.error("Update day status error:", error.response?.data || error.message);
    throw error;
  }
};

// Add-ons already saved per day for a subscription (extra items riding on
// an already-scheduled meal, with their own extra charge)
export const getDayAddonsSummary = async (subscriptionId) => {
  try {
    const res = await API.get(`/meal-schedule/day-addons/${subscriptionId}`);
    return res.data;
  } catch (error) {
    console.error("Get day addons summary error:", error.response?.data || error.message);
    throw error;
  }
};

// Replace the add-ons for a specific already-scheduled day
export const updateDayAddons = async ({ subscriptionId, date, addons }) => {
  try {
    const res = await API.patch("/meal-schedule/day-addons", { subscriptionId, date, addons });
    return res.data;
  } catch (error) {
    console.error("Update day addons error:", error.response?.data || error.message);
    throw error;
  }
};