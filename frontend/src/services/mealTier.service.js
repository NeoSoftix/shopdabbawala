import API from "./api.js";

export const getActiveMealTiers = async () => {
  try {
    const res = await API.get("/meal-tiers/active");
    return res.data;
  } catch (error) {
    console.log("Get active meal tiers error", error);
    throw error;
  }
};

export const getAllMealTiers = async () => {
  try {
    const res = await API.get("/meal-tiers");
    return res.data;
  } catch (error) {
    console.log("Get all meal tiers error", error);
    throw error;
  }
};

export const createMealTier = async (data) => {
  try {
    const res = await API.post("/meal-tiers", data);
    return res.data;
  } catch (error) {
    console.log("Create meal tier error", error);
    throw error;
  }
};

export const updateMealTier = async (id, data) => {
  try {
    const res = await API.put(`/meal-tiers/${id}`, data);
    return res.data;
  } catch (error) {
    console.log("Update meal tier error", error);
    throw error;
  }
};

export const toggleMealTierStatus = async (id) => {
  try {
    const res = await API.patch(`/meal-tiers/toggle-status/${id}`);
    return res.data;
  } catch (error) {
    console.log("Toggle meal tier status error", error);
    throw error;
  }
};

export const deleteMealTier = async (id) => {
  try {
    const res = await API.delete(`/meal-tiers/${id}`);
    return res.data;
  } catch (error) {
    console.log("Delete meal tier error", error);
    throw error;
  }
};
