import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import {
  getAllMealTiers,
  toggleMealTierStatus,
  deleteMealTier,
} from "../../../services/mealTier.service.js";

// ---------------------------------------------------------------------
// Fetch, toggle & delete lifecycle for the meal tier list.
// ---------------------------------------------------------------------
export default function useMealTiers() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  return {
    tiers,
    loading,
    fetchTiers,
    handleToggle,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
  };
}
