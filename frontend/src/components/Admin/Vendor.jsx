import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVendors, deleteVendor, updateVendor } from "../../service/vendor.service.js";

const VendorList = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- MODALS STATES ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // --- UPDATE FORM STATE ---
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
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  // 1. Fetch All Vendors
  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllVendors();
      if (res.success) setVendors(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Trigger Click
  const handleDeleteClick = (id) => {
    setSelectedVendorId(id);
    setIsDeleteModalOpen(true);
  };

  // 3. Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      const res = await deleteVendor(selectedVendorId);
      if (res.success) {
        setSuccess("Vendor deleted successfully!");
        setIsDeleteModalOpen(false);
        fetchVendors();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
      setIsDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // 4. Edit Button Click
  const handleEditClick = (vendor) => {
    setSelectedVendorId(vendor._id);
    setFormData({
      name: vendor.userId?.name || "",
      email: vendor.userId?.email || "",
      phone: vendor.userId?.phone || "",
      organizationName: vendor.organizationName || "",
      address: vendor.address || "",
      city: vendor.city || "",
      state: vendor.state || "",
      pincode: vendor.pincode || "",
      description: vendor.description || "",
    });
    setSelectedFile(null);
    setIsUpdateModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 5. Submit Updated Data
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError("");

      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("organizationName", formData.organizationName);
      dataToSend.append("address", formData.address);
      dataToSend.append("city", formData.city);
      dataToSend.append("state", formData.state);
      dataToSend.append("pincode", formData.pincode);
      dataToSend.append("description", formData.description);
      
      if (selectedFile) {
        dataToSend.append("logo", selectedFile);
      }

      const res = await updateVendor(selectedVendorId, dataToSend);

      if (res.success) {
        setSuccess("Vendor updated successfully!");
        setIsUpdateModalOpen(false);
        fetchVendors();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update vendor");
    } finally {
      setUpdating(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading Vendors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      {/* Messages */}
      {success && <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200 text-sm font-medium text-green-800">✨ {success}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800">⚠️ Error: {error}</div>}

      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f172a]">Vendor Management</h1>
          <p className="text-sm font-medium text-gray-400 mt-1">
            Manage all vendors <span className="text-red-500 font-semibold">({filteredVendors.length})</span>
          </p>
        </div>

        {/* Search and Add Controls */}
        <div className="flex flex-1 max-w-xl gap-3 sm:justify-end w-full">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none shadow-sm transition-all focus:border-red-500"
            />
          </div>
          <button
            onClick={() => navigate("/admin/vendors/add")}
            className="rounded-xl bg-[#e61e2d] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all flex items-center gap-1 shrink-0"
          >
            <span className="text-lg">+</span> Add Vendor
          </button>
        </div>
      </div>

      {filteredVendors.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400 bg-white border rounded-2xl shadow-sm font-medium">No vendors found matching your search.</div>
      )}

      {/* Vendor Cards List */}
      <div className="space-y-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor._id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5">
            
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Profile Info */}
              <div className="flex items-center gap-4 min-w-[220px]">
                <img src={vendor.logo?.url || "https://via.placeholder.com/150"} alt={vendor.organizationName} className="h-20 w-20 rounded-2xl border-2 border-red-50 object-cover shadow-sm shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">{vendor.organizationName}</h2>
                  <p className="text-sm font-medium text-gray-500 mt-0.5">Owner: <span className="text-gray-800 font-semibold">{vendor.userId?.name || "N/A"}</span></p>
                  <span className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${vendor.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${vendor.isActive ? "bg-green-600" : "bg-red-600"}`}></span>
                    {vendor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Middle Section Contacts */}
              <div className="flex-1 space-y-2.5 md:border-l md:pl-8 border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="p-2 rounded-xl bg-red-50 text-[#e61e2d] font-bold text-xs">✉️</span>
                  <span className="font-medium truncate">{vendor.userId?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="p-2 rounded-xl bg-red-50 text-[#e61e2d] font-bold text-xs">📞</span>
                  <span className="font-semibold">{vendor.userId?.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="p-2 rounded-xl bg-red-50 text-[#e61e2d] font-bold text-xs">📍</span>
                  <span className="font-medium truncate">{vendor.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 self-end md:self-start">
                <button onClick={() => handleEditClick(vendor)} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition shadow-sm text-sm">✏️</button>
                <button onClick={() => handleDeleteClick(vendor._id)} className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition shadow-sm text-sm">🗑️</button>
              </div>
            </div>

            {/* Bottom Meta Badges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 border-t pt-4 border-gray-50">
              <div className="flex items-center gap-3.5 bg-red-50/30 rounded-2xl p-3 border border-red-50/50">
                <span className="p-2.5 rounded-xl bg-white shadow-sm text-lg">🏢</span>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">City</p>
                  <p className="text-sm font-extrabold text-gray-800 mt-0.5">{vendor.city}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-purple-50/30 rounded-2xl p-3 border border-purple-50/50">
                <span className="p-2.5 rounded-xl bg-white shadow-sm text-lg">🗺️</span>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">State</p>
                  <p className="text-sm font-extrabold text-gray-800 mt-0.5">{vendor.state}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-green-50/30 rounded-2xl p-3 border border-green-50/50">
                <span className="p-2.5 rounded-xl bg-white shadow-sm text-lg">📍</span>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Pincode</p>
                  <p className="text-sm font-extrabold text-gray-800 mt-0.5">{vendor.pincode}</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ==================== 1. DELETE CONFIRMATION MODAL (BLUR BACKGROUND - NO BLACK SHADE) ==================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md p-4 pt-16 transition-all duration-300">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200/80 transform translate-y-0 transition-transform animate-in slide-in-from-top-4 duration-200">
            <h3 className="text-lg font-bold text-gray-900">Delete Vendor Profile?</h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to delete this vendor? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button disabled={deleting} onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button disabled={deleting} onClick={handleConfirmDelete} className="rounded-xl bg-[#e61e2d] px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. UPDATE VENDOR MODAL (BLUR BACKGROUND - NO BLACK SHADE) ==================== */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md overflow-y-auto p-4 pt-10">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl my-4 border border-gray-200/80 transform transition-transform animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Update Vendor Details</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Organization Name</label>
                  <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Update Logo (Optional)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#e61e2d] hover:file:bg-red-100" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea rows="2" name="description" value={formData.description} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-3 mt-4">
                <button type="button" disabled={updating} onClick={() => setIsUpdateModalOpen(false)} className="rounded-xl border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Close</button>
                <button type="submit" disabled={updating} className="rounded-xl bg-[#e61e2d] px-5 py-2 text-sm text-white hover:bg-red-700">
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorList;