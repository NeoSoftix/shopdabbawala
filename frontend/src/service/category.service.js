import API from "./api.js";

// create new category
export const createCategory = async (data) => {
  try {
    const res = await API.post("/category", data);

    return res.data;
  } catch (error) {
    console.log("Caetgory error", error);

    throw error;
  }
};

// get all cartegory
export const getAllCategories = async () => {
  try {
    const res = await API.get("/category");

    return res.data;
  } catch (error) {
    console.log("Get all categories error", error);

    throw error;
  }
};

// get category by food type (veg/non-veg)

export const getCategoryByFoodType = async (foodType) => {
  try {
    const res = await API.get(`/category/food-type/${foodType}`);

    return res.data;
  } catch (error) {
    console.log("Get category by food type error", error);

    throw error;
  }
};

// get single category

export const getSingleCategory = async (id) => {
  try {
    const res = await API.get(`/category/${id}`);

    return res.data;
  } catch (error) {
    console.log("Get single category error", error);

    throw error;
  }
};

// update category

export const updateCategory = async (id, data) => {
  try {
    const res = await API.put(`/category/${id}`, data);

    return res.data;
  } catch (error) {
    console.log("Update the category error", error);

    throw error;
  }
};

// toggel category status (active/inactive)

export const toggelStatusCategory = async (id) => {
  try {
    const res = await API.patch(`/category/${id}/status`);

    return res.data;
  } catch (error) {
    console.log("Toggle status category error", error);

    throw error;
  }
};

// delete category

export const deleteCategory = async (id) => {
  try {
    const res = await API.delete(`/category/${id}`);

    return res.data;
  } catch (error) {
    console.log("Delete category error", error);

    throw error;
  }
};
