import { useEffect, useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getAllOrders } from "../../services/order.service";
import { SectionLoader } from "./Loader";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-600",
  Accepted: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-600",
  Preparing: "bg-indigo-50 text-indigo-600",
  "On the way": "bg-blue-50 text-blue-600",
  Delivered: "bg-green-50 text-green-600",
  Cancelled: "bg-slate-100 text-slate-500",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async (searchVal = "") => {
    try {
      setLoading(true);
      const res = await getAllOrders(searchVal);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Failed to load orders list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(search);
  }, [search]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>

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
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <SectionLoader text="Loading orders..." />
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-sm font-medium">
                    <th className="text-left py-3 font-semibold">Order ID</th>
                    <th className="text-left py-3 font-semibold">Customer</th>
                    <th className="text-left py-3 font-semibold">Items</th>
                    <th className="text-left py-3 font-semibold">Order Date</th>
                    <th className="text-left py-3 font-semibold">Delivery</th>
                    <th className="text-center py-3 font-semibold">Status</th>
                    <th className="text-center py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-sm font-medium text-gray-800" title={order._id}>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-4 text-sm text-gray-600">
                        {order.user?.name || <span className="text-gray-400 italic">Not set</span>}
                      </td>

                      <td className="py-4 text-sm text-gray-600 max-w-xs truncate">
                        {order.items?.length
                          ? order.items.map((it) => `${it.name} x${it.qty}`).join(", ")
                          : <span className="text-gray-400 italic">No items</span>}
                      </td>

                      <td className="py-4 text-sm text-gray-600">{formatDate(order.orderDate)}</td>

                      <td className="py-4 text-sm text-gray-600">{order.deliveryMethod}</td>

                      <td className="py-4">
                        <div className="flex justify-center">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              statusStyles[order.status] || "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="flex justify-center gap-4">
                          <button title="View Order" className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <FiEye className="text-gray-500 text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-base">No Orders Found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
