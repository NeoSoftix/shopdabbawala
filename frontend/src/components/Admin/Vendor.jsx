import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllVendors,
  deleteVendor,
  updateVendor,
  toggleVendorStatus,
} from "../../services/vendor.service.js";
import { getActiveCategory } from "../../services/category.service.js";
import { PageLoader } from "../shared/Loader";
import VendorAlerts from "./Vendor/VendorAlerts";
import VendorHeader from "./Vendor/VendorHeader";
import VendorCardList from "./Vendor/VendorCardList";
import DeleteVendorModal from "./Vendor/DeleteVendorModal";
import UpdateVendorModal from "./Vendor/UpdateVendorModal";
import Pagination from "../shared/Pagination";
import { SectionLoader } from "../shared/Loader";

const VendorList = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(0);

  // --- MODALS STATES ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedVendorActive, setSelectedVendorActive] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

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
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Category options for the edit modal (delivery pincodes are managed
  // separately from the Assign Vendor page).
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchVendors();
    getActiveCategory()
      .then((res) => {
        if (res.success) setCategories(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchVendors();
  }, [page, searchTerm]);

  // 1. Fetch Vendors (paginated, optionally filtered by search)
  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllVendors(page, 10, searchTerm);
      if (res.success) {
        setVendors(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalVendors(res.total || 0);
      }
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
      category: vendor.category?._id || vendor.category || "",
    });
    setSelectedFile(null);
    setSelectedVendorActive(!!vendor.isActive);
    setIsUpdateModalOpen(true);
  };

  // Toggle Active / Inactive Status
  const handleToggleStatus = async (nextIsActive) => {
    try {
      setTogglingStatus(true);
      const res = await toggleVendorStatus(selectedVendorId, nextIsActive);
      if (res.success) {
        setSelectedVendorActive(nextIsActive);
        setSuccess(res.message || "Vendor status updated successfully!");
        fetchVendors();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update vendor status");
    } finally {
      setTogglingStatus(false);
    }
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
      dataToSend.append("category", formData.category);

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

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <VendorAlerts success={success} error={error} />

      <VendorHeader
        count={totalVendors}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => navigate("/admin/vendors/add")}
      />

      {loading ? (
        <SectionLoader text="Loading vendors..." />
      ) : (
        <>
          <VendorCardList
            vendors={vendors}
            error={error}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <DeleteVendorModal
        isOpen={isDeleteModalOpen}
        deleting={deleting}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <UpdateVendorModal
        isOpen={isUpdateModalOpen}
        formData={formData}
        updating={updating}
        categories={categories}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSubmit={handleUpdateSubmit}
        onClose={() => setIsUpdateModalOpen(false)}
        isActive={selectedVendorActive}
        togglingStatus={togglingStatus}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default VendorList;
