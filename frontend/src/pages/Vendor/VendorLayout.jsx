import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Sidebar from "../../components/shared/Sidebar";
import NotificationDrawer from "../../components/shared/NotificationDrawer";
import { vendorMenu } from "../../constants/vendormenu.js";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export default function VendorLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    pagination,
    setPage,
  } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
        badges={{ "/vendor/notifications": unreadCount }}
      />

      <div className="flex flex-col flex-1 min-w-0 w-full h-full">
        <Header
          title="Vendor Dashboard"
          userName="Vendor"
          userRole="Vendor"
          onMenuClick={() => setIsSidebarOpen(true)}
          notificationCount={unreadCount}
          onNotificationClick={() => setIsNotificationsOpen(true)}
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
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
