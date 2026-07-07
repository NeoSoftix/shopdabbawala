import API from "./api"; 

export const getActivePlans = async () => {
  try {
    const response = await API.get("/custom/active");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPlan = async (planData) => {
  try {
    const response = await API.post("/custom", planData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllPlans = async () => {
  try {
    const response = await API.get("/custom");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePlan = async (id, updatedData) => {
  try {
    const response = await API.put(`/custom/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const togglePlanStatus = async (id) => {
  try {
    const response = await API.patch(`/custom/toggle-status/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deletePlan = async (id) => {
  try {
    const response = await API.delete(`/custom/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};