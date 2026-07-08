import { useState } from "react";

// Meal tier grid (Basic / Medium / Premium etc.) with a hover/tap tooltip
// showing tier features + included items. `hoveredPlan` is purely local UI
// state — the selected tier itself is lifted to the parent.
export default function MealPlanSelector({ mealTiers, selectedPlan, onSelectPlan }) {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <div className="flex-1 bg-white p-2.5 px-3 rounded-2xl border border-gray-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <label className="text-xs font-bold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
        <span>🍱</span> Select Your Meal Plan:
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {mealTiers.length === 0 && (
          <p className="text-xs text-gray-400 col-span-3 text-center py-4">
            Loading meal plans...
          </p>
        )}
        {mealTiers.map((tier) => {
          const planName = tier.name;
          const isSelected = selectedPlan === planName;
          const shortDescription = tier.features?.[0] || "";
          return (
            <div key={tier._id} className="relative group">
              <div
                onMouseEnter={() => setHoveredPlan(planName)}
                onMouseLeave={() => setHoveredPlan(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredPlan(hoveredPlan === planName ? null : planName);
                }}
                className="absolute top-2 right-2 z-30 w-4 h-4 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#dc2626] hover:bg-red-50 flex items-center justify-center text-[10px] font-serif font-black cursor-pointer sm:cursor-help transition-all shadow-sm"
              >
                i
              </div>

              <button
                type="button"
                onClick={() => onSelectPlan(planName)}
                className={`w-full p-2.5 rounded-xl text-center border transition-all flex flex-col items-center justify-center min-h-[90px] focus:outline-none relative
                      ${isSelected ? "bg-[#dc2626] text-white border-[#dc2626] shadow-lg shadow-red-600/10 font-black" : "bg-white text-gray-800 border-gray-200 hover:border-[#dc2626]/60"}`}
              >
                <span className="text-sm font-black tracking-tight">
                  {planName}
                </span>
                <span className={`text-[10px] font-medium mt-0.5 leading-tight max-w-[170px] line-clamp-2 ${isSelected ? "text-white/90" : "text-gray-400"}`}>
                  {shortDescription}
                </span>
              </button>

              {hoveredPlan === planName && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredPlan(null);
                  }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 w-[350px] sm:w-[250px] bg-white/95 backdrop-blur-md border border-red-100 shadow-2xl rounded-2xl p-5 text-left cursor-pointer border-t-4 border-t-[#dc2626] transition-all duration-200 pointer-events-auto"
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-red-100"></div>
                  <div className="text-xs font-black text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wide">
                    <span>ℹ️</span> {planName} Includes:
                  </div>
                  <div className="space-y-3.5">
                    <div className="text-[11px]">
                      <ul className="list-none space-y-1.5 font-semibold text-slate-600">
                        {(tier.features || []).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#dc2626] mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {tier.items?.length > 0 && (
                      <div className="text-[11px] pt-2 border-t border-slate-100">
                        <span className="font-extrabold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
                          🍽️ Items — choose {tier.selectionCount || 1} of {tier.items.length}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {tier.items.map((item) => (
                            <span
                              key={item._id}
                              className="text-[10px] font-semibold text-slate-600 bg-slate-100 rounded-md px-1.5 py-0.5"
                            >
                              {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
