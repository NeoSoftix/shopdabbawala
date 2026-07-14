import { useEffect } from "react";
import { formatDateKey, getActiveWeekRange, weekdayLabel } from "./constants";

// ================= COMPONENT: DELIVERY DATE PICKER =================
// No calendar - the user can only ever schedule within their "current active
// week" (the day after their plan started through that week's Sunday, then
// every Monday..Sunday after that). Shows just those days as a row of
// day+date chips; everything outside that window simply isn't shown.
const DayOfWeekPicker = ({ selectedDate, setSelectedDate, subscription }) => {
  const activeDays = getActiveWeekRange(subscription);
  const selectedKey = selectedDate ? formatDateKey(selectedDate) : null;

  // If the currently selected date has rolled out of the active window
  // (e.g. the week changed since it was picked), snap to the first day of
  // the new window instead of leaving an unselectable date selected.
  useEffect(() => {
    if (activeDays.length === 0) return;
    const stillValid = activeDays.some((d) => formatDateKey(d) === selectedKey);
    if (!stillValid) {
      setSelectedDate(activeDays[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDays.map((d) => formatDateKey(d)).join(",")]);

  if (activeDays.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center text-xs font-medium text-[#A3AED0]">
        No schedulable days available right now.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {activeDays.map((date) => {
          const key = formatDateKey(date);
          const isSelected = selectedKey === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center shrink-0 w-14 py-2 rounded-xl font-bold transition-all focus:outline-none
                ${isSelected ? "bg-[#E31A1A] text-white shadow-sm" : "text-[#1B254B] hover:bg-gray-100"}
              `}
            >
              <span className="text-[10px] uppercase tracking-wide opacity-80">
                {weekdayLabel(date)}
              </span>
              <span className="text-sm">{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayOfWeekPicker;
