import { FaTrashCan } from "react-icons/fa6";
import { X, ArrowRight } from "lucide-react";

// ================= COMPONENT: SELECTED DAY PLAN SLOTS =================
const DayPlanSlots = ({
  selectedDay,
  totalSlots,
  totalSelectedMeals,
  expandedDayMeals,
  onRemoveOne,
  onSubmit,
  submitting,
}) => {
  return (
    <>
      <div className="pt-1">
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-[#1B254B] border-b border-gray-100 pb-2 mb-3">
          <span className="uppercase text-[#A3AED0]">
            Your Plan ({selectedDay})
          </span>
          <span className="text-gray-500">
            {totalSelectedMeals} / {totalSlots} Items
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-[160px]">
          {Array.from({ length: totalSlots }).map((_, index) => {
            const item = expandedDayMeals[index];

            if (item) {
              return (
                <div
                  key={`${item._id}-${index}`}
                  className="flex flex-col justify-between bg-white p-2 rounded-xl border border-gray-100 relative group min-h-[90px] sm:min-h-[110px]"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      onRemoveOne(
                        selectedDay,
                        item._id,
                      );
                    }}
                    className="absolute top-1 right-1 text-gray-300 hover:text-red-500 p-1 z-10 bg-white rounded-full shadow-sm"
                  >
                    <FaTrashCan size={11} />
                  </button>

                  <div className="space-y-1.5 text-center mt-2 flex flex-col items-center">
                    <img
                      src={
                        item.image?.url ||
                        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={item.name}
                      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = "https://placehold.co/80x80?text=Meal"; e.target.onerror = null; }}
                    />

                    <div className="w-full px-0.5">
                      <p className="text-xs font-bold text-[#1B254B] truncate leading-tight">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`empty-${index}`}
                className="flex flex-col items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-2 h-[90px] sm:h-[110px] text-center"
              >
                <span className="text-gray-300">
                  <X size={16} />
                </span>

                <span className="text-[#A3AED0] text-[10px] sm:text-xs font-bold tracking-tight uppercase mt-0.5">
                  Empty
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="w-full sm:w-auto bg-[#E31A1A] hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          {submitting ? "SUBMITTING..." : <>PREVIEW &amp; CONFIRM <ArrowRight size={14} /></>}
        </button>
      </div>
    </>
  );
};

export default DayPlanSlots;
