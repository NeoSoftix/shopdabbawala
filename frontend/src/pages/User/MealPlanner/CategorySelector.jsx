import { Check } from "lucide-react";

// Shown above the meal-schedule builder, right next to PlanSelector. A plan
// can offer more than one category (e.g. "chinese", "north-indian") - the
// subscriber picks one at a time to schedule a given day's meal against.
export default function CategorySelector({ categories, selectedCategory, onChange }) {
  if (!categories || categories.length === 0) return null;

  const selectedId = selectedCategory?._id || selectedCategory;

  return (
    <div>
      <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
        Step 1 — Choose Your Category
      </p>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = selectedId === cat._id;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => onChange(cat)}
              className={`flex shrink-0 flex-col items-center justify-center py-3 px-5 rounded-xl border transition-all bg-white min-w-32.5 ${
                isSelected
                  ? "border-[#E31A1A] ring-1 ring-[#E31A1A]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#E31A1A] text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
                <span className={`text-sm font-bold capitalize ${isSelected ? "text-[#E31A1A]" : "text-[#1B254B]"}`}>
                  {cat.name}
                </span>
              </div>
              <span className={`text-[11px] ${isSelected ? "text-[#E31A1A]/80" : "text-gray-400"}`}>
                Pick your dishes
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
