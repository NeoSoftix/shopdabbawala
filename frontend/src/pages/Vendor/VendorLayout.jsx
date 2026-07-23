import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/shared/Header";
import Sidebar from "../../components/shared/Sidebar";
import NotificationDrawer from "../../components/shared/NotificationDrawer";
import { vendorMenu } from "../../constants/vendormenu.js";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getVendorProfile } from "../../services/vendor.service.js";
import { getOrderStats } from "../../services/order.service.js";

// Baseline count of Accepted (admin-approved, assigned-to-this-vendor)
// orders "seen" so far, persisted across reloads - the sidebar badge only
// shows orders assigned *after* the vendor last opened the Orders tab, same
// "seen indicator" feel as the notification bell.
const SEEN_KEY = "vendor_orders_seen_count";
const getSeenCount = () => Number(localStorage.getItem(SEEN_KEY)) || 0;

export default function VendorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [vendorProfile, setVendorProfile] = useState(null);
  const [assignedOrderCount, setAssignedOrderCount] = useState(0);

  useEffect(() => {
    getVendorProfile()
      .then((res) => setVendorProfile(res.data))
      .catch((error) => console.error("Failed to load vendor profile:", error));
  }, []);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    pagination,
    setPage,
  } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Refetches on mount and again every time a new notification arrives
  // (e.g. "New Order Assigned" from admin accepting an order), so the
  // sidebar badge updates without needing a manual page refresh.
  useEffect(() => {
    getOrderStats()
      .then((res) => {
        if (!res.success) return;
        const total = res.stats?.byStatus?.Accepted || 0;
        setAssignedOrderCount(Math.max(0, total - getSeenCount()));
      })
      .catch((error) => console.error("Failed to load order stats:", error));
  }, [unreadCount]);

  // Opening the Orders tab "dismisses" the badge - everything currently
  // Accepted is now considered seen, so the count resets to 0. It only
  // climbs again for orders assigned after this point.
  useEffect(() => {
    if (location.pathname !== "/vendor/orders") return;

    getOrderStats()
      .then((res) => {
        if (!res.success) return;
        const total = res.stats?.byStatus?.Accepted || 0;
        localStorage.setItem(SEEN_KEY, String(total));
        setAssignedOrderCount(0);
      })
      .catch((error) => console.error("Failed to load order stats:", error));
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="VENDOR PANEL"
        menuItems={vendorMenu}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        badges={{ "/vendor/notifications": unreadCount, "/vendor/orders": assignedOrderCount }}
      />

      <div className="flex flex-col flex-1 min-w-0 w-full h-full">
        <Header
          title="Vendor Dashboard"
          userName={vendorProfile?.organizationName || "Vendor"}
          userRole="Vendor"
          userPhoto={vendorProfile?.logo?.url}
          onMenuClick={() => setIsSidebarOpen(true)}
          notificationCount={unreadCount}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          profilePath="/vendor/profile"
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
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
