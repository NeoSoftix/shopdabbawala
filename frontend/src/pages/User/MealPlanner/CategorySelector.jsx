// Shown above the meal-schedule builder, right next to PlanSelector. A plan
// can offer more than one category (e.g. "chinese", "north-indian") - the
// subscriber picks one at a time to schedule a given day's meal against.
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 px-1">
      <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider shrink-0">
        Category:
      </span>
      <select
        value={selectedId || ""}
        onChange={(e) => {
          const next = categories.find((cat) => cat._id === e.target.value);
          if (next) onChange(next);
        }}
        className="text-sm font-black text-[#1B254B] bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#E31A1A] shadow-sm max-w-full sm:max-w-xs capitalize"
      >
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id} className="capitalize">
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
