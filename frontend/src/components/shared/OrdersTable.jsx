import { useState } from "react";
import { FiEye } from "react-icons/fi";
import OrderDetailsModal from "./OrderDetailsModal";
import { ORDER_STATUS_STYLES as statusStyles } from "../../constants/orderStatus";

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
  const showActions = Boolean(onAccept || onReject || onReadyToDeliver || onMarkDelivered);
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-gray-50 flex items-center justify-between">
        <h2 className="font-bold text-gray-800 text-base sm:text-lg">
          Recent Orders
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-4">Order ID</th>
              <th className="py-2.5 px-4">Customer</th>
              <th className="py-2.5 px-4">Order Date</th>
              <th className="py-2.5 px-4">Delivery Date</th>
              <th className="py-2.5 px-4">Delivery</th>
              <th className="py-2.5 px-4">Status</th>
              {showActions && <th className="py-2.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                <td className="py-2.5 px-4 text-sm font-medium text-gray-800" title={order._id}>
                  #{order._id.slice(-6).toUpperCase()}
                </td>

                <td className="py-2.5 px-4 text-sm text-gray-600">
                  {order.user?.name || <span className="text-gray-400 italic">Not set</span>}
                </td>

                <td className="py-2.5 px-4 text-sm text-gray-600">{formatDate(order.orderDate)}</td>

                <td className="py-2.5 px-4 text-sm font-medium text-gray-800">
                  {order.date ? formatDate(order.date) : <span className="text-gray-400 italic">Not set</span>}
                </td>

                <td className="py-2.5 px-4 text-sm text-gray-600">{order.deliveryMethod}</td>

                <td className="py-2.5 px-4">
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
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        title="View order details"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                      >
                        <FiEye size={18} />
                      </button>
                    </div>
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
