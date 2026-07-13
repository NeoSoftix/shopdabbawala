import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllVendors,
  deleteVendor,
  updateVendor,
} from "../../services/vendor.service.js";
import { getActivePackages } from "../../services/package.service.js";
import { PageLoader } from "../shared/Loader";
import VendorAlerts from "./Vendor/VendorAlerts";
import VendorHeader from "./Vendor/VendorHeader";
import VendorCardList from "./Vendor/VendorCardList";
import DeleteVendorModal from "./Vendor/DeleteVendorModal";
import UpdateVendorModal from "./Vendor/UpdateVendorModal";

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
    package: "",
    isCustomPackageVendor: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Package options for the edit modal (delivery pincodes are managed
  // separately from the Assign Vendor page).
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchVendors();
    getActivePackages()
      .then((res) => {
        if (res.success) setPackages(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch packages:", err));
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
      package: vendor.package?._id || vendor.package || "",
      isCustomPackageVendor: !!vendor.isCustomPackageVendor,
    });
    setSelectedFile(null);
    setIsUpdateModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      dataToSend.append("isCustomPackageVendor", formData.isCustomPackageVendor);
      if (!formData.isCustomPackageVendor) {
        dataToSend.append("package", formData.package);
      }

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

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.organizationName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vendor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <VendorAlerts success={success} error={error} />

      <VendorHeader
        count={filteredVendors.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => navigate("/admin/vendors/add")}
      />

      <VendorCardList
        vendors={filteredVendors}
        error={error}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

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
        packages={packages}
        onInputChange={handleInputChange}
        onCustomToggle={handleCustomToggle}
        onFileChange={handleFileChange}
        onSubmit={handleUpdateSubmit}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
};

export default VendorList;
