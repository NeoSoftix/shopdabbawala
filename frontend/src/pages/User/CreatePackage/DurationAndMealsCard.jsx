import { CalendarDays, UtensilsCrossed } from "lucide-react";

// Duration tabs + Total Meals options. Duration tabs are dynamically
// generated from `uniqueDurationLabels` (not a fixed 2-option toggle), so
// they're kept as their own hand-rolled markup rather than forced into
// PillToggleGroup's fixed options-array model.
export default function DurationAndMealsCard({
  uniqueDurationLabels,
  duration,
  onDurationChange,
  currentOptions,
  totalMeals,
  onTotalMealsChange,
  selectedPlan,
}) {
  return (
    <div className="bg-white p-2.5 px-3 rounded-2xl border border-gray-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] space-y-3">
      <div>
        <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
          <CalendarDays size={13} /> Duration
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Dynamic labels generated from active db values */}
          {uniqueDurationLabels.map((lbl) => (
            <button
              type="button"
              key={lbl}
              onClick={() => onDurationChange(lbl)}
              className={`py-2 rounded-xl text-xs font-bold border text-center transition-all focus:outline-none ${duration === lbl ? "border-2 border-[#dc2626] text-[#dc2626] bg-red-50/20 font-black" : "border-gray-200 text-gray-400 bg-white hover:border-[#dc2626] hover:text-slate-800"}`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
          <UtensilsCrossed size={13} /> Total Meals
        </label>
        <div className="bg-[#f3f1f1] p-1 rounded-3xl border border-gray-200/40 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {/* Dynamic custom meal options mapping */}
          {currentOptions.map((option) => {
            const isSelected = totalMeals === option.totalMeals;
            const tierPrice = option.tierPricing?.find(
              (t) => t.mealTier?.name?.trim().toLowerCase() === selectedPlan?.trim().toLowerCase()
            );
            const originalPrice = tierPrice ? tierPrice.pricePerMeal : option.pricePerMeal;
            const discountPercentage = tierPrice ? tierPrice.discountPercentage : (option.discountPercentage ?? 0);
            const discountedPrice =
              originalPrice - (originalPrice * discountPercentage) / 100;
            const hasDiscount = discountPercentage > 0;
            return (
              <button
                type="button"
                key={option._id}
                onClick={() => onTotalMealsChange(option.totalMeals)}
                className={`py-2 px-2 rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center focus:outline-none relative ${
                  isSelected ? "bg-white text-gray-900 shadow-md font-black" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <div className={`text-xl font-black ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                  {option.totalMeals}
                </div>
                {hasDiscount ? (
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[10px] font-bold line-through opacity-50">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-black text-[#dc2626]">
                      ${discountedPrice.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] font-bold mt-0.5 opacity-90">
                    ${originalPrice.toFixed(2)}
                  </div>
                )}
                <div className="text-[9px] mt-0.5 font-bold uppercase tracking-wide opacity-60">
                  {option.frequencyLabel} meal per week
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
