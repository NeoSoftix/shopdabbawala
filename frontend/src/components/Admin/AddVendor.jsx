import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVendor } from "../../service/vendor.service.js";

const AddVendor = () => {
const navigate = useNavigate();

const [image, setImage] = useState(null);

const [formData, setFormData] = useState({
name: "",
email: "",
phone: "",
organizationName: "",
address: "",
city: "",
state: "",
pincode: "",
description: "",
});

const [preview, setPreview] = useState(
"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
);

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData((prev) => ({
...prev,
[e.target.name]: e.target.value,
}));
};

const handleImageChange = (e) => {
const file = e.target.files[0];

```
if (file) {
  setImage(file);
  setPreview(URL.createObjectURL(file));
}
```

};

const handleSubmit = async (e) => {
e.preventDefault();

```
try {
  setLoading(true);

  const data = new FormData();

  data.append("name", formData.name);
  data.append("email", formData.email);
  data.append("phone", formData.phone);
  data.append(
    "organizationName",
    formData.organizationName
  );
  data.append("address", formData.address);
  data.append("city", formData.city);
  data.append("state", formData.state);
  data.append("pincode", formData.pincode);
  data.append(
    "description",
    formData.description
  );

  if (image) {
    data.append("logo", image);
  }

  const response = await createVendor(data);

  alert(
    response?.message ||
      "Vendor Added Successfully"
  );

  navigate("/admin/vendors");
} catch (error) {
  console.log(error);

  alert(
    error?.response?.data?.message ||
      "Failed to create vendor"
  );
} finally {
  setLoading(false);
}
```

};

return ( <div className="min-h-screen bg-gray-50 p-6"> <div className="mb-8 flex items-center justify-between"> <div> <h1 className="text-3xl font-bold text-slate-900">
Add Vendor </h1>

```
      <p className="text-gray-500">
        Create a new vendor account
      </p>
    </div>

    <button
      onClick={() =>
        navigate("/admin/vendors")
      }
      className="rounded-xl bg-[#e61e2d] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
    >
      ← Back to Vendors
    </button>
  </div>

  <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
    {/* Image Upload */}
    <div className="mb-8 flex flex-col items-center">
      <img
        src={preview}
        alt="Vendor"
        className="h-28 w-28 rounded-full border-4 border-[#e61e2d]/20 object-cover"
      />

      <label className="mt-4 cursor-pointer rounded-lg bg-[#e61e2d] px-5 py-2 text-sm font-medium text-white hover:bg-red-700">
        Upload Logo

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
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
          required
        />
      </div>

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
          required
        />
      </div>

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
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Organization Name
        </label>

        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          placeholder="Enter organization name"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            City
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            State
          </label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Pincode
        </label>

        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Address
        </label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          placeholder="Enter address"
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter description"
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#e61e2d] py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading
          ? "Creating Vendor..."
          : "Add Vendor"}
      </button>
    </form>
  </div>
</div>


);
};

export default AddVendor;
