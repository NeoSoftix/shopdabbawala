import { useState, useEffect, useMemo } from "react";
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

import { emptyForm } from "./SetDuration/constants.js";
import DurationPlansHeader from "./SetDuration/DurationPlansHeader.jsx";
import PlanListSection from "./SetDuration/PlanListSection.jsx";
import DurationFormPanel from "./SetDuration/DurationFormPanel.jsx";
import DeleteConfirmModal from "./SetDuration/DeleteConfirmModal.jsx";

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
        <DurationPlansHeader onAddClick={openCreateForm} />

        <PlanListSection
          loading={loading}
          plans={plans}
          groupedPlans={groupedPlans}
          onAddClick={openCreateForm}
          onEdit={openEditForm}
          onToggle={handleToggle}
          onDeleteRequest={setDeleteTarget}
        />
      </div>

      {/* ADD / EDIT FORM — slide-over panel */}
      <DurationFormPanel
        isOpen={isFormOpen}
        editingId={editingId}
        form={form}
        formErrors={formErrors}
        submitting={submitting}
        livePreviewTotal={livePreviewTotal}
        onChange={handleChange}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        target={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
