import { useEffect, useState } from "react";
import { FiUsers, FiShoppingBag, FiShoppingCart } from "react-icons/fi";

import { MdRestaurantMenu, MdFastfood } from "react-icons/md";

import { FaRupeeSign } from "react-icons/fa";

import DashboardPieChart from "../../components/shared/DashboardPieChart";
import DashboardLineChart from "../../components/shared/DashboardLineChart";
import OrdersCalendar from "../../components/shared/OrdersCalendar";
import StatCard from "../../components/shared/StatCard";

import { getAllVendors } from "../../services/vendor.service";
import { getAllMeals } from "../../services/meal.service";
import { getAllItems } from "../../services/items.service";
import { getCustomerStats } from "../../services/customer.service";

export default function AdminDashboard() {
  const [vendorCount, setVendorCount] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    fetchVendorCount();
    fetchMealCount();
    fetchItemCount();
    fetchCustomerCount();
  }, []);

  const fetchCustomerCount = async () => {
    try {
      const res = await getCustomerStats();
      console.log("Customer Stats Response:", res);
      if (res.success) {
        setCustomerCount(res.stats.totalCustomers || 0);
      }
    } catch (error) {
      console.error("Customer Count Error:", error);
    }
  };

  const fetchVendorCount = async () => {
    try {
      const res = await getAllVendors();

      console.log("Vendor Response:", res);

      if (res.success) {
        setVendorCount(res.count);
      }
    } catch (error) {
      console.error("Vendor Count Error:", error);
    }
  };

  const fetchMealCount = async () => {
    try {
      const res = await getAllMeals();

      console.log("Meals Response:", res);

      if (res.success) {
        setMealCount(res.count || 0);
      }
    } catch (error) {
      console.error("Meal Count Error:", error);
    }
  };

  const fetchItemCount = async () => {
    try {
      const res = await getAllItems();

      console.log("Items Response:", res);

      if (res.success) {
        setItemCount(res.count || 0);
      }
    } catch (error) {
      console.error("Item Count Error:", error);
    }
  };
  const dashboardStats = {
    users: customerCount,
    vendors: vendorCount,
    meals: mealCount,
    items: itemCount,
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
 <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Delivery Schedule</h2>
        <OrdersCalendar />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardPieChart data={pieData} title="Platform Overview" />
        <DashboardLineChart data={lineData} title="Orders Trend" />
      </div>

     

    </div>
  );
}
