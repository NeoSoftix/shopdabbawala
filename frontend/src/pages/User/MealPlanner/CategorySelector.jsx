// Shown above the meal-schedule builder, right next to PlanSelector. A plan
// can offer more than one category (e.g. "chinese", "north-indian") - the
// subscriber picks one at a time to schedule a given day's meal against.
// Rendered as a horizontal scrollable slider of pills rather than a dropdown.
export default function CategorySelector({ categories, selectedCategory, onChange }) {
  if (!categories || categories.length === 0) return null;

  const selectedId = selectedCategory?._id || selectedCategory;

  if (categories.length === 1) {
    return (
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">
          Category:
        </span>
        <span className="text-sm font-black text-[#1B254B] capitalize">
          {categories[0].name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-4 px-1">
      <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider shrink-0">
        Category:
      </span>
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedId === cat._id;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => onChange(cat)}
              className={`text-sm font-bold px-4 py-2 rounded-xl capitalize shrink-0 transition-colors border ${
                isSelected
                  ? "bg-[#E31A1A] text-white border-[#E31A1A] shadow-sm"
                  : "bg-white text-[#1B254B] border-gray-200 hover:border-[#E31A1A]/50 hover:bg-red-50/40"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
