import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Utensils } from "lucide-react";
import { formatDateKey, weekdayLabel, mondayOf } from "./constants";

const STATUS_STYLES = {
  confirmed: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  paused: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabel = (dayStatus) => {
  if (!dayStatus) return "Pending";
  if (dayStatus.active === false) return "Paused";
  if (dayStatus.status) return dayStatus.status[0].toUpperCase() + dayStatus.status.slice(1);
  return "Pending";
};

const statusKey = (dayStatus) => {
  if (!dayStatus) return "pending";
  if (dayStatus.active === false) return "paused";
  return (dayStatus.status || "pending").toLowerCase();
};

// ================= COMPONENT: SCHEDULE PREVIEW =================
// Page 0 is always the current week (Mon-Sun), shown in full even for days
// with nothing scheduled yet - "one week's preview". Sliding forward past
// that only reveals days the user has actually scheduled (no empty
// placeholder weeks stretching into the future) - "Edit Meal Plan" hands
// off to the "Build Custom Meal" tab. Clicking a day expands a full preview
// below (every scheduled item, plus any paid add-ons for that day). Purely
// informational, no editing here.
const MySchedule = ({ weeklyPlan, dayStatus, dayAddOns, subscription, onEditPlan }) => {
  const [page, setPage] = useState(0);
  const [selectedKey, setSelectedKey] = useState(() => formatDateKey(new Date()));

  const currentWeek = useMemo(() => {
    const monday = mondayOf(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const currentWeekEnd = currentWeek[6];

  // Real scheduled dates after the current week, chunked into pages of 7.
  const futurePages = useMemo(() => {
    const futureKeys = Object.keys(weeklyPlan || {})
      .filter((key) => {
        const [y, m, d] = key.split("-");
        return new Date(y, m - 1, d) > currentWeekEnd;
      })
      .sort();

    const chunks = [];
    for (let i = 0; i < futureKeys.length; i += 7) {
      chunks.push(
        futureKeys.slice(i, i + 7).map((key) => {
          const [y, m, d] = key.split("-");
          return new Date(y, m - 1, d);
        })
      );
    }
    return chunks;
  }, [weeklyPlan, currentWeekEnd]);

  const pages = [currentWeek, ...futurePages];
  const safePage = Math.min(page, pages.length - 1);
  const days = pages[safePage];

  const todayKey = formatDateKey(new Date());
  const preference = subscription?.preference || "Veg";

  const selectedDate = useMemo(() => {
    const [y, m, d] = selectedKey.split("-");
    return new Date(y, m - 1, d);
  }, [selectedKey]);
  const selectedItems = weeklyPlan[selectedKey] || [];
  const selectedStatus = dayStatus[selectedKey];
  const selectedAddOns = dayAddOns?.[selectedKey]?.addons || [];
  const selectedAddOnsTotal = dayAddOns?.[selectedKey]?.extraCharge || 0;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <span className="w-10 h-10 rounded-full bg-red-50 text-[#e61e2d] flex items-center justify-center shrink-0">
          <CalendarDays size={18} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>
          <p className="text-gray-500 text-sm">
            {safePage === 0
              ? "This week's preview."
              : "Your upcoming scheduled meals."}
          </p>
        </div>
      </div>

      {/* MEAL PREVIEW CARDS */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={safePage === 0}
          className="shrink-0 w-8 h-40 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((date) => {
            const key = formatDateKey(date);
            const items = weeklyPlan[key] || [];
            const status = dayStatus[key];
            const badgeClass = STATUS_STYLES[statusKey(status)] || "bg-gray-100 text-gray-600";
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`flex flex-col rounded-2xl border p-3.5 text-left transition-colors ${
                  isSelected
                    ? "border-[#e61e2d] bg-red-50/40 ring-1 ring-[#e61e2d]/30"
                    : isToday
                    ? "border-[#e61e2d]/40"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-bold text-gray-900">
                    {weekdayLabel(date)} {date.getDate()}
                  </span>
                  {items.length > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}>
                      {statusLabel(status)}
                    </span>
                  )}
                </div>

                <div className="w-9 h-9 rounded-full bg-red-50 text-[#e61e2d] flex items-center justify-center my-2 mx-auto">
                  <Utensils size={15} />
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-2">No meal scheduled</p>
                ) : (
                  <>
                    <p className="text-xs font-bold text-gray-900 text-center mb-1.5 line-clamp-2">
                      {items[0].name}
                    </p>
                    {items.length > 1 && (
                      <ul className="text-[11px] text-gray-500 space-y-0.5 mb-2">
                        {items.slice(1).map((item, idx) => (
                          <li key={item._id || idx} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span
                      className={`mt-auto self-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        preference === "Veg" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {preference}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
          disabled={safePage >= pages.length - 1}
          className="shrink-0 w-8 h-40 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* SELECTED DAY DETAIL PREVIEW */}
      <div className="mt-4 rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="font-bold text-gray-900">
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="text-xs text-gray-400">Everything ordered for this day.</p>
          </div>
          {selectedItems.length > 0 && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[statusKey(selectedStatus)] || "bg-gray-100 text-gray-600"}`}>
              {statusLabel(selectedStatus)}
            </span>
          )}
        </div>

        {selectedItems.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No meal scheduled for this day.</p>
        ) : (
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Scheduled Items</p>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item, idx) => (
                <span
                  key={item._id || idx}
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-700"
                >
                  <Utensils size={12} className="text-[#e61e2d]" />
                  {item.name} <span className="text-gray-400 font-normal">x{item.quantity || 1}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedAddOns.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Add Ons</p>
            <div className="space-y-1.5">
              {selectedAddOns.map((addon, idx) => (
                <div
                  key={addon.addonId || idx}
                  className="flex items-center justify-between text-sm px-3 py-1.5 rounded-xl border border-amber-100 bg-amber-50/60"
                >
                  <span className="font-semibold text-gray-800">
                    {addon.name} <span className="text-gray-400 font-normal">x{addon.qty || 1}</span>
                  </span>
                  <span className="font-bold text-amber-700">${(addon.price * (addon.qty || 1)).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-end pt-1">
                <span className="text-xs font-bold text-amber-700">Add-ons total: ${selectedAddOnsTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER BANNER */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-red-50/60 border border-red-100/50 p-5">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-full bg-white text-[#e61e2d] flex items-center justify-center shrink-0">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className="font-bold text-gray-900 text-sm">This is a preview of your upcoming meals.</p>
            <p className="text-gray-500 text-sm">You can make changes to your plan anytime.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEditPlan}
          className="shrink-0 border border-[#e61e2d] text-[#e61e2d] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          EDIT MEAL PLAN
        </button>
      </div>
    </div>
  );
};

export default MySchedule;
