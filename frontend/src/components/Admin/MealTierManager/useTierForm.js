import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";

import { createMealTier, updateMealTier } from "../../../services/mealTier.service.js";
import { getActiveItems } from "../../../services/items.service.js";
import { MAX_FEATURES, emptyForm } from "./constants.js";

// ---------------------------------------------------------------------
// Add/Edit tier form state — name, features, item selection & submit.
// `onSaved` is called after a successful create/update (used to refresh
// the tier list owned by useMealTiers).
// ---------------------------------------------------------------------
export default function useTierForm({ onSaved } = {}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [allItems, setAllItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);

  // -------------------------------------------------------------------
  // FETCH ACTIVE ITEMS (for the checklist)
  // -------------------------------------------------------------------
  const fetchActiveItems = async () => {
    setItemsLoading(true);
    try {
      const res = await getActiveItems();
      setAllItems(res.data || []);
    } catch (error) {
      console.error("Fetch Active Items Error:", error);
      toast.error(error?.response?.data?.message || "Couldn't load items");
    } finally {
      setItemsLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // FORM HANDLERS
  // -------------------------------------------------------------------
  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setItemSearch("");
    setIsItemPickerOpen(false);
    setIsFormOpen(true);
    fetchActiveItems();
  };

  const openEditForm = (tier) => {
    setEditingId(tier._id);
    setForm({
      name: tier.name,
      features: tier.features?.length ? tier.features : [""],
      items: (tier.items || []).map((item) => item._id),
      selectionCount: tier.selectionCount || 1,
    });
    setFormErrors({});
    setItemSearch("");
    setIsItemPickerOpen(false);
    setIsFormOpen(true);
    fetchActiveItems();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setItemSearch("");
    setIsItemPickerOpen(false);
  };

  const handleNameChange = (value) => {
    setForm((prev) => ({ ...prev, name: value }));
    setFormErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleFeatureChange = (index, value) => {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
    setFormErrors((prev) => ({ ...prev, features: undefined }));
  };

  const addFeatureField = () => {
    setForm((prev) => {
      if (prev.features.length >= MAX_FEATURES) return prev;
      return { ...prev, features: [...prev.features, ""] };
    });
  };

  const removeFeatureField = (index) => {
    setForm((prev) => {
      const features = prev.features.filter((_, i) => i !== index);
      return { ...prev, features: features.length ? features : [""] };
    });
  };

  const toggleItemSelection = (itemId) => {
    setForm((prev) => {
      const isSelected = prev.items.includes(itemId);
      const items = isSelected
        ? prev.items.filter((id) => id !== itemId)
        : [...prev.items, itemId];
      return { ...prev, items };
    });
    setFormErrors((prev) => ({ ...prev, items: undefined }));
  };

  const removeSelectedItem = (itemId) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((id) => id !== itemId) }));
  };

  const handleSelectionCountChange = (value) => {
    setForm((prev) => ({ ...prev, selectionCount: value }));
    setFormErrors((prev) => ({ ...prev, selectionCount: undefined }));
  };

  // name lookup so selected chips still resolve even if an item scrolled out of the search results
  const itemNameById = useMemo(() => {
    const map = {};
    allItems.forEach((item) => {
      map[item._id] = item.name;
    });
    return map;
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const q = itemSearch.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [allItems, itemSearch]);

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Tier name is required";

    const cleanedFeatures = form.features.map((f) => f.trim()).filter((f) => f.length > 0);
    if (cleanedFeatures.length < 1) errors.features = "Add at least one feature";
    if (cleanedFeatures.length > MAX_FEATURES) errors.features = `Maximum ${MAX_FEATURES} features allowed`;

    if (!form.items.length) errors.items = "Select at least one item";

    const selectionCount = Number(form.selectionCount);
    if (!Number.isInteger(selectionCount) || selectionCount < 1) {
      errors.selectionCount = "Enter a whole number of at least 1";
    } else if (form.items.length && selectionCount > form.items.length) {
      errors.selectionCount = `Cannot exceed total selected items (${form.items.length})`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: form.name.trim(),
      features: form.features.map((f) => f.trim()).filter((f) => f.length > 0),
      items: form.items,
      selectionCount: Number(form.selectionCount),
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await updateMealTier(editingId, payload);
        toast.success("Tier updated");
      } else {
        await createMealTier(payload);
        toast.success("Tier created");
      }
      closeForm();
      onSaved?.();
    } catch (error) {
      console.error("Save Meal Tier Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isFormOpen,
    editingId,
    form,
    formErrors,
    submitting,
    allItems,
    itemsLoading,
    itemSearch,
    isItemPickerOpen,
    itemNameById,
    filteredItems,
    openCreateForm,
    openEditForm,
    closeForm,
    handleNameChange,
    handleFeatureChange,
    addFeatureField,
    removeFeatureField,
    toggleItemSelection,
    removeSelectedItem,
    handleSelectionCountChange,
    setItemSearch,
    setIsItemPickerOpen,
    handleSubmit,
  };
}
