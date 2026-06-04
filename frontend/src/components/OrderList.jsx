import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const OrderList = () => {
  const [orders] = useState([
    {
      _id: "1",
      orderId: "ORD001",
      user: "Rahul Sharma",
      vendor: "Fresh Tiffin",
      orderDate: "03 Jun 2026",
    },
    {
      _id: "2",
      orderId: "ORD002",
      user: "Priya Verma",
      vendor: "Healthy Meals",
      orderDate: "02 Jun 2026",
    },
    {
      _id: "3",
      orderId: "ORD003",
      user: "Amit Singh",
      vendor: "Tasty Tiffin",
      orderDate: "01 Jun 2026",
    },
  ]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-2xl font-semibold mb-5">Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3">Order ID</th>
                <th className="py-3">User</th>
                <th className="py-3">Vendor</th>
                <th className="py-3">Order Date</th>
                <th className="py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-4">{order.orderId}</td>
                  <td>{order.user}</td>
                  <td>{order.vendor}</td>
                  <td>{order.orderDate}</td>

                  <td>
                    <div className="flex justify-center gap-3">
                      <button>
                        <FiEye className="text-gray-500 text-lg" />
                      </button>

                      <button>
                        <MdDeleteOutline className="text-red-500 text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-center py-5 text-gray-500">No Orders Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
