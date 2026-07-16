import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getActiveAddOns } from "../../../services/addOn.service";
import { createDayAddonCheckout } from "../../../services/payment.service";
import QuantityStepper from "../../../components/shared/QuantityStepper";
import { FALLBACK_ADDON_IMAGE } from "../../../components/User/AddOnsSection/addOnsUtils";

// Lets the user pile extra "add-on" items (charged separately from the plan)
// onto a day that already has a regular meal scheduled. Selections are
// per-day; confirming redirects to a dedicated Stripe checkout for just
// those add-ons - they only actually get attached to the day's order once
// paid (see backend payment/dayAddonCheckout.js + fulfillDayAddonOrder.js).
const DayAddOns = ({
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
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col h-full overflow-hidden">
      <div className="bg-[#E31A1A] px-5 py-5 rounded-t-[24px]">
        <h3 className="text-sm font-bold text-white tracking-wider uppercase">Add Ons</h3>
        <p className="text-[11px] font-medium text-white/80 mt-1">
          Extra items billed separately
        </p>
      </div>

      <div className="flex flex-col flex-1">
      {!hasScheduledMeal ? (
        <p className="text-xs italic text-gray-400 p-5">
          Schedule a meal for this day first, then you can add extras to it.
        </p>
      ) : (
        <>
          {alreadyPaidAddons.length > 0 && (
            <div className="px-5 py-4 bg-[#f9fafb] border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider">Already Purchased</span>
                <span className="text-sm font-bold text-[#1B254B]">${alreadyPaidTotal.toFixed(2)}</span>
              </div>
              {alreadyPaidAddons.map((a, i) => (
                <div key={a.addonId || i} className="flex items-center justify-between text-xs text-[#1B254B]">
                  <span>{a.name} x{a.qty}</span>
                  <span className="text-gray-400">${(a.price * a.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {loadingAddOns ? (
            <p className="text-xs text-gray-400 p-5">Loading add-ons...</p>
          ) : addOns.length === 0 ? (
            <p className="text-xs italic text-gray-400 p-5">No add-ons available right now.</p>
          ) : (
            <div className="flex flex-col flex-1 h-full">
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {addOns.map((addon) => (
                  <div
                    key={addon._id}
                    className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-50"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <img
                        src={addon.image?.url || FALLBACK_ADDON_IMAGE}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover shrink-0"
                        onError={(e) => { e.target.src = FALLBACK_ADDON_IMAGE; e.target.onerror = null; }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#1B254B] truncate">{addon.name}</p>
                        <p className="text-xs font-bold text-[#E31A1A] mt-0.5">${addon.price}</p>
                      </div>
                    </div>

                    <QuantityStepper
                      value={selection[addon._id] || 0}
                      min={0}
                      onChange={(qty) => updateQty(addon._id, qty)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>

              <div className="p-5 bg-white border-t border-gray-100 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-[#1B254B]">
                    New Total
                  </span>
                  <span className="text-base font-bold text-[#1B254B]">
                    ${newTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkingOut || newTotal === 0}
                  className={`w-full font-bold text-xs py-3.5 rounded-xl tracking-wider transition-all ${
                    newTotal > 0 
                      ? 'bg-[#E31A1A] hover:bg-red-700 text-white shadow-sm' 
                      : 'bg-[#f4f7fe] text-[#A3AED0]'
                  }`}
                >
                  {checkingOut ? "REDIRECTING..." : "PAY & ADD"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default DayAddOns;
