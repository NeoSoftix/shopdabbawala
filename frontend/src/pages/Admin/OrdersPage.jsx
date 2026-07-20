import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  FaClipboardList,
  FaClock,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

import StatCard from "../../components/shared/StatCard";
import OrdersTable from "../../components/shared/OrdersTable";
import { SectionLoader } from "../../components/shared/Loader";
import Pagination from "../../components/shared/Pagination";
import {
  getOrderStats,
  getAllOrders,
  acceptOrder,
  rejectOrder,
} from "../../services/order.service";
import { toast } from "react-hot-toast";

export default function OrdersPage() {
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    byStatus: {},
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchOrderStats();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchOrders();
  }, [search, page]);

  const fetchOrderStats = async () => {
    try {
      const res = await getOrderStats();
      if (res.success) {
        setOrderStats(res.stats);
      }
    } catch (error) {
      console.error("Order Stats Error:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(search, page);
      if (res.success) {
        setOrders(res.orders || []);
        setPagination({
          currentPage: res.currentPage,
          totalPages: res.totalPages,
          totalOrders: res.totalOrders,
        });
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Failed to load orders list");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const res = await acceptOrder(orderId);
      if (res.success) {
        toast.success("Order accepted - vendor has been notified");
        fetchOrders();
        fetchOrderStats();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept order");
    }
  };

  const handleReject = async (orderId) => {
    try {
      const res = await rejectOrder(orderId);
      if (res.success) {
        toast.success("Order rejected");
        fetchOrders();
        fetchOrderStats();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject order");
    }
  };

  const processingOrders =
    (orderStats.byStatus?.Accepted || 0) + (orderStats.byStatus?.["On the way"] || 0);

  const stats = [
    {
      title: "Total Orders",
      value: orderStats.totalOrders || 0,
      growth: "0%",
      Icon: FaClipboardList,
    },
    {
      title: "Awaiting Approval",
      value: orderStats.byStatus?.Pending || 0,
      growth: "0%",
      Icon: FaClock,
    },
    {
      title: "Processing Orders",
      value: processingOrders,
      growth: "0%",
      Icon: FaTruck,
    },
    {
      title: "Delivered Orders",
      value: orderStats.byStatus?.Delivered || 0,
      growth: "0%",
      Icon: FaCheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="relative w-full md:w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search by customer or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <SectionLoader text="Loading orders..." />
      ) : (
        <>
          <OrdersTable
            orders={orders}
            onAccept={handleAccept}
            onReject={handleReject}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
