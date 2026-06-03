import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-4xl font-bold mt-2">1248</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-4xl font-bold mt-2">842</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">Total Vendors</p>
            <h2 className="text-4xl font-bold mt-2">56</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500">Total Items</p>
            <h2 className="text-4xl font-bold mt-2">256</h2>
          </div>
        </div>
      </main>
    </div>
  );
}