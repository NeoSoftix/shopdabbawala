import API from "./api.js";

// create item service
export const createItem = async (data) => {
  try {
    const res = await API.post("/items", data);

    return res.data;
  } catch (error) {
    console.log("Create item error", error);

    throw error;
  }
};

// get single item service
export const getSingleItem = async (id) => {
  try {
    const res = await API.get(`/items/${id}`);

    return res.data;
  } catch (error) {
    console.log("Get single item error", error);

    throw error;
  }
};

// get item by category service
export const getItemsByCategory = async (categoryId) => {
  try {
    const res = await API.get(`/items/category/${categoryId}`);

    return res.data;
  } catch (error) {
    console.log("Get items by category error", error);

    throw error;
  }
};

// update item service
export const updateItem = async (id, data) => {
  try {
    const res = await API.put(`/items/${id}`, data);

    return res.data;
  } catch (error) {
    console.log("Update item error", error);

    throw error;
  }
};

// toggle status of item of service
export const toggleItemStatus = async (id) => {
  try {
    const res = await API.patch(`/items/${id}/toggle-status`);

    return res.data;
  } catch (error) {
    console.log("Toggle item status error", error);

    throw error;
  }
};

// delete the item service

export const deleteItem = async (id) => {
  try {
    const res = await API.delete(`/items/${id}`);

    return res.data;
  } catch (error) {
    console.log("Delete item error", error);

    throw error;
  }
};


// get all items service

export const getAllItems = async (page = 1, limit = 10, category = "") => {
    try {
        const res = await API.get("/items", { params: { page, limit, category: category || undefined } })

        return res.data
    } catch (error) {
        console.log("Get all items error", error)

        throw error
    }
}

// get active items service
export const getActiveItems = async () => {
    try {
        const res = await API.get("/items/active")

        return res.data
    } catch (error) {
        console.log("Get active items error", error)

        throw error
    }
}