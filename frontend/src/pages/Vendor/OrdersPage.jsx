import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaClock,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

import StatCard from "../../components/shared/StatCard";
// import NotificationFilters from "../../components/vendor/NotificationFilters";
import OrdersTable from "../../components/shared/OrdersTable";
import { SectionLoader } from "../../components/shared/Loader";
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
    fetchOrders();
  }, [page]);

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
      const res = await getAllOrders("", page);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const res = await acceptOrder(orderId);
      if (res.success) {
        toast.success("Order accepted");
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
    (orderStats.byStatus?.Preparing || 0) + (orderStats.byStatus?.["On the way"] || 0);

  const stats = [
    {
      title: "Total Orders",
      value: orderStats.totalOrders || 0,
      growth: "0%",
      Icon: FaClipboardList,
    },
    {
      title: "Pending Orders",
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
      <h1 className="text-3xl font-bold">Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      {/* Filters
      <NotificationFilters /> */}

      {/* Orders Table */}
      {loading ? (
        <SectionLoader text="Loading orders..." />
      ) : (
        <>
          <OrdersTable orders={orders} onAccept={handleAccept} onReject={handleReject} />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
