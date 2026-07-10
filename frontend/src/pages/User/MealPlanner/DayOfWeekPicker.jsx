import { useState } from "react";
import { toast } from "react-hot-toast";
import { isSelectableDate, formatDateKey } from "./constants";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const weekdayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getDaysInMonth = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(new Date(year, month, d));
  return days;
};

// ================= COMPONENT: DELIVERY DATE PICKER =================
// Lets the user pick any date within their subscription's validity window
// (startDate..endDate) - past dates and dates beyond the plan are disabled.
const DayOfWeekPicker = ({ selectedDate, setSelectedDate, subscription }) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(selectedDate || Date.now()));

  const subStart = subscription?.startDate ? new Date(subscription.startDate) : null;
  const subEnd = subscription?.endDate ? new Date(subscription.endDate) : null;
  if (subStart) subStart.setHours(0, 0, 0, 0);
  if (subEnd) subEnd.setHours(0, 0, 0, 0);

  const selectedKey = selectedDate ? formatDateKey(selectedDate) : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          className="p-1 hover:bg-red-50 rounded-lg text-[#E31A1A]"
        >
          &larr;
        </button>
        <span className="text-xs font-black text-[#1B254B] uppercase tracking-wide">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          className="p-1 hover:bg-red-50 rounded-lg text-[#E31A1A]"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekdayHeaders.map((d) => (
          <span key={d} className="text-[10px] font-bold text-[#A3AED0] uppercase">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {getDaysInMonth(currentMonth).map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;

          const key = formatDateKey(date);
          const isSelected = selectedKey === key;
          const selectable = isSelectableDate(date, subscription);

          return (
            <button
              key={key}
              type="button"
              disabled={selectable ? undefined : true}
              onClick={() => {
                if (!selectable) {
                  toast.error(
                    subEnd && date > subEnd
                      ? "This date is outside your plan's validity period."
                      : "You can't schedule meals for a past date."
                  );
                  return;
                }
                setSelectedDate(date);
              }}
              className={`text-xs p-1.5 rounded-lg font-bold transition-all focus:outline-none
                ${selectable ? "text-[#1B254B] hover:bg-gray-100" : "text-gray-200 cursor-not-allowed"}
                ${isSelected ? "bg-[#E31A1A] text-white! shadow-sm" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayOfWeekPicker;
