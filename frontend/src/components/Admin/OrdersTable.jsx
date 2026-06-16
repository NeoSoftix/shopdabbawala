export default function OrdersTable({
  orders = [],
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-xl">
          Recent Orders
        </h2>

        <button className="text-[#E23747] font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-4">Order ID</th>
              <th className="pb-4">User</th>
              <th className="pb-4">Vendor</th>
              <th className="pb-4">Items</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Payment</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b"
              >
                <td className="py-4">
                  {order.orderId}
                </td>

                <td>{order.user}</td>

                <td>{order.vendor}</td>

                <td>{order.items}</td>

                <td>{order.amount}</td>

                <td>{order.payment}</td>

                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}