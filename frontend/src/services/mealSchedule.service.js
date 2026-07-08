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

// Update a single day's schedule (items + optional addressId)
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

// Pause/resume a specific day's order
export const updateDayStatus = async ({ subscriptionId, day, active }) => {
  try {
    const res = await API.patch("/meal-schedule/day-status", { subscriptionId, day, active });
    return res.data;
  } catch (error) {
    console.error("Update day status error:", error.response?.data || error.message);
    throw error;
  }
};