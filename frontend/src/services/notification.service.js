import API from "./api";

export const getMyNotifications = async (page = 1, limit = 10) => {
  try {
    const res = await API.get("/notifications", {
      params: {
        page,
        limit,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Get Notifications Error", error);
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
