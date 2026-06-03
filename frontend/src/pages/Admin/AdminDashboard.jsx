import {
  FiUsers,
  FiShoppingBag,
  FiShoppingCart,
} from "react-icons/fi";

import {
  MdRestaurantMenu,
  MdFastfood,
} from "react-icons/md";

import { FaRupeeSign } from "react-icons/fa";
import DashboardPieChart from "../../components/DashboardPieChart";
import StatCard from "../../components/StatsCards";
import OrdersTable from "../../components/OrdersTable";
import DashboardLineChart from "../../components/DashboardLineChart";

export default function AdminDashboard() {

  // baad me API se replace hoga
const dashboardStats = {
  users: 40,
  vendors: 25,
  meals: 30,
  items: 50,
  orders: 60,
  revenue: 10000,
};
const pieData = [
  { name: "Users", value: dashboardStats.users },
  { name: "Vendors", value: dashboardStats.vendors },
  { name: "Meals", value: dashboardStats.meals },
  { name: "Items", value: dashboardStats.items },
  { name: "Orders", value: dashboardStats.orders },
];

const lineData = [
  { name: "Mon", value: 10 },
  { name: "Tue", value: 20 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 30 },
  { name: "Fri", value: 25 },
  { name: "Sat", value: 40 },
  { name: "Sun", value: 35 },
];
  const recentOrders = [];

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5">

        <StatCard
          title="Total Users"
          value={dashboardStats.users}
          growth="0%"
          Icon={FiUsers}
        />

        <StatCard
          title="Total Vendors"
          value={dashboardStats.vendors}
          growth="0%"
          Icon={FiShoppingBag}
        />

        <StatCard
          title="Total Meals"
          value={dashboardStats.meals}
          growth="0%"
          Icon={MdRestaurantMenu}
        />

        <StatCard
          title="Total Items"
          value={dashboardStats.items}
          growth="0%"
          Icon={MdFastfood}
        />

        <StatCard
          title="Total Orders"
          value={dashboardStats.orders}
          growth="0%"
          Icon={FiShoppingCart}
        />

        <StatCard
          title="Revenue"
          value={`₹${dashboardStats.revenue}`}
          growth="0%"
          Icon={FaRupeeSign}
        />

      </div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  <DashboardPieChart
    data={pieData}
    title="Platform Overview"
  />

  <DashboardLineChart
    data={lineData}
    title="Orders Trend"
  />

</div>
      <OrdersTable orders={recentOrders} />

    </div>
  );
}