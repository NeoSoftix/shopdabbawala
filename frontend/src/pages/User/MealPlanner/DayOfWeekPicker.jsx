import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { formatDateKey, weekdayLabel, shortDate, mondayOf, isPastDate } from "./constants";

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
  const [weekKey, days] = weeks[safeIndex];
  const weekLabel =
    weekKey === todayWeekKey
      ? "This Week"
      : `Week of ${shortDate(days[0])} – ${shortDate(days[days.length - 1])}`;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#A3AED0] mb-2 px-1">
        {weekLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
          disabled={safeIndex === 0}
          className="shrink-0 w-8 h-16 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 grid grid-cols-7 gap-2">
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
                className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl font-bold transition-all focus:outline-none
                  ${isSelected ? "bg-[#E31A1A] text-white shadow-sm" : isPast ? "bg-gray-50 text-gray-400 border border-gray-100" : hasMenu ? "bg-gray-50 text-[#1B254B] hover:bg-gray-100 border border-gray-100" : "bg-white text-gray-400 border border-dashed border-gray-200 hover:bg-gray-50"}
                `}
              >
                <span className="text-[10px] uppercase tracking-wide opacity-80 mb-1">
                  {weekdayLabel(date)}
                </span>
                <span className="text-sm">{date.getDate()}</span>
                {isPast && !isSelected && (
                  <Lock size={9} className="absolute top-1.5 right-1.5 opacity-60" />
                )}
                {status === "confirmed" && !isSelected && !isPast && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setWeekIndex((i) => Math.min(weeks.length - 1, i + 1))}
          disabled={safeIndex === weeks.length - 1}
          className="shrink-0 w-8 h-16 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DayOfWeekPicker;
