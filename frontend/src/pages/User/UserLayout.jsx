import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { userMenuItems } from "../../constants/userMenu";

export default function UserLayout() {
  const handleLogout = () => {
    console.log("logout");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        title="TiffinBox"
        subtitle="USER PANEL"
        menuItems={userMenuItems}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Welcome Back 👋
            </h2>

            <p className="text-sm text-gray-500">
              Manage your meals and schedule
            </p>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150"
              alt="user"
              className="w-11 h-11 rounded-full"
            />

            <div>
              <p className="font-medium">
                Rahul Sharma
              </p>

              <p className="text-xs text-gray-500">
                Customer
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}