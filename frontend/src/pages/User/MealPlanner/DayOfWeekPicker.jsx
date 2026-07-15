import { useEffect, useMemo } from "react";
import { formatDateKey, weekdayLabel, shortDate, mondayOf, isPastDate } from "./constants";

// ================= COMPONENT: DELIVERY DATE PICKER =================
// Shows every day the admin has configured a menu for, grouped by week (so
// a published "next week" menu is visually distinct from the current one).
// Past dates are still shown (read-only history) but greyed out and locked.
const DayOfWeekPicker = ({ selectedDate, onSelectDate, dayStatus, availableDates }) => {
  const activeDays = useMemo(() => {
    return availableDates
      .map((dateStr) => {
        const [y, m, d] = dateStr.split("-");
        return new Date(y, m - 1, d);
      })
      .sort((a, b) => a - b);
  }, [availableDates]);

  // Bucket days into weeks (Monday-start) so each week renders as its own row.
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

  if (activeDays.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center text-xs font-medium text-[#A3AED0]">
        No menus available right now.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 space-y-3">
      {weeks.map(([weekKey, days]) => (
        <div key={weekKey}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#A3AED0] mb-1.5 px-1">
            {weekKey === todayWeekKey
              ? "This Week"
              : `Week of ${shortDate(days[0])} – ${shortDate(days[days.length - 1])}`}
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {days.map((date) => {
              const key = formatDateKey(date);
              const isSelected = selectedKey === key;
              const status = dayStatus[key]?.status;
              const isPast = isPastDate(date);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`relative flex flex-col items-center justify-center shrink-0 w-16 py-2.5 rounded-xl font-bold transition-all focus:outline-none
                    ${isSelected ? "bg-[#E31A1A] text-white shadow-sm" : isPast ? "bg-gray-50 text-gray-400 border border-gray-100" : "bg-gray-50 text-[#1B254B] hover:bg-gray-100 border border-gray-100"}
                  `}
                >
                  <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">
                    {weekdayLabel(date)}
                  </span>
                  <span className="text-sm">{date.getDate()}</span>
                  {isPast && !isSelected && (
                    <span className="absolute top-1 right-1 text-[8px]">🔒</span>
                  )}
                  {status === "confirmed" && !isSelected && !isPast && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayOfWeekPicker;
