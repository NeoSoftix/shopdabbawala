import {
  FaClipboardList,
  FaClock,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

import StatCard from "../../components/shared/StatCard";
import NotificationFilters from "../../components/vendor/NotificationFilters";
import OrdersTable from "../../components/shared/OrdersTable";

export default function OrdersPage() {
  const stats = [
    {
      title: "Total Orders",
      value: 120,
      growth: "+12%",
      Icon: FaClipboardList,
    },
    {
      title: "Pending Orders",
      value: 25,
      growth: "+5%",
      Icon: FaClock,
    },
    {
      title: "Processing Orders",
      value: 18,
      growth: "+3%",
      Icon: FaTruck,
    },
    {
      title: "Delivered Orders",
      value: 77,
      growth: "+15%",
      Icon: FaCheckCircle,
    },
  ];

  const orders = [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      {/* Filters */}
      <NotificationFilters />

      {/* Orders Table */}
      <OrdersTable orders={orders} />
    </div>
  );
}
