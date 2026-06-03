import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { adminMenu } from "../../constants/adminMenu";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="ADMIN PANEL"
        menuItems={adminMenu}
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