import React, { useState } from "react";
import {
  FaBoxOpen,
  FaClock,
  FaDollarSign,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const PackagesPage = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const stats = [
    {
      title: "Total Packages",
      value: 12,
      icon: <FaBoxOpen />,
      color: "red",
    },
    {
      title: "Active Packages",
      value: 10,
      icon: <FaPlus />,
      color: "green",
    },
    {
      title: "Average Price",
      value: "$120.50",
      icon: <FaDollarSign />,
      color: "orange",
    },
    {
      title: "Expiring Soon",
      value: 2,
      sub: "Within 7 days",
      icon: <FaClock />,
      color: "purple",
    },
  ];

  const packages = [
    {
      name: "Basic Plan",
      price: "$99.00",
      meals: "15 Meals",
      validity: "15 Days",
      desc: "Perfect for students and individuals.",
      status: "Active",
    },
    {
      name: "Standard Plan",
      price: "$149.00",
      meals: "30 Meals",
      validity: "30 Days",
      desc: "Balanced meals for healthy life.",
      status: "Active",
    },
    {
      name: "Premium Plan",
      price: "$199.00",
      meals: "45 Meals",
      validity: "45 Days",
      desc: "Best for fitness enthusiasts.",
      status: "Active",
    },
    {
      name: "Weight Gain Plan",
      price: "$179.00",
      meals: "30 Meals",
      validity: "30 Days",
      desc: "High calorie diet plan.",
      status: "Active",
    },
    {
      name: "Weight Loss Plan",
      price: "$129.00",
      meals: "30 Meals",
      validity: "30 Days",
      desc: "Low calorie diet plan.",
      status: "Inactive",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold">Packages</h1>
          <p className="text-sm text-gray-500">Dashboard / Packages</p>
        </div>

        <button
          onClick={toggleForm}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> {showForm ? "Close Form" : "Add Package"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{s.title}</p>
              <h2 className="text-xl font-bold">{s.value}</h2>
              {s.sub && <p className="text-xs text-gray-400">{s.sub}</p>}
            </div>
            <div className="text-2xl text-red-500">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">All Packages</h2>
            <input
              placeholder="Search packages..."
              className="border px-3 py-2 rounded-lg w-1/2"
            />
          </div>

          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th>#</th>
                <th>Package</th>
                <th>Price</th>
                <th>Meals</th>
                <th>Validity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {packages.map((p, i) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.meals}</td>
                  <td>{p.validity}</td>
                  <td className="text-gray-500">{p.desc}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        p.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="flex gap-2 text-red-500">
                    <FaEdit className="cursor-pointer" />
                    <FaTrash className="cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT FORM */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-4">Add / Edit Package</h2>

            <div className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Package Name" />
              <input className="w-full border p-2 rounded" placeholder="Price" />
              <input className="w-full border p-2 rounded" placeholder="Total Meals" />
              <input className="w-full border p-2 rounded" placeholder="Validity (Days)" />
              <textarea className="w-full border p-2 rounded" placeholder="Description"></textarea>

              <select className="w-full border p-2 rounded">
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <button className="w-full bg-red-600 text-white py-2 rounded">
                Save Package
              </button>

              <p className="text-xs text-gray-400 mt-2">
                Packages will be visible after saving.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;