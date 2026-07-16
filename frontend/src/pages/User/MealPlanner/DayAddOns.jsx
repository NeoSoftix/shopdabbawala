import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { getActiveAddOns } from "../../../services/addOn.service";
import { createDayAddonCheckout } from "../../../services/payment.service";
import QuantityStepper from "../../../components/shared/QuantityStepper";
import { FALLBACK_ADDON_IMAGE } from "../../../components/User/AddOnsSection/addOnsUtils";
import { longDate } from "./constants";

// Lets the user pile extra "add-on" items (charged separately from the plan)
// onto a day that already has a regular meal scheduled. Selections are
// per-day; confirming redirects to a dedicated Stripe checkout for just
// those add-ons - they only actually get attached to the day's order once
// paid (see backend payment/dayAddonCheckout.js + fulfillDayAddonOrder.js).
const DayAddOns = ({
  selectedDate,
  selectedDateKey,
  subscriptionId,
  hasScheduledMeal,
  savedDayAddons,
}) => {
  const [addOns, setAddOns] = useState([]);
  const [loadingAddOns, setLoadingAddOns] = useState(true);
  const [selection, setSelection] = useState({}); // { [addonId]: qty } - new, unpaid selections only
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    getActiveAddOns()
      .then((res) => {
        if (res.success) setAddOns(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch add-ons", err))
      .finally(() => setLoadingAddOns(false));
  }, []);

  // Switching days resets the in-progress (unpaid) selection - it's a fresh
  // cart for whichever day is now selected.
  useEffect(() => {
    setSelection({});
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

  const newTotal = Object.entries(selection).reduce((sum, [addonId, qty]) => {
    const addon = addOns.find((a) => a._id === addonId);
    return sum + (addon?.price || 0) * qty;
  }, 0);

  const alreadyPaidAddons = savedDayAddons?.addons || [];
  const alreadyPaidTotal = savedDayAddons?.extraCharge || 0;

  const handleCheckout = async () => {
    if (!subscriptionId) return;

    const addons = Object.entries(selection).map(([id, quantity]) => ({ id, quantity }));
    if (addons.length === 0) {
      toast.error("Select at least one add-on first.");
      return;
    }

    setCheckingOut(true);
    try {
      const res = await createDayAddonCheckout({
        subscriptionId,
        date: selectedDateKey,
        addons,
      });

      if (res?.success && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        toast.error(res?.message || "Could not start payment.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not start payment.");
    } finally {
      setCheckingOut(false);
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
            Want something extra? Add it here — extra charges apply separately from your plan
            and are paid for right away. It'll be delivered along with {longDate(selectedDate)}'s meal.
          </p>
        </div>
      </div>

      {!hasScheduledMeal ? (
        <p className="text-xs italic text-gray-400 py-2">
          Schedule a meal for this day first, then you can add extras to it.
        </p>
      ) : (
        <>
          {alreadyPaidAddons.length > 0 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Already Purchased</span>
                <span className="text-xs font-bold text-emerald-700">${alreadyPaidTotal.toFixed(2)}</span>
              </div>
              {alreadyPaidAddons.map((a, i) => (
                <div key={a.addonId || i} className="flex items-center justify-between text-xs text-emerald-800">
                  <span>{a.name} x{a.qty}</span>
                  <span>${(a.price * a.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {loadingAddOns ? (
            <p className="text-xs text-gray-400 py-2">Loading add-ons...</p>
          ) : addOns.length === 0 ? (
            <p className="text-xs italic text-gray-400 py-2">No add-ons available right now.</p>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
                {addOns.map((addon) => (
                  <div
                    key={addon._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <img
                        src={addon.image?.url || FALLBACK_ADDON_IMAGE}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                        onError={(e) => { e.target.src = FALLBACK_ADDON_IMAGE; e.target.onerror = null; }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#1B254B] truncate">{addon.name}</p>
                        <p className="text-xs font-semibold text-[#A3AED0]">${addon.price}</p>
                      </div>
                    </div>

                    <QuantityStepper
                      value={selection[addon._id] || 0}
                      min={0}
                      onChange={(qty) => updateQty(addon._id, qty)}
                      size="md"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs font-bold text-[#1B254B] uppercase tracking-wider">
                  New Total: <span className="text-amber-600">${newTotal.toFixed(2)}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkingOut || newTotal === 0}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs px-5 py-2.5 rounded-xl tracking-wider shadow-sm transition-all"
                >
                  {checkingOut ? "REDIRECTING..." : "PAY & ADD"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DayAddOns;
