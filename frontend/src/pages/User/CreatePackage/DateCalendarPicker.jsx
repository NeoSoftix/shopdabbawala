import { useState } from "react";
import { CalendarDays } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Self-contained date-math; kept separate from OrdersCalendar's grid helper
// since that component also tracks per-day order counts (different concern),
// so full sharing isn't a clean fit here.
const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
};

// Start-date field + calendar popover. `showCalendar`/`currentMonth` are
// purely local UI state — only the resolved `value` (formatted date string)
// is surfaced to the parent via onChange.
export default function DateCalendarPicker({ value, onChange }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="relative">
      <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
        <CalendarDays size={13} /> Start Date
      </label>
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full bg-white border border-gray-300 rounded-xl p-2.5 flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer hover:border-[#dc2626] transition-all"
      >
        <span className={value ? "text-gray-900 font-bold" : "text-gray-400"}>
          {value ? value : "Select Delivery Start Date"}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#dc2626]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      </div>

      {showCalendar && (
        <div className="absolute left-0 top-full mt-2 z-50 w-[300px] max-w-[90vw] bg-white border border-red-100 shadow-2xl rounded-2xl p-4 border-t-4 border-t-[#dc2626]">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-1 hover:bg-red-50 rounded-lg text-[#dc2626]"
            >
              &larr;
            </button>
            <span className="text-xs font-black text-gray-800 uppercase tracking-wide">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-1 hover:bg-red-50 rounded-lg text-[#dc2626]"
            >
              &rarr;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysOfWeek.map(day => (
              <span key={day} className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {getDaysInMonth(currentMonth).map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} />;

              const dayStr = String(date.getDate()).padStart(2, '0');
              const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
              const yearStr = date.getFullYear();
              const formattedDate = `${dayStr} ${monthStr} ${yearStr}`;

              const isSelected = value === formattedDate;
              const isPast = date < new Date().setHours(0, 0, 0, 0);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onChange(formattedDate);
                    setShowCalendar(false);
                  }}
                  className={`text-[11px] p-1.5 rounded-lg font-bold transition-all focus:outline-none
                    ${isPast ? "text-gray-200 cursor-not-allowed" : "text-gray-700 hover:bg-red-50 hover:text-[#dc2626]"}
                    ${isSelected ? "bg-[#dc2626] !text-white shadow-md shadow-red-600/20" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
