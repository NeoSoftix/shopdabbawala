import { useState } from "react";
import { toast } from "react-hot-toast";

import { createMealTier, updateMealTier } from "../../../services/mealTier.service.js";
import { MAX_FEATURES, emptyForm } from "./constants.js";

// ---------------------------------------------------------------------
// Add/Edit tier form state — name, features & submit.
// `onSaved` is called after a successful create/update (used to refresh
// the tier list owned by useMealTiers).
// ---------------------------------------------------------------------
export default function useTierForm({ onSaved } = {}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // -------------------------------------------------------------------
  // FORM HANDLERS
  // -------------------------------------------------------------------
  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (tier) => {
    setEditingId(tier._id);
    setForm({
      name: tier.name,
      features: tier.features?.length ? tier.features : [""],
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
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

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Tier name is required";

    const cleanedFeatures = form.features.map((f) => f.trim()).filter((f) => f.length > 0);
    if (cleanedFeatures.length < 1) errors.features = "Add at least one feature";
    if (cleanedFeatures.length > MAX_FEATURES) errors.features = `Maximum ${MAX_FEATURES} features allowed`;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: form.name.trim(),
      features: form.features.map((f) => f.trim()).filter((f) => f.length > 0),
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
    openCreateForm,
    openEditForm,
    closeForm,
    handleNameChange,
    handleFeatureChange,
    addFeatureField,
    removeFeatureField,
    handleSubmit,
  };
}
