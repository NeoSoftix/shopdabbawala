import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Bell } from "lucide-react";
import { useAuth } from "./AuthContext";
import { getSocket, connectSocket, disconnectSocket } from "../services/socket";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationRead as markNotificationReadService,
  markAllNotificationsRead as markAllNotificationsReadService,
  deleteOneNotification as deleteOneNotificationService,
  deleteAllNotifications as deleteAllNotificationsService,
} from "../services/notification.service";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const isRecipient = user?.role === "vendor" || user?.role === "user" || user?.role === "admin";

  const refetch = useCallback(async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        getMyNotifications(page, 10),
        getUnreadNotificationCount(),
      ]);

      if (listRes?.success) setNotifications(listRes.notifications);
      setPagination(listRes.pagination);
      if (countRes?.success) setUnreadCount(countRes.count);
    } catch (error) {
      console.log("Notification load error", error);
    }
  }, [page]);

  // Data fetch: re-runs on page change (pagination), but doesn't touch the socket.
  useEffect(() => {
    if (!isRecipient) return;
    refetch();
  }, [isRecipient, refetch]);

  // Socket connection: kept separate from the data fetch above so changing
  // `page` (pagination) doesn't tear down and reconnect the socket.
  useEffect(() => {
    if (!isRecipient) return;

    const socket = getSocket();

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(notification.title, { icon: <Bell size={16} /> });
    };

    // The socket auto-reconnects after a drop (tab backgrounded, network
    // blip, server restart), but any notification created while it was
    // disconnected is missed - socket.io doesn't replay events. Re-sync
    // from the REST API whenever a (re)connection is established so the
    // list/badge catch up without needing a manual page refresh.
    const handleConnectError = (error) => {
      console.error("Notification socket connect_error:", error.message);
    };

    socket.on("connect", refetch);
    socket.on("notification:new", handleNewNotification);
    socket.on("connect_error", handleConnectError);

    connectSocket();

    return () => {
      socket.off("connect", refetch);
      socket.off("notification:new", handleNewNotification);
      socket.off("connect_error", handleConnectError);
      disconnectSocket();
    };
  }, [isRecipient, refetch]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationReadService(id);
    } catch (error) {
      console.log("Mark as read failed", error);
    }
  }, []);

  const deleteNotification = useCallback(
    async (id) => {
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
    },
    [notifications],
  );

  const deleteAllNotifications = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);

    try {
      await deleteAllNotificationsService();
    } catch (error) {
      console.log("Delete all notifications failed", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsReadService();
    } catch (error) {
      console.log("Mark all as read failed", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
      page,
      setPage,
      pagination,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications, page, pagination],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
