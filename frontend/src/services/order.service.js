import API from "./api";

// ➤ 1. Get total order count (powers the dashboard stat card)
export const getOrderStats = async () => {
  try {
    const res = await API.get("/orders/stats");
    return res.data;
  } catch (error) {
    console.error("Get Order Stats Error", error);
    throw error;
  }
};

// ➤ 2. Get all orders (powers the Orders list page)
export const getAllOrders = async (search = "") => {
  try {
    const url = search ? `/orders?search=${encodeURIComponent(search)}` : "/orders";
    const res = await API.get(url);
    return res.data;
  } catch (error) {
    console.error("Get All Orders Error", error);
    throw error;
  }
};

// ➤ 3. Get order counts per day for a given month (powers the calendar view)
export const getOrderCountsByMonth = async (year, month) => {
  try {
    const res = await API.get(`/orders/calendar-counts?year=${year}&month=${month}`);
    return res.data;
  } catch (error) {
    console.error("Get Order Counts Error", error);
    throw error;
  }
};

// ➤ 4. Get all orders for a specific date (YYYY-MM-DD)
export const getOrdersByDate = async (date) => {
  try {
    const res = await API.get(`/orders/by-date?date=${date}`);
    return res.data;
  } catch (error) {
    console.error("Get Orders By Date Error", error);
    throw error;
  }
};
