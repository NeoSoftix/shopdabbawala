import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddVendor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ...formData,
      image: preview,
    });

    alert("Vendor Added Successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Add Vendor
          </h1>
          <p className="text-gray-500">
            Create a new vendor account
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/vendors")}
          className="rounded-xl bg-[#e61e2d] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          ← Back to Vendors
        </button>
      </div>

      {/* Form Card */}
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Image Upload */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src={preview}
            alt="Vendor"
            className="h-28 w-28 rounded-full border-4 border-[#e61e2d]/20 object-cover"
          />

          <label className="mt-4 cursor-pointer rounded-lg bg-[#e61e2d] px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vendor Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Vendor Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter vendor name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              placeholder="Enter vendor address"
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#e61e2d] py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Add Vendor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;