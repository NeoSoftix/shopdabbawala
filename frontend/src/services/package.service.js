import API from "./api.js";

// 1. Create a new package (Admin Only)
export const createPackage = async (data) => {
  try {
    const res = await API.post("/packages", data);
    return res.data;
  } catch (error) {
    console.error("Create Package Error:", error);
    throw error;
  }
};

// 2. Get all packages (Includes active & inactive packages)
export const getAllPackages = async () => {
  try {
    const res = await API.get("/packages");
    return res.data;
  } catch (error) {
    console.error("Get All Packages Error:", error);
    throw error;
  }
};

// 3. Get only active packages 
export const getActivePackages = async () => {
  try {
    const res = await API.get("/packages/active");
    return res.data;
  } catch (error) {
    console.error("Get Active Packages Error:", error);
    throw error;
  }
};

// 4. Get a single package by its ID
export const getOnePackage = async (id) => {
  try {
    const res = await API.get(`/packages/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get One Package Error:", error);
    throw error;
  }
};

// 5. Update an existing package configuration (Admin Only)
export const updatePackage = async (id, data) => {
  try {
    const res = await API.put(`/packages/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update Package Error:", error);
    throw error;
  }
};

// 6. Toggle Package Status (Active <-> Inactive)
export const togglePackageStatus = async (id) => {
  try {
    const res = await API.patch(`/packages/${id}`);
    return res.data;
  } catch (error) {
    console.error("Toggle Package Status Error:", error);
    throw error;
  }
};

// 7. Permanently delete a package 
export const deletePackage = async (id) => {
  try {
    const res = await API.delete(`/packages/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Package Error:", error);
    throw error;
  }
};