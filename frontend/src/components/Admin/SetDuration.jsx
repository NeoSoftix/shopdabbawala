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
import { getActiveMealTiers } from "../../services/mealTier.service.js";

import { emptyForm } from "./SetDuration/constants.js";
import DurationPlansHeader from "./SetDuration/DurationPlansHeader.jsx";
import PlanListSection from "./SetDuration/PlanListSection.jsx";
import DurationFormPanel from "./SetDuration/DurationFormPanel.jsx";
import DeleteConfirmModal from "./SetDuration/DeleteConfirmModal.jsx";

export default function SetDuration() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [mealTiers, setMealTiers] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---------------------------------------------------------------------
  // FETCH PLANS + MEAL TIERS
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

  const fetchMealTiers = async () => {
    try {
      const res = await getActiveMealTiers();
      setMealTiers(res.data || []);
    } catch (error) {
      console.error("Fetch Meal Tiers Error:", error);
      toast.error("Couldn't load meal tiers");
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchMealTiers();
  }, []);

  // Meal tiers async load hote hain — agar form pehle se khula hai (e.g. tab
  // background mein load ho raha tha) to naye tiers ke liye missing rows fill karo
  // bina existing typed values ko chhue.
  useEffect(() => {
    if (!isFormOpen || mealTiers.length === 0) return;
    setForm((prev) => {
      const merged = { ...prev.tierPricing };
      let changed = false;
      mealTiers.forEach((tier) => {
        if (!merged[tier._id]) {
          merged[tier._id] = { pricePerMeal: "", discountPercentage: "0" };
          changed = true;
        }
      });
      return changed ? { ...prev, tierPricing: merged } : prev;
    });
  }, [mealTiers, isFormOpen]);

  // Har active tier ke liye empty price rows bana ke deta hai — naya plan
  // banate waqt ya edit karte waqt jo tiers plan mein already saved nahi hain
  // unke liye default fallback.
  const buildEmptyTierPricing = () =>
    Object.fromEntries(mealTiers.map((t) => [t._id, { pricePerMeal: "", discountPercentage: "0" }]));

  // ---------------------------------------------------------------------
  // FORM HANDLERS
  // ---------------------------------------------------------------------
  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, tierPricing: buildEmptyTierPricing() });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (plan) => {
    setEditingId(plan._id);

    const tierPricing = buildEmptyTierPricing();
    (plan.tierPricing || []).forEach((entry) => {
      const tierId = entry.mealTier?._id || entry.mealTier;
      if (tierId) {
        tierPricing[tierId] = {
          pricePerMeal: String(entry.pricePerMeal),
          discountPercentage: String(entry.discountPercentage ?? 0),
        };
      }
    });

    setForm({
      durationLabel: plan.durationLabel,
      totalMeals: String(plan.totalMeals),
      durationDays: String(plan.durationDays ?? ""),
      frequencyLabel: plan.frequencyLabel,
      sortOrder: String(plan.sortOrder ?? 0),
      labelOrder: String(plan.labelOrder ?? 0),
      tierPricing,
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

  const handleTierPriceChange = (tierId, field, value) => {
    setForm((prev) => ({
      ...prev,
      tierPricing: {
        ...prev.tierPricing,
        [tierId]: { ...prev.tierPricing[tierId], [field]: value },
      },
    }));
    setFormErrors((prev) => ({ ...prev, [`tier_${tierId}`]: undefined }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.durationLabel.trim()) errors.durationLabel = "Duration label is required";
    if (!form.totalMeals || Number(form.totalMeals) <= 0) errors.totalMeals = "Enter a positive number";
    if (!form.durationDays || Number(form.durationDays) <= 0) errors.durationDays = "Enter a positive number of days";
    if (!form.frequencyLabel.trim()) errors.frequencyLabel = "Frequency label is required";

    mealTiers.forEach((tier) => {
      const row = form.tierPricing[tier._id] || {};
      if (!row.pricePerMeal || Number(row.pricePerMeal) <= 0) {
        errors[`tier_${tier._id}`] = "Enter a positive price";
      } else if (
        row.discountPercentage !== "" &&
        (Number(row.discountPercentage) < 0 || Number(row.discountPercentage) > 100)
      ) {
        errors[`tier_${tier._id}`] = "Discount must be between 0 and 100";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      durationLabel: form.durationLabel.trim(),
      totalMeals: Number(form.totalMeals),
      durationDays: Number(form.durationDays),
      frequencyLabel: form.frequencyLabel.trim(),
      sortOrder: form.sortOrder ? Number(form.sortOrder) : 0,
      labelOrder: form.labelOrder,
      tierPricing: mealTiers.map((tier) => ({
        mealTier: tier._id,
        pricePerMeal: Number(form.tierPricing[tier._id]?.pricePerMeal),
        discountPercentage: form.tierPricing[tier._id]?.discountPercentage
          ? Number(form.tierPricing[tier._id].discountPercentage)
          : 0,
      })),
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
        mealTiers={mealTiers}
        onChange={handleChange}
        onTierPriceChange={handleTierPriceChange}
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
