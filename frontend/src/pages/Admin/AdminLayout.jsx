import { useState } from "react"; // <-- Yeh import zaroori tha
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/shared/Header";
import Sidebar from "../../components/shared/Sidebar";
import { adminMenu } from "../../constants/adminMenu";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* SIDEBAR: State aur close logic connect kar diya */}
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="ADMIN PANEL"
        menuItems={adminMenu}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 w-full">
        {/* HEADER: onMenuClick pass kar diya jo hamburger pe click hote hi state true karega */}
        <Header
          title="Dashboard"
          userName="Admin"
          userRole="Super Admin"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
