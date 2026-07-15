import API from "./api";

// ➤ 1. Get Customer Stats (Admin only)
export const getCustomerStats = async () => {
  try {
    const res = await API.get("/customer/stats");
    return res.data;
  } catch (error) {
    console.error("Get Customer Stats Error", error);
    throw error;
  }
};

// ➤ 2. Get All Customers (Admin only)
export const getAllCustomers = async (search = "", page = 1, limit = 10) => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    const res = await API.get("/customer", { params });
    return res.data;
  } catch (error) {
    console.error("Get All Customers Error", error);
    throw error;
  }
};

// ➤ 3. Get Logged-in Customer Profile (Self / Customer only)
export const getCustomerProfile = async () => {
  try {
    const res = await API.get("/customer/me");
    return res.data;
  } catch (error) {
    console.error("Get Customer Profile Error", error);
    throw error;
  }
};

// ➤ 4. Update Customer Profile (Self / Customer only)
export const updateCustomerProfile = async (data) => {
  try {
    const res = await API.put("/customer/me", data);
    return res.data;
  } catch (error) {
    console.error("Update Customer Profile Error", error);
    throw error;
  }
};

// ➤ 5. Get One Customer details (Admin only)
export const getOneCustomer = async (id) => {
  try {
    const res = await API.get(`/customer/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get One Customer Error", error);
    throw error;
  }
};

// ➤ 6. Delete Customer (Admin only)
export const deleteCustomer = async (id) => {
  try {
    const res = await API.delete(`/customer/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Customer Error", error);
    throw error;
  }
};
