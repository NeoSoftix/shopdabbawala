import StatCard from "../../components/Admin/StatsCards";
import OrderBanner from "../../components/OrderBanner";
import OrdersTable from "../../components/Admin/OrdersTable";

import {
  MdShoppingCart,
  MdPendingActions,
  MdCheckCircle,
} from "react-icons/md";

import { FaRupeeSign } from "react-icons/fa";

export default function VendorDashboard() {
  const orders = [
    {
      _id: 1,
      orderId: "#1001",
      user: "Rahul",
      vendor: "Vendor 1",
      items: 3,
      amount: "₹250",
      payment: "Paid",
      status: "Pending",
    },
    {
      _id: 2,
      orderId: "#1002",
      user: "Aman",
      vendor: "Vendor 1",
      items: 2,
      amount: "₹180",
      payment: "Paid",
      status: "Accepted",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value="156"
          growth="12% this month"
          Icon={MdShoppingCart}
        />

        <StatCard
          title="Pending Orders"
          value="18"
          growth="5 new today"
          Icon={MdPendingActions}
        />

        <StatCard
          title="Completed Orders"
          value="138"
          growth="9% increase"
          Icon={MdCheckCircle}
        />

        <StatCard
          title="Earnings"
          value="₹42,500"
          growth="15% increase"
          Icon={FaRupeeSign}
        />
      </div>

      <OrderBanner
        totalOrders={156}
        pendingOrders={18}
      />

      <OrdersTable orders={orders} />
    </div>
  );
}