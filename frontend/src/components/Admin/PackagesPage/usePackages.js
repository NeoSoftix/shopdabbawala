import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  createPackage,
  getAllPackages,
  deletePackage,
  updatePackage,
} from "../../../services/package.service.js";
import { confirmDeleteToast } from "../../../utils/confirmDeleteToast.jsx";

const emptyFormData = {
  name: "",
  price: "",
  totalMeals: "",
  validityDays: "",
  description: "",
  maxItemsPerMeal: "",
  features: "" // UI में यह string की तरह रहेगा
};

/**
 * Encapsulates all state + API calls for the Packages admin page:
 * fetching, creating/updating, deleting and editing packages, plus
 * the add/edit form state.
 */
export default function usePackages() {
  const [showForm, setShowForm] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [savingPackage, setSavingPackage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editId, setEditId] = useState(null);

  // Single State for Form
  const [formData, setFormData] = useState(emptyFormData);

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditId(null);
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      resetForm();
    }
  };

  // 1. GET ALL PACKAGES API CALL
  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const res = await getAllPackages();
      if (res && res.data) {
        setPackages(res.data);
      }
    } catch (error) {
      console.error("get all packages error", error);
      toast.error("Failed to fetch packages.");
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

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

    if (
      !formData.name ||
      !formData.price ||
      !formData.totalMeals ||
      !formData.validityDays ||
      !formData.maxItemsPerMeal
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const parsedFeatures = formData.features
      ? formData.features.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const dataToSend = { ...formData, features: parsedFeatures };

    try {
      setSavingPackage(true);
      let res;
      if (editId) {
        res = await updatePackage(editId, dataToSend);
      } else {
        res = await createPackage(dataToSend);
      }

      if (res && res.success) {
        toast.success(editId ? "✅ Package updated successfully!" : "🎉 Package added successfully!");
        resetForm();
        setShowForm(false);
        fetchPackages();
      }
    } catch (error) {
      console.error("Save package error", error);
      toast.error(error.response?.data?.message || "Failed to save package.");
    } finally {
      setSavingPackage(false);
    }
  };

  // 4. DELETE PACKAGE API CALL
  const handleDelete = (id) => {
    confirmDeleteToast("Delete this package?", async () => {
      try {
        setDeletingId(id);
        const res = await deletePackage(id);
        if (res.success) {
          await fetchPackages();
          toast.success("Package deleted successfully.");
        }
      } catch {
        toast.error("Failed to delete package.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  // 5. FILL FORM FOR EDITING
  const handleEditClick = (p) => {
    setEditId(p._id);

    // 💡 Backend से आये Features Array को UI इनपुट के लिए String में कन्वर्ट किया (कॉमा से सेपरेटेड)
    const featuresString = Array.isArray(p.features)
      ? p.features.join(", ")
      : p.features || "";

    setFormData({
      name: p.name || "",
      price: p.price || "",
      totalMeals: p.totalMeals || "",
      validityDays: p.validityDays || "",
      description: p.description || "",
      maxItemsPerMeal: p.maxItemsPerMeal || "",
      features: featuresString // ✅ अब एडिट करते समय फॉर्म में डेटा दिखेगा
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  return {
    showForm,
    packages,
    loadingPackages,
    savingPackage,
    deletingId,
    editId,
    formData,
    toggleForm,
    closeForm,
    handleChange,
    handleSavePackage,
    handleDelete,
    handleEditClick,
  };
}
