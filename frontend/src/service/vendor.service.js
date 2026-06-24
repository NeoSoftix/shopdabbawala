import API from "./api.js";

// 1. Get All Vendors
export const getAllVendors = async () => {
  try {
    const res = await API.get("/vendor");
    return res.data;
  } catch (error) {
    console.error("Get all vendors error:", error);
    throw error;
  }
};

// 2. Get One Vendor By ID
export const getOneVendor = async (id) => {
  try {
    const res = await API.get(`/vendor/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get one vendor error:", error);
    throw error;
  }
};

// 3. Create Vendor (Handles Text Fields + Logo File)
export const createVendor = async (data) => {
  try {
    // Data FormData object hona chahiye frontend se kyunki logo file upload ho rahi hai
    const res = await API.post("/vendor", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create vendor error:", error);
    throw error;
  }
};

// 4. Update Vendor (Handles Text Fields + Optional New Logo File)
export const updateVendor = async (id, data) => {
  try {
    // Agar frontend se raw object aa raha hai aur image upload nahi karni, 
    // toh standard headers auto-apply ho jayenge, par agar image badalni hai toh FormData bhejein.
    const isFormData = data instanceof FormData;
    
    const res = await API.put(`/vendor/${id}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update vendor error:", error);
    throw error;
  }
};

// 5. Toggle Vendor Status (Active / Inactive)
export const toggleVendorStatus = async (id, isActive) => {
  try {
    // Controller body me { isActive } accept kar raha hai
    const res = await API.patch(`/vendor/toggle/${id}`, { isActive });
    return res.data;
  } catch (error) {
    console.error("Toggle vendor status error:", error);
    throw error;
  }
};

// 6. Delete Vendor
export const deleteVendor = async (id) => {
  try {
    const res = await API.delete(`/vendor/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete vendor error:", error);
    throw error;
  }
};

// get vendor profile 
export const getVendorProfile = async () => {
  try {
    const res = await API.get("/vendor/me")

    return res.data
  } catch (error) {
    console.error("Get Vendor Profile Error", error)

    throw error
  }
}