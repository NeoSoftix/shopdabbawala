// ================= COMPONENT: CATEGORY FILTER PILLS =================
const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-wrap gap-2.5 py-1">
      {categories.map((cat) => (
        <button
          key={cat._id}
          type="button"
          onClick={() => setSelectedCategory(cat.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all border ${selectedCategory === cat.name
            ? "bg-[#E31A1A] text-white border-[#E31A1A] shadow-sm"
            : "bg-white text-[#A3AED0] border-gray-200 hover:bg-gray-50"
            }`}
        >
          {cat.image?.url ? (
            <img src={cat.image.url} alt={cat.name} className="w-5 h-5 object-cover rounded-full" />
          ) : (
            <span>{cat.icon || "🍲"}</span>
          )}
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
