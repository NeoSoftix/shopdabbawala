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
import Pagination from "../../components/shared/Pagination";
import {
  getOrderStats,
  getAllOrders,
  getOrdersByDate,
  markOrderReadyToDeliver,
  markOrderDelivered,
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
  const [dateFilter, setDateFilter] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, dateFilter]);

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

      // Delivery-date filter active - use the by-date endpoint (already
      // vendor-scoped server-side) instead of the paginated all-orders list.
      if (dateFilter) {
        const res = await getOrdersByDate(dateFilter);
        if (res.success) {
          setOrders(res.orders || []);
          setPagination({ currentPage: 1, totalPages: 1, totalOrders: res.count || 0 });
        }
        return;
      }

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

  const handleReadyToDeliver = async (orderId) => {
    try {
      const res = await markOrderReadyToDeliver(orderId);
      if (res.success) {
        toast.success("Order marked as ready to deliver");
        fetchOrders();
        fetchOrderStats();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order");
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const res = await markOrderDelivered(orderId);
      if (res.success) {
        toast.success("Order marked as delivered");
        fetchOrders();
        fetchOrderStats();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order");
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
      title: "Awaiting Admin Approval",
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

      {/* Delivery date filter */}
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="vendor-orders-date" className="text-sm font-medium text-gray-600">
          Delivery Date
        </label>
        <input
          id="vendor-orders-date"
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setPage(1);
            setDateFilter(e.target.value);
          }}
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        />
        {dateFilter && (
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setDateFilter("");
            }}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Show all orders
          </button>
        )}
      </div>

      {/* Filters
      <NotificationFilters /> */}

      {/* Orders Table */}
      {loading ? (
        <SectionLoader text="Loading orders..." />
      ) : (
        <>
          <OrdersTable
            orders={orders}
            onReadyToDeliver={handleReadyToDeliver}
            onMarkDelivered={handleMarkDelivered}
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
