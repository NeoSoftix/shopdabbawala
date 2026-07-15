import API from "./api";

// Create Add On
export const createAddOn = async (data) => {
  try {
    const res = await API.post("/addons", data);

    return res.data;
  } catch (error) {
    console.log("Create Add On Error", error);

    throw error;
  }
};

// Get All Add Ons
export const getAllAddOns = async (page = 1, limit = 10) => {
  try {
    const res = await API.get("/addons", { params: { page, limit } });

    return res.data;
  } catch (error) {
    console.log("Get All Add Ons Error", error);

    throw error;
  }
};

// Get Active Add Ons
export const getActiveAddOns = async () => {
  try {
    const res = await API.get("/addons/active");

    return res.data;
  } catch (error) {
    console.log("Get Active Add Ons Error", error);

    throw error;
  }
};

// Get One Add On
export const getOneAddOn = async (id) => {
  try {
    const res = await API.get(`/addons/${id}`);

    return res.data;
  } catch (error) {
    console.log("Get One Add On Error", error);

    throw error;
  }
};

// Update Add On
export const updateAddOn = async (id, data) => {
  try {
    const res = await API.put(`/addons/${id}`, data);

    return res.data;
  } catch (error) {
    console.log("Update Add On Error", error);

    throw error;
  }
};

// Delete Add On
export const deleteAddOn = async (id) => {
  try {
    const res = await API.delete(`/addons/${id}`);

    return res.data;
  } catch (error) {
    console.log("Delete Add On Error", error);

    throw error;
  }
};

// Toggle Status
export const toggleStatus = async (id) => {
  try {
    const res = await API.patch(`/addons/${id}/status`);

    return res.data;
  } catch (error) {
    console.log("Toggle Status Error", error);

    throw error;
  }
};