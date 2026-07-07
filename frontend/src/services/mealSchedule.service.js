import API from "./api";

// Get user's meal plan
export const getMyMealPlan = async () => {
  try {
    const res = await API.get("/schedule/my-plan");
    return res.data;
  } catch (error) {
    console.error("Get My Meal Plan Error", error);
    throw error;
  }
};