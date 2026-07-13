import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { createVendor } from "../../services/vendor.service.js";
import { getActivePackages } from "../../services/package.service.js";
import { toast } from "react-hot-toast";
import { ButtonSpinner } from "../shared/Loader";

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
    package: "",
    isCustomPackageVendor: false,
  });

  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  );

  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [areas, setAreas] = useState([]);
  const [errors, setErrors] = useState({});

  // Package this vendor will exclusively serve. Delivery pincodes for the
  // package are assigned afterwards from the Assign Vendor page.
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getActivePackages();
        if (res.success) setPackages(res.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages.");
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  // Toggling "custom package vendor" clears the fixed package selection —
  // a vendor either serves one fixed package or exclusively serves custom
  // ("Build Your Own Package") orders, never both.
  const handleCustomToggle = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      isCustomPackageVendor: checked,
      package: checked ? "" : prev.package,
    }));
    if (errors.package) setErrors((p) => ({ ...p, package: "" }));
  };

  // Pincode (6-character alphanumeric) चेंज होने पर काम करने वाला फंक्शन
  const handlePincodeChange = async (e) => {
    // सिर्फ लेटर्स और नंबर्स एलाओ करने के लिए, बाकी हटाकर अपरकेस में
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

    setFormData((prev) => ({
      ...prev,
      pincode: raw,
      city: "", // पुराना डेटा क्लियर करने के लिए
      state: "",
    }));
    setAreas([]); // पुराना एरिया लिस्ट क्लियर करें

    // जैसे ही पहले 6 कैरेक्टर पूरे होंगे, API कॉल होगी (FSA = पहले 3 कैरेक्टर)
    if (raw.length === 6) {
      const fsa = raw.slice(0, 3);
      try {
        setFetchingLocation(true);
        const res = await fetch(`https://api.zippopotam.us/ca/${fsa}`);
        if (!res.ok) throw new Error("Invalid postal code");
        const data = await res.json();
        const places = data.places || [];

        if (places.length > 0) {
          setAreas(places); // सारे इलाकों की लिस्ट सेट करें

          // डिफ़ॉल्ट रूप से पहले वाले इलाके के आधार पर City/State सेट करें
          setFormData((prev) => ({
            ...prev,
            city: places[0]["place name"],
            state: places[0]["state"],
            address: places[0]["place name"] + ", ",
          }));
        }
        // No match (e.g. non-Canadian pincode) — leave City/Province blank
        // for the admin to fill in manually below.
      } catch (error) {
        console.error("Error fetching location:", error);
        // Lookup only supports Canadian FSAs — fall through to manual entry.
      } finally {
        setFetchingLocation(false);
      }
    }
  };

  // जब यूज़र ड्रॉपडाउन से कोई खास एरिया चुनेगा
  const handleAreaChange = (e) => {
    const selectedIndex = Number(e.target.value);
    const selectedArea = areas[selectedIndex];
    if (!selectedArea) return;
    setFormData((prev) => ({
      ...prev,
      city: selectedArea["place name"],
      state: selectedArea["state"],
      address: selectedArea["place name"] + ", ",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Field-level validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vendor name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!formData.organizationName.trim()) newErrors.organizationName = "Organization name is required.";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required.";
    else if (!/^[A-Za-z0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-character pincode.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "Province/State is required.";
    if (!formData.address.trim()) newErrors.address = "Detailed address is required.";
    if (!formData.isCustomPackageVendor && !formData.package)
      newErrors.package = "Please select a package for this vendor.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the highlighted errors before submitting.");
      return;
    }

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
      data.append("isCustomPackageVendor", formData.isCustomPackageVendor);
      if (!formData.isCustomPackageVendor) data.append("package", formData.package);
      if (image) data.append("logo", image);

      const response = await createVendor(data);
      toast.success(response?.message || "Vendor Added Successfully!");
      navigate("/admin/vendors");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create vendor.");
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
          className="rounded-xl bg-[#e61e2d] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Vendors
        </button>
      </div>

      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Image Upload */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src={preview}
            alt="Vendor"
            className="h-28 w-28 rounded-full border-4 border-[#e61e2d]/20 object-cover"
            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; e.target.onerror = null; }}
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
              className={`w-full rounded-xl border px-4 py-3 focus:border-[#e61e2d] focus:outline-none ${errors.name ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Enter email"
                className={`w-full rounded-xl border px-4 py-3 focus:border-[#e61e2d] focus:outline-none ${errors.email ? "border-red-400" : "border-gray-300"}`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.email}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full rounded-xl border px-4 py-3 focus:border-[#e61e2d] focus:outline-none ${errors.phone ? "border-red-400" : "border-gray-300"}`}
                required
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.phone}</p>}
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              type="text" name="organizationName" value={formData.organizationName} onChange={handleChange}
              placeholder="Enter organization name"
              className={`w-full rounded-xl border px-4 py-3 focus:border-[#e61e2d] focus:outline-none ${errors.organizationName ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.organizationName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.organizationName}</p>}
          </div>

          {/* Postal Code Input (इसे ऊपर कर दिया ताकि फ्लो सही रहे) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Postal Code{" "}
              {fetchingLocation && (
                <span className="text-xs text-[#e61e2d] animate-pulse">
                  (Fetching Areas...)
                </span>
              )}
            </label>
            <input
              type="text"
              name="pincode"
              maxLength={6}
              value={formData.pincode}
              onChange={handlePincodeChange}
              placeholder="e.g. AB1234"
              className={`w-full rounded-xl border px-4 py-3 focus:border-[#e61e2d] focus:outline-none ${errors.pincode ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.pincode}</p>}
          </div>

          {/* Specific Area Select Dropdown */}
          {areas.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Specific Area
              </label>
              <select
                onChange={handleAreaChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none bg-white"
                required
              >
                {areas.map((area, index) => (
                  <option key={index} value={index}>
                    {area["place name"]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* City and Province (यूज़र इन्हें डायरेक्ट एडिट न करे इसलिए readOnly किया है) */}
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
                placeholder="City (auto-fills for Canadian pincodes, or enter manually)"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Province/State (auto-fills for Canadian pincodes, or enter manually)"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#e61e2d] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Detailed Address
            </label>
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

          {/* Custom package vendor toggle — mutually exclusive with a fixed package */}
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
            <input
              type="checkbox"
              id="isCustomPackageVendor"
              checked={formData.isCustomPackageVendor}
              onChange={handleCustomToggle}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#e61e2d] focus:ring-[#e61e2d]"
            />
            <label htmlFor="isCustomPackageVendor" className="text-sm text-gray-700">
              <span className="font-medium">This vendor handles Custom Package orders</span>
              <p className="mt-0.5 text-xs text-gray-400">
                All "Build Your Own Package" orders in this vendor's assigned pincodes will go
                exclusively to them — they won't receive orders for any fixed package.
              </p>
            </label>
          </div>

          {/* Package — a vendor serves exactly one package (unless it's the custom package vendor) */}
          {!formData.isCustomPackageVendor && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Package (this vendor will serve only this plan)
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                disabled={loadingPackages}
                className={`w-full rounded-xl border px-4 py-3 focus:border-[#e61e2d] focus:outline-none bg-white ${errors.package ? "border-red-400" : "border-gray-300"}`}
                required
              >
                <option value="">
                  {loadingPackages ? "Loading packages..." : "Select a package"}
                </option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              {errors.package && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.package}</p>}
              <p className="mt-1 text-xs text-gray-400">
                Delivery pincodes for this vendor are set later from the Assign Vendor page.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || fetchingLocation}
            className="w-full rounded-xl bg-[#e61e2d] py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
          >
            {loading && <ButtonSpinner />}
            {loading ? "Creating Vendor..." : "Add Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
