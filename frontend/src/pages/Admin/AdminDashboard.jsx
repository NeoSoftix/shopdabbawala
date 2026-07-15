import { useEffect, useMemo, useState } from "react";
import { FiUsers, FiShoppingBag, FiShoppingCart } from "react-icons/fi";

import { MdFastfood } from "react-icons/md";

import { FaDollarSign } from "react-icons/fa";

import DashboardPieChart from "../../components/shared/DashboardPieChart";
import DashboardLineChart from "../../components/shared/DashboardLineChart";
import OrdersCalendar from "../../components/shared/OrdersCalendar";
import StatCard from "../../components/shared/StatCard";

import { getAllVendors } from "../../services/vendor.service";
import { getAllItems } from "../../services/items.service";
import { getCustomerStats } from "../../services/customer.service";
import { getOrderStats } from "../../services/order.service";

const lineData = [
  { name: "Mon", value: 10 },
  { name: "Tue", value: 20 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 30 },
  { name: "Fri", value: 25 },
  { name: "Sat", value: 40 },
  { name: "Sun", value: 35 },
];

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    users: 0,
    vendors: 0,
    items: 0,
    orders: 0,
    revenue: 10000,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      const [customerRes, vendorRes, itemRes, orderRes] = await Promise.all([
        getCustomerStats().catch((error) => {
          console.error("Customer Count Error:", error);
          return null;
        }),
        getAllVendors().catch((error) => {
          console.error("Vendor Count Error:", error);
          return null;
        }),
        getAllItems().catch((error) => {
          console.error("Item Count Error:", error);
          return null;
        }),
        getOrderStats().catch((error) => {
          console.error("Order Count Error:", error);
          return null;
        }),
      ]);

      if (cancelled) return;

      setDashboardStats((prev) => ({
        ...prev,
        users: customerRes?.success ? customerRes.stats.totalCustomers || 0 : prev.users,
        vendors: vendorRes?.success ? vendorRes.count || 0 : prev.vendors,
        items: itemRes?.success ? itemRes.count || 0 : prev.items,
        orders: orderRes?.success ? orderRes.stats.totalOrders || 0 : prev.orders,
      }));
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const pieData = useMemo(
    () => [
      { name: "Users", value: dashboardStats.users },
      { name: "Vendors", value: dashboardStats.vendors },
      { name: "Items", value: dashboardStats.items },
      { name: "Orders", value: dashboardStats.orders },
    ],
    [dashboardStats.users, dashboardStats.vendors, dashboardStats.items, dashboardStats.orders],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
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
          value={`$${dashboardStats.revenue}`}
          growth="0%"
          Icon={FaDollarSign}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Delivery Schedule</h2>
        <OrdersCalendar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardPieChart data={pieData} title="Platform Overview" />
        <DashboardLineChart data={lineData} title="Orders Trend" />
      </div>
    </div>
  );
}
