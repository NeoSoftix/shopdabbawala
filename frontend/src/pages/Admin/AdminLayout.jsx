import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { adminMenu } from "../../constants/adminMenu";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLayout() {

  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()

    navigate("/login")
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="ADMIN PANEL"
        menuItems={adminMenu}
        onLogout={handleLogout}

      />

      <div className="flex flex-col flex-1">

        <Header title="Dashboard" />

        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}