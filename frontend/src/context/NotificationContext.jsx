import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Bell } from "lucide-react";
import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket } from "../services/socket";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationRead as markNotificationReadService,
  markAllNotificationsRead as markAllNotificationsReadService,
  deleteOneNotification as deleteOneNotificationService,
} from "../services/notification.service";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const isRecipient = user?.role === "vendor" || user?.role === "user" || user?.role === "admin";

  useEffect(() => {
    if (!isRecipient) return;

    (async () => {
      try {
        const [listRes, countRes] = await Promise.all([
          getMyNotifications(page, 10),
          getUnreadNotificationCount(),
        ]);

        if (listRes?.success) setNotifications(listRes.notifications);
        setPagination(listRes.pagination);
        if (countRes?.success) setUnreadCount(countRes.count);
      } catch (error) {
        console.log("Notification initial load error", error);
      }
    })();

    const socket = connectSocket();

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(notification.title, { icon: <Bell size={16} /> });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
      disconnectSocket();
    };
  }, [isRecipient, page]);

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationReadService(id);
    } catch (error) {
      console.log("Mark as read failed", error);
    }
  };

  const deleteNotification = async (id) => {
    const target = notifications.find((n) => n._id === id);

    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (target && !target.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await deleteOneNotificationService(id);
    } catch (error) {
      console.log("Delete notification failed", error);
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
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        page,
        setPage,
        pagination,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
