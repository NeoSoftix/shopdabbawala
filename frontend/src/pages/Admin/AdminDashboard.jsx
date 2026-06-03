import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { adminMenu } from "../../constants/adminMenu";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar
        title="TIFFIN SERVICE"
        subtitle="ADMIN PANEL"
        menuItems={adminMenu}
      />

      {/* Right Side */}
      <div className="flex flex-col flex-1">
        
        {/* Header */}
        <Header title="Dashboard" />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>
        </main>

      </div>
    </div>
  );
}