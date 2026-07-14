import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Calendar, Utensils, Pencil, ListChecks, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateKey, weekdayLabel, shortDate, longDate, isBeyondSubscription, isPastDate, getActiveWeekRange } from "./constants";

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Badge color per Order.status - shown on any day that already has a
// confirmed order (Pending until the vendor progresses/delivers it).
const ORDER_STATUS_BADGE = {
  Pending: "bg-amber-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-red-500",
  Preparing: "bg-indigo-500",
  "On the way": "bg-blue-500",
  Delivered: "bg-green-600",
  Cancelled: "bg-slate-400",
};

const addDays = (d, n) => {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
};

const clampToSubscription = (date, subscription) => {
  const start = subscription?.startDate ? new Date(subscription.startDate) : null;
  const end = subscription?.endDate ? new Date(subscription.endDate) : null;
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);

  let d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (start && d < start) d = start;
  if (end && d > end) d = end;
  return d;
};

const Toggle = ({ checked, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
      disabled ? "bg-gray-100 cursor-not-allowed" : checked ? "bg-green-500" : "bg-gray-200"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

// ================= COMPONENT: WEEKLY PLAN MATRIX VIEW =================
// Shows a 7-day window that the user can page through (prev/next), bounded
// by the subscription's startDate..endDate so they can review/edit any date
// within their plan's validity, not just the current calendar week.
const WeeklyOverview = ({ weeklyPlan, dayStatus = {}, subscription, onToggleDayActive, setSelectedDate }) => {
  const [weekStart, setWeekStart] = useState(() =>
    getMonday(clampToSubscription(new Date(), subscription))
  );

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const [previewDate, setPreviewDate] = useState(() => clampToSubscription(new Date(), subscription));

  const subStart = subscription?.startDate ? new Date(subscription.startDate) : null;
  const subEnd = subscription?.endDate ? new Date(subscription.endDate) : null;
  if (subStart) subStart.setHours(0, 0, 0, 0);
  if (subEnd) subEnd.setHours(0, 0, 0, 0);

  const canGoPrev = !subStart || addDays(weekStart, -1) >= subStart;
  const canGoNext = !subEnd || addDays(weekStart, 7) <= subEnd;

  const previewKey = formatDateKey(previewDate);
  const previewItems = weeklyPlan[previewKey] || [];
  const previewStatus = dayStatus[previewKey];
  const previewActive = previewStatus?.active !== false;
  const previewOrderStatus = previewStatus?.status;
  const half = Math.ceil(previewItems.length / 2);
  const leftItems = previewItems.slice(0, half);
  const rightItems = previewItems.slice(half);

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-5 space-y-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Calendar size={16} />
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1B254B] tracking-wider uppercase">
              YOUR PLAN
            </h4>
            <p className="text-xs font-medium text-[#A3AED0]">
              {shortDate(weekDates[0])} - {shortDate(weekDates[6])}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => setWeekStart((prev) => addDays(prev, -7))}
            className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-[#1B254B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setWeekStart((prev) => addDays(prev, 7))}
            className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-[#1B254B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DAY CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekDates.map((date) => {
          const key = formatDateKey(date);
          const outOfRange = isPastDate(date) === false && isBeyondSubscription(date, subscription);
          const beforeStart = subStart && date < subStart;
          const disabledCell = outOfRange || beforeStart;

          const items = weeklyPlan[key] || [];
          const hasItems = items.length > 0;
          const status = dayStatus[key];
          const isActive = status?.active !== false;
          const orderStatus = status?.status;
          const isPreview = previewKey === key;
          const thumb = items.find((it) => it?.image?.url)?.image?.url;
          const visibleItems = items.slice(0, 2);
          const extraCount = items.length - visibleItems.length;

          return (
            <div
              key={key}
              onClick={() => !disabledCell && setPreviewDate(date)}
              className={`relative rounded-xl p-3 flex flex-col justify-between min-h-[150px] transition-all ${
                disabledCell
                  ? "border border-gray-50 bg-gray-50/50 opacity-50 cursor-not-allowed"
                  : "cursor-pointer " + (isPreview
                    ? "border-2 border-green-500 bg-green-50/40"
                    : "border border-gray-100 bg-white hover:border-green-200")
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-[#1B254B]">
                      {weekdayLabel(date)}
                    </span>
                    <span className="block text-[10px] font-medium text-[#A3AED0]">
                      {shortDate(date)}
                    </span>
                  </div>
                  {!disabledCell && (
                    <Toggle
                      checked={isActive}
                      disabled={!status}
                      onClick={() => onToggleDayActive && onToggleDayActive(key, !isActive)}
                    />
                  )}
                </div>

                {hasItems && (
                  <span className="inline-block text-[10px] font-bold bg-green-50 text-green-600 w-5 h-5 rounded-full text-center leading-5 mb-1.5">
                    {items.length}
                  </span>
                )}

                {hasItems ? (
                  <div className="space-y-0.5">
                    {visibleItems.map((item, i) => (
                      <div key={item?._id || i} className="flex items-center gap-1 text-[11px] font-semibold text-[#5B6478]">
                        <span className="w-1 h-1 rounded-full bg-[#A3AED0] shrink-0" />
                        <span className="truncate">{item?.name}</span>
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <span className="block text-[10px] font-bold text-[#A3AED0] pl-2.5">+{extraCount} more</span>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] italic text-gray-300 mt-2">
                    {disabledCell ? "Outside plan" : "No meals"}
                  </p>
                )}
              </div>

              {thumb && (
                <img
                  src={thumb}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover self-end mt-2 shadow-sm"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}

              {isPreview && (
                <span className="absolute left-1/2 -bottom-[9px] -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-green-500" />
              )}

              {ORDER_STATUS_BADGE[orderStatus] && (
                <div
                  className={`absolute inset-x-0 top-1/2 -translate-y-1/2 py-1.5 text-center text-sm sm:text-base font-black uppercase tracking-widest text-white shadow-md ${ORDER_STATUS_BADGE[orderStatus]}`}
                >
                  {orderStatus}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SELECTED DAY DETAIL PANEL */}
      <div className="bg-green-50/40 border border-green-100 rounded-[20px] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <Utensils size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-[#1B254B] uppercase tracking-tight">
                  {weekdayLabel(previewDate)}
                </h3>
                <span className="text-xs font-semibold text-[#A3AED0]">
                  {longDate(previewDate)}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    previewActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {previewActive ? "Active" : "Inactive"}
                </span>
                {ORDER_STATUS_BADGE[previewOrderStatus] && (
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white ${ORDER_STATUS_BADGE[previewOrderStatus]}`}
                  >
                    {previewOrderStatus}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-[#A3AED0] mt-0.5">
                {previewItems.length} meal{previewItems.length === 1 ? "" : "s"} planned
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const activeKeys = getActiveWeekRange(subscription).map(formatDateKey);
              if (!activeKeys.includes(formatDateKey(previewDate))) {
                toast.error("You can only schedule/edit meals within your current active week.");
                return;
              }
              setSelectedDate && setSelectedDate(previewDate);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-green-700 border border-green-200 hover:bg-green-100 px-4 py-2 rounded-xl transition-all shrink-0"
          >
            <Pencil size={13} />
            View / Edit Day
          </button>
        </div>

        {previewItems.length > 0 ? (
          <>
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#1B254B] uppercase tracking-wider">
                <ListChecks size={14} className="text-green-600" />
                Meals
              </span>
              <span className="text-[10px] font-bold bg-white text-green-600 px-2 py-0.5 rounded-full border border-green-100">
                {previewItems.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 divide-y sm:divide-y-0 divide-gray-100">
              <div className="space-y-2 sm:pr-6 sm:border-r sm:border-gray-100">
                {leftItems.map((item, i) => (
                  <div key={item?._id || i} className="flex items-center gap-3">
                    {item?.image?.url ? (
                      <img src={item.image.url} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <span className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 shrink-0"><Utensils size={16} /></span>
                    )}
                    <span className="flex-1 text-sm font-bold text-[#1B254B] truncate">{item?.name}</span>
                    <span className="text-xs font-semibold text-[#A3AED0] shrink-0">x{item?.quantity || 1}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2 sm:pt-0">
                {rightItems.map((item, i) => (
                  <div key={item?._id || i} className="flex items-center gap-3">
                    {item?.image?.url ? (
                      <img src={item.image.url} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <span className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 shrink-0"><Utensils size={16} /></span>
                    )}
                    <span className="flex-1 text-sm font-bold text-[#1B254B] truncate">{item?.name}</span>
                    <span className="text-xs font-semibold text-[#A3AED0] shrink-0">x{item?.quantity || 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-4 py-2.5">
              <Leaf size={14} className="text-green-500 shrink-0" />
              <span className="text-xs font-semibold text-[#5B6478]">Balanced choices for a wholesome day.</span>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p className="text-xs italic">No meals planned for this day yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyOverview;
