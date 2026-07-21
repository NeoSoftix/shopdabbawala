import API from "./api.js";

// 1. Create a delivery charge for a pincode (Admin Only)
export const createDeliveryCharge = async (data) => {
  try {
    const res = await API.post("/delivery-charges", data);
    return res.data;
  } catch (error) {
    console.error("Create Delivery Charge Error:", error);
    throw error;
  }
};

// 2. Get all delivery charges (Admin Only)
export const getAllDeliveryCharges = async (page = 1, limit = 10) => {
  try {
    const res = await API.get("/delivery-charges", { params: { page, limit } });
    return res.data;
  } catch (error) {
    console.error("Get All Delivery Charges Error:", error);
    throw error;
  }
};

// 3. Look up the delivery charge for a pincode (public, e.g. at checkout)
export const getDeliveryChargeByPincode = async (pincode) => {
  try {
    const res = await API.get(`/delivery-charges/check/${pincode}`);
    return res.data;
  } catch (error) {
    console.error("Get Delivery Charge By Pincode Error:", error);
    throw error;
  }
};

// 4. Update a delivery charge (Admin Only)
export const updateDeliveryCharge = async (id, data) => {
  try {
    const res = await API.put(`/delivery-charges/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update Delivery Charge Error:", error);
    throw error;
  }
};

// 5. Delete a delivery charge (Admin Only)
export const deleteDeliveryCharge = async (id) => {
  try {
    const res = await API.delete(`/delivery-charges/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Delivery Charge Error:", error);
    throw error;
  }
};
