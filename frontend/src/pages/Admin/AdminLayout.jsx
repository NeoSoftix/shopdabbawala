import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/shared/Header";
import Sidebar from "../../components/shared/Sidebar";
import NotificationDrawer from "../../components/shared/NotificationDrawer";
import { adminMenu } from "../../constants/adminMenu";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getOrderStats } from "../../services/order.service";

// Baseline pending-order count "seen" so far, persisted across reloads -
// the sidebar badge only shows orders placed *after* the admin last opened
// the Orders tab, same "seen indicator" feel as the notification bell.
const SEEN_KEY = "admin_orders_seen_count";
const getSeenCount = () => Number(localStorage.getItem(SEEN_KEY)) || 0;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const { logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications, pagination, setPage } = useNotifications();

  // Refetches on mount and again every time a new notification arrives
  // (unreadCount going up), so a freshly-placed order bumps the sidebar
  // badge without needing a manual page refresh - same real-time feel as
  // the notification bell itself.
  useEffect(() => {
    getOrderStats()
      .then((res) => {
        if (!res.success) return;
        const total = res.stats?.byStatus?.Pending || 0;
        setPendingOrderCount(Math.max(0, total - getSeenCount()));
      })
      .catch((error) => console.error("Failed to load order stats:", error));
  }, [unreadCount]);

  // Opening the Orders tab "dismisses" the badge - everything currently
  // Pending is now considered seen, so the count resets to 0. It only
  // climbs again for orders placed after this point, not for ones still
  // sitting Pending that the admin simply hasn't acted on yet.
  useEffect(() => {
    if (location.pathname !== "/admin/orders") return;

    getOrderStats()
      .then((res) => {
        if (!res.success) return;
        const total = res.stats?.byStatus?.Pending || 0;
        localStorage.setItem(SEEN_KEY, String(total));
        setPendingOrderCount(0);
      })
      .catch((error) => console.error("Failed to load order stats:", error));
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      {/* SIDEBAR: State aur close logic connect kar diya */}
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="ADMIN PANEL"
        menuItems={adminMenu}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        badges={{ "/admin/orders": pendingOrderCount }}
      />

      <div className="flex flex-col flex-1 min-w-0 w-full h-full">
        {/* HEADER: onMenuClick pass kar diya jo hamburger pe click hote hi state true karega */}
        <Header
          title="Dashboard"
          userName="Admin"
          userRole="Super Admin"
          onMenuClick={() => setIsSidebarOpen(true)}
          notificationCount={unreadCount}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          profilePath="/admin/settings"
        />

        <main className="flex-1  overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
        onDeleteAll={deleteAllNotifications}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
