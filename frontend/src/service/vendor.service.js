import API from "./api.js";

// Get All Vendors
export const getAllVendors = async () => {
  try {
    const res = await API.get("/vendor");

    return res.data;
  } catch (error) {
    console.log("Get all vendors error", error);

    throw error;
  }
};