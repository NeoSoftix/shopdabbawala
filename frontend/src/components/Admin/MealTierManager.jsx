import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

import {
  getAllMealTiers,
  createMealTier,
  updateMealTier,
  toggleMealTierStatus,
  deleteMealTier,
} from "../../services/mealTier.service.js";
import { getActiveItems } from "../../services/items.service.js";

const MAX_FEATURES = 10;

const emptyForm = {
  name: "",
  features: [""],
  items: [],
  selectionCount: 1,
};

export default function MealTierManager() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [allItems, setAllItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---------------------------------------------------------------------
  // FETCH TIERS
  // ---------------------------------------------------------------------
  const fetchTiers = async () => {
    setLoading(true);
    try {
      const res = await getAllMealTiers();
      setTiers(res.data || []);
    } catch (error) {
      console.error("Fetch Meal Tiers Error:", error);
      toast.error(error?.response?.data?.message || "Couldn't load meal tiers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  // ---------------------------------------------------------------------
  // FETCH ACTIVE ITEMS (for the checklist)
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // FORM HANDLERS
  // ---------------------------------------------------------------------
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
      fetchTiers();
    } catch (error) {
      console.error("Save Meal Tier Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------
  // TOGGLE / DELETE
  // ---------------------------------------------------------------------
  const handleToggle = async (tier) => {
    setTiers((prev) =>
      prev.map((t) => (t._id === tier._id ? { ...t, isActive: !t.isActive } : t))
    );
    try {
      await toggleMealTierStatus(tier._id);
    } catch (error) {
      console.error("Toggle Error:", error);
      toast.error(error?.response?.data?.message || "Couldn't update status");
      setTiers((prev) =>
        prev.map((t) => (t._id === tier._id ? { ...t, isActive: tier.isActive } : t))
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMealTier(deleteTarget._id);
      toast.success("Tier deleted");
      setTiers((prev) => prev.filter((t) => t._id !== deleteTarget._id));
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.response?.data?.message || "Couldn't delete tier");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
              Meal Tiers
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Define meal tiers like "Basic", "Medium", "Premium" — set their features and
              which items belong to each tier.
            </p>
          </div>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 bg-[#dc2626] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl shadow-sm shadow-red-600/20 transition-all active:scale-[0.98] focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Tier
          </button>
        </div>

        {/* ---------------- LOADING STATE ---------------- */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-4 h-48 animate-pulse" />
            ))}
          </div>
        )}

        {/* ---------------- EMPTY STATE ---------------- */}
        {!loading && tiers.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#dc2626] flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800">No meal tiers yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Add your first tier — like "Basic" with a few features and items.
            </p>
            <button
              onClick={openCreateForm}
              className="text-xs font-bold text-[#dc2626] hover:underline"
            >
              + Add New Tier
            </button>
          </div>
        )}

        {/* ---------------- TIER CARDS ---------------- */}
        {!loading && tiers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tiers.map((tier) => (
              <div
                key={tier._id}
                className={`relative bg-white rounded-2xl border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all flex flex-col ${
                  tier.isActive ? "border-gray-200/80" : "border-gray-200/60 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-black text-gray-900">{tier.name}</h3>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                      tier.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {tier.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-1 mb-3">
                  {(tier.features || []).map((feature, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                      <span className="text-[#dc2626] mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Items */}
                <div className="bg-[#f4f5f7] rounded-xl p-2.5 mt-auto">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Items ({tier.items?.length || 0})
                    </span>
                    {tier.items?.length > 0 && (
                      <span className="text-[10px] font-black text-[#dc2626]">
                        Choose {tier.selectionCount || 1} of {tier.items.length}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(tier.items || []).map((item) => (
                      <span
                        key={item._id}
                        className="text-[10px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-0.5"
                      >
                        {item.name}
                      </span>
                    ))}
                    {(!tier.items || tier.items.length === 0) && (
                      <span className="text-[10px] text-gray-400">No items selected</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3">
                  <button
                    onClick={() => openEditForm(tier)}
                    className="flex-1 text-[11px] font-bold text-gray-600 hover:text-[#dc2626] bg-gray-50 hover:bg-red-50 rounded-lg py-1.5 transition-all focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggle(tier)}
                    className="flex-1 text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg py-1.5 transition-all focus:outline-none"
                  >
                    {tier.isActive ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(tier)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
                    aria-label="Delete tier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79l-.622 10.72a2.25 2.25 0 01-2.244 2.13H7.638a2.25 2.25 0 01-2.244-2.13L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.956.397a48.11 48.11 0 013.478-.397m0 0V4.67c0-1.03.83-1.874 1.86-1.913a45.62 45.62 0 013.28 0c1.03.04 1.86.883 1.86 1.913v.816m-6 0a48.667 48.667 0 017.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------- */}
      {/* ADD / EDIT FORM — slide-over panel                              */}
      {/* --------------------------------------------------------------- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={closeForm}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                {editingId ? "Edit Meal Tier" : "New Meal Tier"}
              </h2>
              <button
                onClick={closeForm}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Tier Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Basic, Medium, Premium"
                  className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                    formErrors.name
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 block">
                    Features
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {form.features.length}/{MAX_FEATURES}
                  </span>
                </div>
                <div className="space-y-2">
                  {form.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeatureField(index)}
                        disabled={form.features.length === 1}
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Remove feature"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {formErrors.features && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.features}</p>
                )}
                <button
                  type="button"
                  onClick={addFeatureField}
                  disabled={form.features.length >= MAX_FEATURES}
                  className="mt-2 text-xs font-bold text-[#dc2626] hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                >
                  + Add Feature
                </button>
              </div>

              {/* Items checklist */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Items
                </label>

                {/* Selected items summary — chips with quick-remove, always visible */}
                {form.items.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2 bg-red-50/50 border border-red-100 rounded-xl p-2">
                    {form.items.map((itemId) => (
                      <span
                        key={itemId}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#dc2626] bg-white border border-red-200 rounded-lg pl-2 pr-1 py-0.5"
                      >
                        {itemNameById[itemId] || "…"}
                        <button
                          type="button"
                          onClick={() => removeSelectedItem(itemId)}
                          className="w-3.5 h-3.5 flex items-center justify-center text-red-300 hover:text-red-600 rounded-full transition-all focus:outline-none"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Toggle button — checklist stays collapsed until admin clicks to open it */}
                <button
                  type="button"
                  onClick={() => setIsItemPickerOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-xl p-2.5 text-xs font-semibold text-gray-700 hover:border-[#dc2626] transition-all focus:outline-none"
                >
                  <span>
                    {form.items.length > 0
                      ? `${form.items.length} item${form.items.length === 1 ? "" : "s"} selected`
                      : "Select items"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isItemPickerOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isItemPickerOpen && (
                  <div className="mt-1.5">
                    {/* Search box — filters the checklist below, useful once the catalog grows */}
                    <div className="relative mb-1.5">
                      <input
                        type="text"
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        placeholder="Search items..."
                        autoFocus
                        className="w-full border border-gray-300 rounded-xl p-2 pl-8 text-xs text-gray-800 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-2.5 max-h-56 overflow-y-auto bg-[#f9f9fb]">
                      {itemsLoading && (
                        <p className="text-xs text-gray-400 py-2 text-center">Loading items...</p>
                      )}
                      {!itemsLoading && allItems.length === 0 && (
                        <p className="text-xs text-gray-400 py-2 text-center">No active items found</p>
                      )}
                      {!itemsLoading && allItems.length > 0 && filteredItems.length === 0 && (
                        <p className="text-xs text-gray-400 py-2 text-center">No items match "{itemSearch}"</p>
                      )}
                      {!itemsLoading &&
                        filteredItems.map((item) => (
                          <label
                            key={item._id}
                            className="flex items-center gap-2 py-1.5 px-1 rounded-lg hover:bg-white cursor-pointer transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={form.items.includes(item._id)}
                              onChange={() => toggleItemSelection(item._id)}
                              className="w-3.5 h-3.5 accent-[#dc2626] rounded"
                            />
                            <span className="text-xs text-gray-700">{item.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                {formErrors.items && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.items}</p>
                )}
              </div>

              {/* Selection count — how many of the tier's items a customer picks per order */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Items Per Meal (customer selects)
                </label>
                <input
                  type="number"
                  min="1"
                  max={form.items.length || 1}
                  value={form.selectionCount}
                  onChange={(e) => handleSelectionCountChange(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                    formErrors.selectionCount
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                  }`}
                />
                {formErrors.selectionCount && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.selectionCount}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  e.g. "{form.items.length || 0} items included, choose {form.selectionCount || 1}" — shown to
                  the customer while ordering.
                </p>
              </div>
            </form>

            <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2.5 transition-all focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 text-xs font-bold text-white bg-[#dc2626] hover:bg-red-700 rounded-xl py-2.5 transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Tier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL                                        */}
      {/* --------------------------------------------------------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-sm font-black text-gray-900">Delete this tier?</h3>
            <p className="text-xs text-gray-500 mt-1.5 mb-4">
              "{deleteTarget.name}" will be removed permanently and will no longer appear
              on the customer's plan selection.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2.5 transition-all focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl py-2.5 transition-all focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
