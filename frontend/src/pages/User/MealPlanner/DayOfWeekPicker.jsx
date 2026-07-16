import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { formatDateKey, weekdayLabel, mondayOf, isPastDate } from "./constants";

// ================= COMPONENT: DELIVERY DATE PICKER =================
// Always shows the current week (Mon-Sun) so the user can see every day of
// "this week" even before the admin has published a menu for it, PLUS any
// other date the admin has configured a menu for (e.g. a published next
// week). One week is shown at a time, paged with prev/next arrows. Days
// with no menu yet are still clickable (the builder below shows "No Menu
// Available" for them). Past dates are shown too (read-only history).
const DayOfWeekPicker = ({ selectedDate, onSelectDate, dayStatus, availableDates }) => {
  const availableKeySet = useMemo(() => new Set(availableDates), [availableDates]);

  const activeDays = useMemo(() => {
    const byKey = new Map();

    // Current week's 7 days, always shown.
    const monday = mondayOf(new Date());
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      byKey.set(formatDateKey(d), d);
    }

    // Every date the admin has actually configured a menu for, in any week.
    availableDates.forEach((dateStr) => {
      const [y, m, d] = dateStr.split("-");
      const date = new Date(y, m - 1, d);
      byKey.set(formatDateKey(date), date);
    });

    return Array.from(byKey.values()).sort((a, b) => a - b);
  }, [availableDates]);

  // Bucket days into weeks (Monday-start), sorted chronologically.
  const weeks = useMemo(() => {
    const buckets = new Map();
    activeDays.forEach((date) => {
      const weekKey = formatDateKey(mondayOf(date));
      if (!buckets.has(weekKey)) buckets.set(weekKey, []);
      buckets.get(weekKey).push(date);
    });
    return Array.from(buckets.entries()).sort(([a], [b]) => (a < b ? -1 : 1));
  }, [activeDays]);

  const todayWeekKey = formatDateKey(mondayOf(new Date()));
  const selectedKey = selectedDate ? formatDateKey(selectedDate) : null;

  const [weekIndex, setWeekIndex] = useState(0);

  // Keep the visible week in sync with whichever week the selected date
  // (or, failing that, today) actually falls in.
  useEffect(() => {
    if (weeks.length === 0) return;
    const targetKey = selectedKey ? formatDateKey(mondayOf(selectedDate)) : todayWeekKey;
    const idx = weeks.findIndex(([weekKey]) => weekKey === targetKey);
    setWeekIndex(idx >= 0 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks.length]);

  // Snap to a valid date if the current selection isn't in the list -
  // prefer the earliest non-past date (today/future) since past dates are
  // only shown for read-only history, not as a sensible default.
  useEffect(() => {
    if (activeDays.length === 0) return;
    const stillValid = activeDays.some((d) => formatDateKey(d) === selectedKey);
    if (!stillValid) {
      const firstUpcoming = activeDays.find((d) => !isPastDate(d));
      onSelectDate(firstUpcoming || activeDays[activeDays.length - 1]);
    }
  }, [activeDays, selectedKey, onSelectDate]);

  if (weeks.length === 0) return null;

  const safeIndex = Math.min(weekIndex, weeks.length - 1);
  const [, days] = weeks[safeIndex];

  const today = new Date();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-2 sm:p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-w-0">
      {/* TODAY label block */}
      <div className="px-2 sm:px-3 pt-1 pb-2 sm:pb-3">
        <p className="text-[11px] text-[#E31A1A] font-bold uppercase tracking-wider mb-1">Today</p>
        <p className="text-xs sm:text-sm font-bold text-[#1B254B] whitespace-nowrap">
          {weekdayLabel(today).substring(0,3).toUpperCase()}, {today.getDate()} {today.toLocaleDateString("en-US", { month: "short" })} {today.getFullYear()}
        </p>
      </div>

      {/* Week row: grid-cols-7 guarantees the whole week stays visible at any width */}
      <div className="flex items-center gap-1 min-w-0">
        <button
          type="button"
          onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
          disabled={safeIndex === 0}
          className="shrink-0 w-5 sm:w-8 h-12 flex items-center justify-center text-gray-400 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 min-w-0">
          {days.map((date) => {
            const key = formatDateKey(date);
            const isSelected = selectedKey === key;
            const status = dayStatus[key]?.status;
            const isPast = isPastDate(date);
            const hasMenu = availableKeySet.has(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDate(date)}
                title={hasMenu ? undefined : "No menu published for this day yet"}
                className={`relative flex flex-col items-center justify-center w-full h-12 sm:h-16 min-w-0 rounded-lg sm:rounded-xl transition-all focus:outline-none overflow-hidden
                  ${isSelected ? "bg-[#E31A1A] text-white shadow-md shadow-red-200/50" : isPast ? "bg-white text-gray-300 opacity-60" : hasMenu ? "bg-white text-[#1B254B] hover:bg-gray-50" : "bg-white text-gray-300"}
                `}
              >
                <span className={`text-[8px] sm:text-[11px] uppercase font-semibold mb-0.5 sm:mb-1 whitespace-nowrap ${isSelected ? "text-white/90" : "text-gray-400"}`}>
                  {weekdayLabel(date).substring(0,3)}
                </span>
                <span className={`text-[11px] sm:text-sm font-bold whitespace-nowrap ${isSelected ? "text-white" : "text-[#1B254B]"}`}>{date.getDate()}</span>
                {isPast && !isSelected && (
                  <Lock size={9} className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 opacity-60" />
                )}
                {status === "confirmed" && !isSelected && !isPast && (
                  <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setWeekIndex((i) => Math.min(weeks.length - 1, i + 1))}
          disabled={safeIndex === weeks.length - 1}
          className="shrink-0 w-5 sm:w-8 h-12 flex items-center justify-center text-gray-400 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default DayOfWeekPicker;
