import React from "react";
import { useNavigate } from "react-router-dom";

const VendorList = () => {
  const navigate = useNavigate();

  const vendors = [
    {
      id: 1,
      name: "Vendor 1",
      email: "vendor1@gmail.com",
      phone: "+91 9876543210",
      address: "Phase 8, Mohali, Punjab",
      image: "https://i.pravatar.cc/150?img=1",
      status: "Active",
    },
    {
      id: 2,
      name: "Vendor 2",
      email: "vendor2@gmail.com",
      phone: "+91 9876543211",
      address: "Sector 22, Chandigarh",
      image: "https://i.pravatar.cc/150?img=2",
      status: "Active",
    },
    {
      id: 3,
      name: "Vendor 3",
      email: "vendor3@gmail.com",
      phone: "+91 9876543212",
      address: "Raj Nagar, Ghaziabad, Uttar Pradesh",
      image: "https://i.pravatar.cc/150?img=3",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Vendor 4",
      email: "vendor4@gmail.com",
      phone: "+91 9876543213",
      address: "DLF Cyber City, Gurugram, Haryana",
      image: "https://i.pravatar.cc/150?img=4",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e61e2d]">
            Vendor Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage all vendors
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/vendors/add")}
          className="rounded-lg bg-[#e61e2d] px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + Add Vendor
        </button>
      </div>

      {/* Vendor Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            {/* Top Section */}
            <div className="flex items-center gap-3">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="h-12 w-12 rounded-full border-2 border-[#e61e2d]/20 object-cover"
              />

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-gray-800">
                  {vendor.name}
                </h2>

                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    vendor.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {vendor.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="mt-3 border-t pt-3 space-y-2">
              <div>
                <p className="text-[10px] uppercase text-gray-400">
                  Email
                </p>
                <p className="truncate text-xs text-gray-700">
                  {vendor.email}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-gray-400">
                  Phone
                </p>
                <p className="text-xs text-gray-700">
                  {vendor.phone}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-gray-400">
                  Address
                </p>
                <p className="text-xs text-gray-700">
                  {vendor.address}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-md bg-[#e61e2d] py-2 text-xs font-medium text-white hover:bg-red-700">
                View
              </button>

              <button className="flex-1 rounded-md border border-[#e61e2d] py-2 text-xs font-medium text-[#e61e2d] hover:bg-red-50">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;