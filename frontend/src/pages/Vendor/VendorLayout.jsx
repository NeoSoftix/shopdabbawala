import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Sidebar from "../../components/shared/Sidebar";
import NotificationDrawer from "../../components/shared/NotificationDrawer";
import { vendorMenu } from "../../constants/vendormenu.js";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getVendorProfile } from "../../services/vendor.service.js";

export default function VendorLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [vendorProfile, setVendorProfile] = useState(null);

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
