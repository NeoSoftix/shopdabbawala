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

// Create Vendor
export const createVendor = async (data) => {
  try {
    const res = await API.post(
      "/vendor",
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(
      "Create vendor error",
      error
    );

    throw error;
  }
};