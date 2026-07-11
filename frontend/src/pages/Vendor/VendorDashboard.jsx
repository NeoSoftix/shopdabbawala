import { useEffect, useState } from "react";
import StatCard from "../../components/shared/StatCard";
// import OrderBanner from "../../components/shared/OrderBanner";
import OrdersTable from "../../components/shared/OrdersTable";
import OrdersCalendar from "../../components/shared/OrdersCalendar";

import {
  MdShoppingCart,
  MdPendingActions,
  MdCheckCircle,
} from "react-icons/md";

import { FaDollarSign } from "react-icons/fa";

import { getOrderStats, getAllOrders } from "../../services/order.service";

export default function VendorDashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchOrderStats();
    fetchRecentOrders();
  }, []);

  const fetchOrderStats = async () => {
    try {
      const res = await getOrderStats();
      if (res.success) {
        setTotalOrders(res.stats.totalOrders || 0);
        setPendingOrders(res.stats.byStatus?.Pending || 0);
        setCompletedOrders(res.stats.byStatus?.Delivered || 0);
      }
    } catch (error) {
      console.error("Order Stats Error:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await getAllOrders();
      if (res.success) {
        setRecentOrders((res.orders || []).slice(0, 5));
      }
    } catch (error) {
      console.error("Recent Orders Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          growth="0%"
          Icon={MdShoppingCart}
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          growth="0%"
          Icon={MdPendingActions}
        />

        <StatCard
          title="Completed Orders"
          value={completedOrders}
          growth="0%"
          Icon={MdCheckCircle}
        />

        <StatCard
          title="Earnings"
          value="$42,500"
          growth="15% increase"
          Icon={FaDollarSign}
        />
      </div>

      {/* <OrderBanner totalOrders={totalOrders} pendingOrders={pendingOrders} /> */}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Delivery Schedule</h2>
        <OrdersCalendar />
      </div>

    </div>
  );
}
