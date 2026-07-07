import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

// ---------------------------------------------------------------------------
// API SERVICE CALLS — Updated according to new service layer
// ---------------------------------------------------------------------------
import {
  getAllPlans,
  createPlan,
  updatePlan,
  togglePlanStatus,
  deletePlan,
} from "../../services/customPlanConfig.service.js"; // Apni service file ka exact path check kar lein

const emptyForm = {
  durationLabel: "",
  totalMeals: "",
  pricePerMeal: "",
  frequencyLabel: "",
  sortOrder: "",
};

export default function SetDuration() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---------------------------------------------------------------------
  // FETCH PLANS
  // ---------------------------------------------------------------------
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getAllPlans();
      // Agar aapka backend direct array bhejta hai ya res.data.data mein bhejta hai uske according fallback handle kiya hai
      setPlans(res.data || res || []);
    } catch (error) {
      console.error("Fetch Duration Plans Error:", error);
      toast.error(error?.message || "Couldn't load duration plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ---------------------------------------------------------------------
  // DERIVED — live total price preview while typing in the form
  // ---------------------------------------------------------------------
  const livePreviewTotal = useMemo(() => {
    const meals = Number(form.totalMeals);
    const price = Number(form.pricePerMeal);
    if (!meals || !price || isNaN(meals) || isNaN(price)) return null;
    return (meals * price).toFixed(2);
  }, [form.totalMeals, form.pricePerMeal]);

  // ---------------------------------------------------------------------
  // FORM HANDLERS
  // ---------------------------------------------------------------------
  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (plan) => {
    setEditingId(plan._id);
    setForm({
      durationLabel: plan.durationLabel,
      totalMeals: String(plan.totalMeals),
      pricePerMeal: String(plan.pricePerMeal),
      frequencyLabel: plan.frequencyLabel,
      sortOrder: String(plan.sortOrder ?? 0),
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.durationLabel.trim()) errors.durationLabel = "Duration label is required";
    if (!form.totalMeals || Number(form.totalMeals) <= 0) errors.totalMeals = "Enter a positive number";
    if (!form.pricePerMeal || Number(form.pricePerMeal) <= 0) errors.pricePerMeal = "Enter a positive number";
    if (!form.frequencyLabel.trim()) errors.frequencyLabel = "Frequency label is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      durationLabel: form.durationLabel.trim(),
      totalMeals: Number(form.totalMeals),
      pricePerMeal: Number(form.pricePerMeal),
      frequencyLabel: form.frequencyLabel.trim(),
      sortOrder: form.sortOrder ? Number(form.sortOrder) : 0,
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await updatePlan(editingId, payload);
        toast.success("Plan updated");
      } else {
        await createPlan(payload);
        toast.success("Plan created");
      }
      closeForm();
      fetchPlans();
    } catch (error) {
      console.error("Save Duration Plan Error:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------
  // TOGGLE / DELETE
  // ---------------------------------------------------------------------
  const handleToggle = async (plan) => {
    setPlans((prev) =>
      prev.map((p) => (p._id === plan._id ? { ...p, isActive: !p.isActive } : p))
    );
    try {
      await togglePlanStatus(plan._id);
    } catch (error) {
      console.error("Toggle Error:", error);
      toast.error("Couldn't update status");
      setPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? { ...p, isActive: plan.isActive } : p))
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePlan(deleteTarget._id);
      toast.success("Plan deleted");
      setPlans((prev) => prev.filter((p) => p._id !== deleteTarget._id));
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Couldn't delete plan");
    } finally {
      setDeleteTarget(null);
    }
  };

  const groupedPlans = useMemo(() => {
    const groups = {};
    plans.forEach((plan) => {
      if (!groups[plan.durationLabel]) groups[plan.durationLabel] = [];
      groups[plan.durationLabel].push(plan);
    });
    return groups;
  }, [plans]);

  return (
    <div className="min-h-screen bg-[#f9f9fb] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
              Duration Plans
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Set how long a plan runs, how many meals it includes, and the price per meal.
              These show up as duration options on the customer's checkout page.
            </p>
          </div>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 bg-[#dc2626] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl shadow-sm shadow-red-600/20 transition-all active:scale-[0.98] focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Duration Plan
          </button>
        </div>

        {/* ---------------- LOADING STATE ---------------- */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-4 h-32 animate-pulse" />
            ))}
          </div>
        )}

        {/* ---------------- EMPTY STATE ---------------- */}
        {!loading && plans.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#dc2626] flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800">No duration plans yet</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Add your first plan — like "Weekly" with 4 meals at $12.50 each.
            </p>
            <button
              onClick={openCreateForm}
              className="text-xs font-bold text-[#dc2626] hover:underline"
            >
              + Add Duration Plan
            </button>
          </div>
        )}

        {/* ---------------- PLANS GROUPED BY DURATION LABEL ---------------- */}
        {!loading && plans.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedPlans).map(([label, groupPlans]) => (
              <div key={label}>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupPlans
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                    .map((plan) => {
                      const totalPrice =
                        plan.totalPrice ?? Number((plan.pricePerMeal * plan.totalMeals).toFixed(2));

                      return (
                        <div
                          key={plan._id}
                          className={`relative bg-white rounded-2xl border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all ${
                            plan.isActive ? "border-gray-200/80" : "border-gray-200/60 opacity-60"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-2xl font-black text-gray-900 leading-none">
                                {plan.totalMeals}
                                <span className="text-xs font-bold text-gray-400 ml-1">meals</span>
                              </div>
                              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mt-1">
                                {plan.frequencyLabel}
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                                plan.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {plan.isActive ? "Active" : "Hidden"}
                            </span>
                          </div>

                          <div className="bg-[#f4f5f7] rounded-xl p-2.5 mt-3 space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                              <span>Per meal</span>
                              <span className="text-gray-700">${plan.pricePerMeal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                              <span className="text-[11px] font-black text-gray-800 uppercase tracking-wide">
                                Total
                              </span>
                              <span className="text-base font-black text-[#dc2626]">
                                ${totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-3">
                            <button
                              onClick={() => openEditForm(plan)}
                              className="flex-1 text-[11px] font-bold text-gray-600 hover:text-[#dc2626] bg-gray-50 hover:bg-red-50 rounded-lg py-1.5 transition-all focus:outline-none"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggle(plan)}
                              className="flex-1 text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg py-1.5 transition-all focus:outline-none"
                            >
                              {plan.isActive ? "Hide" : "Show"}
                            </button>
                            <button
                              onClick={() => setDeleteTarget(plan)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
                              aria-label="Delete plan"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79l-.622 10.72a2.25 2.25 0 01-2.244 2.13H7.638a2.25 2.25 0 01-2.244-2.13L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.956.397a48.11 48.11 0 013.478-.397m0 0V4.67c0-1.03.83-1.874 1.86-1.913a45.62 45.62 0 013.28 0c1.03.04 1.86.883 1.86 1.913v.816m-6 0a48.667 48.667 0 017.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
                {editingId ? "Edit Duration Plan" : "New Duration Plan"}
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
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Duration Label
                </label>
                <input
                  type="text"
                  value={form.durationLabel}
                  onChange={(e) => handleChange("durationLabel", e.target.value)}
                  placeholder="e.g. Weekly, Monthly, Fortnightly"
                  className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                    formErrors.durationLabel
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                  }`}
                />
                {formErrors.durationLabel && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.durationLabel}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  This is what customers see as a tab — e.g. "Weekly", "Monthly". You can group
                  multiple meal-count options under the same label.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Total Meals
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.totalMeals}
                    onChange={(e) => handleChange("totalMeals", e.target.value)}
                    placeholder="4"
                    className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                      formErrors.totalMeals
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                    }`}
                  />
                  {formErrors.totalMeals && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.totalMeals}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Price / Meal ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.pricePerMeal}
                    onChange={(e) => handleChange("pricePerMeal", e.target.value)}
                    placeholder="12.50"
                    className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                      formErrors.pricePerMeal
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                    }`}
                  />
                  {formErrors.pricePerMeal && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.pricePerMeal}</p>
                  )}
                </div>
              </div>

              <div className="bg-[#f4f5f7] rounded-xl p-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Total Price (auto-calculated)
                </span>
                <span className="text-lg font-black text-[#dc2626]">
                  {livePreviewTotal ? `$${livePreviewTotal}` : "—"}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Frequency Label
                </label>
                <input
                  type="text"
                  value={form.frequencyLabel}
                  onChange={(e) => handleChange("frequencyLabel", e.target.value)}
                  placeholder="e.g. 4 Meals / Week"
                  className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                    formErrors.frequencyLabel
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                  }`}
                />
                {formErrors.frequencyLabel && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.frequencyLabel}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  Small caption shown under the meal count on the customer's plan card.
                </p>
              </div>

              {/* <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Sort Order <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => handleChange("sortOrder", e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Lower numbers show first among cards with the same duration label.
                </p>
              </div> */}
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
                {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Plan"}
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
            <h3 className="text-sm font-black text-gray-900">Delete this plan?</h3>
            <p className="text-xs text-gray-500 mt-1.5 mb-4">
              "{deleteTarget.durationLabel} — {deleteTarget.totalMeals} meals" will be removed
              permanently and will no longer appear on the customer's checkout page.
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