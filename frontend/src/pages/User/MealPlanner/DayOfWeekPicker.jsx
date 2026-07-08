import { daysOfWeek } from "./constants";

// ================= COMPONENT: DAY OF WEEK PICKER =================
const DayOfWeekPicker = ({ selectedDay, setSelectedDay }) => {
  return (
    <div className="grid grid-cols-7 gap-1">
      {daysOfWeek.map((day) => {
        const isSelected = selectedDay === day.name;
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => setSelectedDay(day.name)}
            className="flex flex-col items-center py-1.5 text-center focus:outline-none group"
          >
            <span className="text-[10px] sm:text-xs font-bold text-[#A3AED0] uppercase mb-1">
              {day.label}
            </span>
            <span
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${isSelected
                ? "bg-[#E31A1A] text-white shadow-sm"
                : "text-[#1B254B] hover:bg-gray-100"
                }`}
            >
              {day.date}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DayOfWeekPicker;
