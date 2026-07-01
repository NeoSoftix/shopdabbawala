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
  const [fetchingLocation, setFetchingLocation] = useState(false); // लोकेशन फैचिंग स्टेट
  const [areas, setAreas] = useState([]); // पिनकोड के सभी इलाकों को स्टोर करने के लिए स्टेट

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // पिनकोड चेंज होने पर काम करने वाला फंक्शन
  const handlePincodeChange = async (e) => {
    const pincodeVal = e.target.value;
    
    // सिर्फ नंबर्स एलाओ करने के लिए
    if (/[^0-9]/.test(pincodeVal)) return;

    setFormData((prev) => ({ 
      ...prev, 
      pincode: pincodeVal,
      city: "",  // पुराना डेटा क्लियर करने के लिए
      state: "" 
    }));
    setAreas([]); // पुराना एरिया लिस्ट क्लियर करें

    // जैसे ही पिनकोड 6 डिजिट का होगा, API कॉल होगी
    if (pincodeVal.length === 6) {
      try {
        setFetchingLocation(true);
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincodeVal}`);
        const data = await res.json();

        if (data[0].Status === "Success") {
          const postOffices = data[0].PostOffice;
          setAreas(postOffices); // सारे इलाकों की लिस्ट सेट करें
          
          // डिफ़ॉल्ट रूप से पहले वाले पोस्ट ऑफिस के आधार पर City/State सेट करें
          setFormData((prev) => ({
            ...prev,
            city: postOffices[0].District,
            state: postOffices[0].State,
            address: postOffices[0].Name + ", " // शुरुआत में पहला एरिया एड्रेस में डाल सकते हैं
          }));
        } else {
          alert("Invalid Pincode. Please check again.");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setFetchingLocation(false);
      }
    }
  };

  // जब यूज़र ड्रॉपडाउन से कोई खास एरिया चुनेगा
  const handleAreaChange = (e) => {
    const selectedAreaName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      address: selectedAreaName + ", "
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("organizationName", formData.organizationName);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("pincode", formData.pincode);
      data.append("description", formData.description);

      if (image) {
        data.append("logo", image);
      }

      const response = await createVendor(data);

      alert(response?.message || "Vendor Added Successfully");
      navigate("/admin/vendors");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add Vendor</h1>
          <p className="text-gray-500">Create a new vendor account</p>
        </div>

        <button
          onClick={() => navigate("/admin/vendors")}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vendor Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Vendor Name</label>
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

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
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
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
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
          </div>

          {/* Organization Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Organization Name</label>
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

          {/* Pincode Input (इसे ऊपर कर दिया ताकि फ्लो सही रहे) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Pincode {fetchingLocation && <span className="text-xs text-[#e61e2d] animate-pulse">(Fetching Areas...)</span>}
            </label>
            <input
              type="text"
              name="pincode"
              maxLength={6}
              value={formData.pincode}
              onChange={handlePincodeChange}
              placeholder="Enter 6-digit pincode"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
              required
            />
          </div>

          {/* Specific Area Select Dropdown (बिना Sub Post Office शब्द के) */}
          {areas.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Select Specific Area</label>
              <select
                onChange={handleAreaChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none bg-white"
                required
              >
                {areas.map((area, index) => (
                  <option key={index} value={area.Name}>
                    {area.Name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* City and State (यूज़र इन्हें डायरेक्ट एडिट न करे इसलिए readOnly किया है) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">City / District</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City will auto-fill"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 focus:outline-none"
                readOnly
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State will auto-fill"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 focus:outline-none"
                readOnly
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Detailed Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Flat no, Building, Street name..."
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
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
            disabled={loading || fetchingLocation}
            className="w-full rounded-xl bg-[#e61e2d] py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Creating Vendor..." : "Add Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;