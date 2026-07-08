import API from "./api";

export const getVendorNotifications = async () => {
  try {
    const res = await API.get("/notifications");
    return res.data;
  } catch (error) {
    console.log("Get Vendor Notifications Error", error);
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const res = await API.get("/notifications/unread-count");
    return res.data;
  } catch (error) {
    console.log("Get Unread Notification Count Error", error);
    throw error;
  }
};

export const markNotificationRead = async (id) => {
  try {
    const res = await API.patch(`/notifications/${id}/read`);
    return res.data;
  } catch (error) {
    console.log("Mark Notification Read Error", error);
    throw error;
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const res = await API.patch("/notifications/read-all");
    return res.data;
  } catch (error) {
    console.log("Mark All Notifications Read Error", error);
    throw error;
  }
};
