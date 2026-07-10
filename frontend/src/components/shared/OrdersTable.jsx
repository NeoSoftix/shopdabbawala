import { useState } from "react";
import { FiEye } from "react-icons/fi";
import OrderDetailsModal from "./OrderDetailsModal";

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

export default function OrdersTable({
  orders = [],
  onAccept,
  onReject,
  onReadyToDeliver,
  onMarkDelivered,
}) {
  const showActions = Boolean(onAccept || onReject);
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-xl">
          Recent Orders
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-4">Order ID</th>
              <th className="pb-4">Customer</th>
              <th className="pb-4">Order Date</th>
              <th className="pb-4">Delivery</th>
              <th className="pb-4">Status</th>
              {showActions && <th className="pb-4">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b"
              >
                <td className="py-4" title={order._id}>
                  #{order._id.slice(-6).toUpperCase()}
                </td>

                <td>{order.user?.name || <span className="text-gray-400 italic">Not set</span>}</td>

                <td>{formatDate(order.orderDate)}</td>

                <td>{order.deliveryMethod}</td>

                <td>
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        statusStyles[order.status] || "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.active === false && (
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-600 text-white uppercase tracking-wide whitespace-nowrap">
                        Inactive by user
                      </span>
                    )}
                  </div>
                </td>

                {showActions && (
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      title="View order details"
                      className="text-gray-400 hover:text-[#E23747] transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-base">No Orders Found</p>
          </div>
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAccept={onAccept}
        onReject={onReject}
        onReadyToDeliver={onReadyToDeliver}
        onMarkDelivered={onMarkDelivered}
      />
    </div>
  );
}
