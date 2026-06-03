import Sidebar from "../../components/Sidebar";
import { adminMenu } from "../../constants/adminMenu";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="ADMIN PANEL"
        menuItems={adminMenu}
      />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
      </div>
    </div>
  );
}