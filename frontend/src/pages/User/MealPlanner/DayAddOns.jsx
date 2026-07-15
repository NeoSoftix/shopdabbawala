import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { getActiveAddOns } from "../../../services/addOn.service";
import { updateDayAddons } from "../../../services/mealSchedule.service";
import QuantityStepper from "../../../components/shared/QuantityStepper";
import { longDate } from "./constants";

// Lets the user pile extra "add-on" items (charged separately from the plan
// itself) onto a day that already has a regular meal scheduled. Selections
// are per-day, saved independently from the meal items, and show their own
// extra-charge total.
const DayAddOns = ({
  selectedDate,
  selectedDateKey,
  subscriptionId,
  hasScheduledMeal,
  savedDayAddons,
  editLocked,
  onSaved,
}) => {
  const [addOns, setAddOns] = useState([]);
  const [loadingAddOns, setLoadingAddOns] = useState(true);
  const [selection, setSelection] = useState({}); // { [addonId]: qty }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getActiveAddOns()
      .then((res) => {
        if (res.success) setAddOns(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch add-ons", err))
      .finally(() => setLoadingAddOns(false));
  }, []);

  // Switching days: load whatever's already saved for the newly selected
  // day (or reset to empty if nothing's been saved for it yet).
  useEffect(() => {
    const next = {};
    (savedDayAddons?.addons || []).forEach((a) => {
      if (a.addonId) next[a.addonId] = a.qty;
    });
    setSelection(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateKey]);

  const updateQty = (addonId, qty) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[addonId];
      } else {
        next[addonId] = qty;
      }
      return next;
    });
  };

  const extraTotal = Object.entries(selection).reduce((sum, [addonId, qty]) => {
    const addon = addOns.find((a) => a._id === addonId);
    return sum + (addon?.price || 0) * qty;
  }, 0);

  const handleSave = async () => {
    if (!subscriptionId) return;

    setSaving(true);
    try {
      const payload = Object.entries(selection).map(([addonId, quantity]) => ({ addonId, quantity }));
      const res = await updateDayAddons({
        subscriptionId,
        date: selectedDateKey,
        addons: payload,
      });

      if (res?.success) {
        toast.success(`Add-ons for ${longDate(selectedDate)} saved!`);
        onSaved?.();
      } else {
        toast.error(res?.message || "Failed to save add-ons.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save add-ons.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-5 space-y-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <PlusCircle size={18} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[#1B254B] tracking-wider uppercase">Add Ons</h3>
          <p className="text-xs font-medium text-[#A3AED0] mt-0.5">
            Want something extra? Add it here — extra charges apply separately from your plan,
            and it'll be delivered along with {longDate(selectedDate)}'s meal.
          </p>
        </div>
      </div>

      {!hasScheduledMeal ? (
        <p className="text-xs italic text-gray-400 py-2">
          Schedule a meal for this day first, then you can add extras to it.
        </p>
      ) : loadingAddOns ? (
        <p className="text-xs text-gray-400 py-2">Loading add-ons...</p>
      ) : addOns.length === 0 ? (
        <p className="text-xs italic text-gray-400 py-2">No add-ons available right now.</p>
      ) : (
        <>
          {editLocked && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-xs font-semibold text-amber-700">
              Add-ons for this day can no longer be changed — changes are only allowed until 12 PM the day before.
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
            {addOns.map((addon) => (
              <div
                key={addon._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  {addon.image?.url ? (
                    <img
                      src={addon.image.url}
                      alt=""
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1B254B] truncate">{addon.name}</p>
                    <p className="text-xs font-semibold text-[#A3AED0]">${addon.price}</p>
                  </div>
                </div>

                <QuantityStepper
                  value={selection[addon._id] || 0}
                  min={0}
                  onChange={(qty) => !editLocked && updateQty(addon._id, qty)}
                  size="md"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs font-bold text-[#1B254B] uppercase tracking-wider">
              Extra Charge: <span className="text-amber-600">${extraTotal.toFixed(2)}</span>
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || editLocked}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs px-5 py-2.5 rounded-xl tracking-wider shadow-sm transition-all"
            >
              {saving ? "SAVING..." : "SAVE ADD-ONS"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DayAddOns;
