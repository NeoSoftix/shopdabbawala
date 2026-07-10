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
export const getAllOrders = async (search = "", page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set("search", search);

    const res = await API.get(`/orders?${params.toString()}`);
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

// ➤ Get the logged-in user's own orders (Order History / Today's Order tabs)
export const getMyOrders = async () => {
  try {
    const res = await API.get("/orders/my-orders");
    return res.data;
  } catch (error) {
    console.error("Get My Orders Error", error);
    throw error;
  }
};

// ➤ 5. Vendor accepts a pending order
export const acceptOrder = async (orderId) => {
  try {
    const res = await API.patch(`/orders/${orderId}/accept`);
    return res.data;
  } catch (error) {
    console.error("Accept Order Error", error);
    throw error;
  }
};

// ➤ 6. Vendor rejects a pending order
export const rejectOrder = async (orderId) => {
  try {
    const res = await API.patch(`/orders/${orderId}/reject`);
    return res.data;
  } catch (error) {
    console.error("Reject Order Error", error);
    throw error;
  }
};

// ➤ 7. Vendor marks an accepted order as ready to deliver (today's orders only)
export const markOrderReadyToDeliver = async (orderId) => {
  try {
    const res = await API.patch(`/orders/${orderId}/ready-to-deliver`);
    return res.data;
  } catch (error) {
    console.error("Mark Order Ready To Deliver Error", error);
    throw error;
  }
};

// ➤ 8. Vendor marks an order that's out for delivery as delivered
export const markOrderDelivered = async (orderId) => {
  try {
    const res = await API.patch(`/orders/${orderId}/delivered`);
    return res.data;
  } catch (error) {
    console.error("Mark Order Delivered Error", error);
    throw error;
  }
};
