import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Sidebar from "../../components/shared/Sidebar";
import { vendorMenu } from "../../constants/vendormenu.js";
import { useAuth } from "../../context/AuthContext";
import { NotificationProvider, useNotifications } from "../../context/NotificationContext";

function VendorLayoutInner() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function VendorLayout() {
  return (
    <NotificationProvider>
      <VendorLayoutInner />
    </NotificationProvider>
  );
}
