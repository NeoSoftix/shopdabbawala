import API from "./api.js";

// Admin assigns a vendor to serve a package in a pincode
export const assignVendor = async (data) => {
  try {
    const res = await API.post("/vendor-assignment", data);
    return res.data;
  } catch (error) {
    console.error("Assign Vendor Error:", error);
    throw error;
  }
};

// Admin views all assignments
export const getAllAssignments = async () => {
  try {
    const res = await API.get("/vendor-assignment");
    return res.data;
  } catch (error) {
    console.error("Get Assignments Error:", error);
    throw error;
  }
};

// Admin removes an assignment
export const removeAssignment = async (id) => {
  try {
    const res = await API.delete(`/vendor-assignment/${id}`);
    return res.data;
  } catch (error) {
    console.error("Remove Assignment Error:", error);
    throw error;
  }
};
