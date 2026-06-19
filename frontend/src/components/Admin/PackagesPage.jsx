import { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaClock,
  FaDollarSign,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  createPackage,
  getAllPackages,
  deletePackage,
  updatePackage
} from "../../service/package.service.js";

const PackagesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null); // New state to track if we are editing

  // Single State for Form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    totalMeals: "",
    validityDays: "",
    description: "",
  });

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    // Form close hote hi edit state reset karein
    if (showForm) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      totalMeals: "",
      validityDays: "",
      description: "",
    });
    setEditId(null);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // 1. GET ALL PACKAGES API CALL
  const fetchPackages = async () => {
    try {
      const res = await getAllPackages();
      if (res && res.data) {
        setPackages(res.data);
      }
    } catch (error) {
      console.error("get all packages error", error);
      setError("Failed to fetch packages.");
    }
  };

  // 2. CONTROL INPUT CHANGES DYNAMICALLY
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. CREATE & UPDATE PACKAGE API CALL
  const handleSavePackage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.price ||
      !formData.totalMeals ||
      !formData.validityDays
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      let res;
      if (editId) {
        // 👇 Dynamic Update API Call
        res = await updatePackage(editId, formData);
      } else {
        // 👇 Create API Call
        res = await createPackage(formData);
      }

      if (res && res.success) {
        setSuccess(editId ? "Package updated successfully!" : "Package added successfully!");
        resetForm();
        setShowForm(false);
        fetchPackages();
      }
    } catch (error) {
      console.error("Save package error", error);
      setError(error.response?.data?.message || "Failed to Save Package");
    }
  };

  // 4. DELETE PACKAGE API CALL
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this package?",
    );

    if (!confirmed) return;

    try {
      setSuccess("");
      setError("");

      const res = await deletePackage(id);

      if (res.success) {
        await fetchPackages();
        setSuccess("Package deleted successfully");
      }
    } catch (error) {
      console.log("Delete package error:", error);
      setError("Failed to delete package");
    }
  };

  // 5. FILL FORM FOR EDITING
  const handleEditClick = (p) => {
    setEditId(p._id); // Set active package id
    setFormData({
      name: p.name || "",
      price: p.price || "",
      totalMeals: p.totalMeals || "",
      validityDays: p.validityDays || "",
      description: p.description || "",
    });
    setShowForm(true); // Open form section
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Dynamically calculate stats based on backend data keys
  const stats = [
    {
      title: "Total Packages",
      value: packages.length,
      sub: "All packages",
      icon: <FaBoxOpen />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Active Packages",
      value: packages.filter((p) => p.isActive === true).length,
      sub: "Currently active",
      icon: <FaClock />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Inactive Packages",
      value: packages.filter((p) => p.isActive !== true).length,
      sub: "Disabled packages",
      icon: <FaBoxOpen />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
    },
    {
      title: "Revenue",
      value: "$0",
      sub: "Package sales",
      icon: <FaDollarSign />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans antialiased text-gray-900">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Packages
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Dashboard / Packages
          </p>
        </div>
        <button
          onClick={toggleForm}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all duration-200 active:scale-95 ${
            showForm
              ? "bg-gray-800 text-white hover:bg-gray-900 shadow-gray-800/10"
              : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/10"
          }`}
        >
          <FaPlus
            className={`w-3 h-3 transition-transform duration-200 ${showForm ? "rotate-45" : ""}`}
          />
          {showForm ? "Close Form" : "Add Package"}
        </button>
      </div>

      <div className="mb-4">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium">
            {success}
          </div>
        )}
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {s.title}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {s.value}
              </h3>
              {s.sub && (
                <p className="text-[10px] text-purple-600 font-medium mt-0.5">
                  {s.sub}
                </p>
              )}
            </div>
            <div
              className={`p-2.5 sm:p-3 rounded-xl ${s.bgColor} ${s.textColor} text-lg sm:text-xl`}
            >
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* TABLE SECTION */}
        <div
          className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300`}
        >
          <div className="p-4 sm:p-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-bold text-gray-800 text-base sm:text-lg">
              All Packages
            </h2>
          </div>

          {/* TABLE WRAPPER */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Meals</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {packages.map((p, i) => (
                  <tr
                    key={p._id || i}
                    className="hover:bg-gray-50/40 transition-colors duration-150"
                  >
                    <td className="py-3.5 px-4 text-sm text-gray-400 font-medium">
                      {i + 1}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-800 capitalize">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-bold text-gray-900">
                      ${p.price}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-600 font-medium">
                      {p.totalMeals} Tiffins
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">
                      {p.validityDays} Days
                    </td>
                    <td
                      className="py-3.5 px-4 text-sm text-gray-400 max-w-[180px] truncate"
                      title={p.description}
                    >
                      {p.description || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
                            : "bg-gray-100 text-gray-600 ring-1 ring-gray-500/10"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* 👇 Edit Button Connected */}
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id || i)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-8 text-sm text-gray-400"
                    >
                      No packages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        {showForm && (
          <form
            onSubmit={handleSavePackage}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 sticky top-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-5">
              {/* Dynamic Heading based on Mode */}
              <h2 className="font-bold text-gray-800 text-base sm:text-lg">
                {editId ? "Edit Package" : "Add Package"}
              </h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="Package Name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="Price"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Total Meals *
                  </label>
                  <input
                    type="number"
                    name="totalMeals"
                    value={formData.totalMeals}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="Total Meals"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Validity (Days) *
                  </label>
                  <input
                    type="number"
                    name="validityDays"
                    value={formData.validityDays}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="Validity (Days)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                  placeholder="Description"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 rounded-xl shadow-sm shadow-red-600/10 transition-all duration-150 active:scale-[0.99]"
                >
                  {editId ? "Update Package" : "Save Package"}
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-2.5">
                  Packages will be visible after saving.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;