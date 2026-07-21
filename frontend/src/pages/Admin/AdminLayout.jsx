import { useState } from "react"; // <-- Yeh import zaroori tha
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Sidebar from "../../components/shared/Sidebar";
import NotificationDrawer from "../../components/shared/NotificationDrawer";
import { adminMenu } from "../../constants/adminMenu";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, pagination, setPage } = useNotifications();

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
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
