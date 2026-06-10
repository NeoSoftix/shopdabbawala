import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Sidebar from "../../constants/vendormenu.js"

import { vendorMenu } from "../../constants/vendorMenu";
import { useAuth } from "../../context/AuthContext";

export default function VendorLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="VENDOR PANEL"
        menuItems={vendorMenu}
        onLogout={handleLogout}
      />

      <div className="flex flex-col flex-1">
<Header
  title="Vendor Dashboard"
  userName="Vendor"
  userRole="Vendor"
/>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}