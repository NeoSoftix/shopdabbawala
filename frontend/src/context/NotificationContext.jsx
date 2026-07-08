import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket } from "../services/socket";
import {
  getVendorNotifications,
  getUnreadNotificationCount,
  markNotificationRead as markNotificationReadService,
  markAllNotificationsRead as markAllNotificationsReadService,
} from "../services/notification.service";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isVendor = user?.role === "vendor";

  useEffect(() => {
    if (!isVendor) return;

    (async () => {
      try {
        const [listRes, countRes] = await Promise.all([
          getVendorNotifications(),
          getUnreadNotificationCount(),
        ]);

        if (listRes?.success) setNotifications(listRes.notifications);
        if (countRes?.success) setUnreadCount(countRes.count);
      } catch (error) {
        console.log("Notification initial load error", error);
      }
    })();

    const socket = connectSocket();

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(notification.title, { icon: "🔔" });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
      disconnectSocket();
    };
  }, [isVendor]);

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationReadService(id);
    } catch (error) {
      console.log("Mark as read failed", error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsReadService();
    } catch (error) {
      console.log("Mark all as read failed", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
