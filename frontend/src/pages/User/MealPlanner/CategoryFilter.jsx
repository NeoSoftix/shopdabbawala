import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Utensils } from "lucide-react";

// ================= COMPONENT: CATEGORY FILTER PILLS =================
const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  const scrollRef = useRef(null);

  const scrollByAmount = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollByAmount(-150)}
        aria-label="Scroll left"
        className="hidden md:flex shrink-0 w-8 h-8 items-center justify-center rounded-full border border-gray-200 bg-white text-[#A3AED0] hover:bg-gray-50 hover:text-[#E31A1A] transition-all"
      >
        <FaChevronLeft size={12} />
      </button>

      <div
        ref={scrollRef}
        className="flex flex-nowrap gap-2.5 py-1 overflow-x-auto no-scrollbar min-w-0"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat._id;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSelectedCategory(cat._id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all border shrink-0 whitespace-nowrap ${isSelected
                ? "bg-[#E31A1A] text-white border-[#E31A1A] shadow-sm"
                : "bg-white text-[#A3AED0] border-gray-200 hover:bg-gray-50"
                }`}
            >
              {cat.image?.url ? (
                <img src={cat.image.url} alt={cat.name} className="w-5 h-5 object-cover rounded-full" />
              ) : (
                <Utensils size={14} />
              )}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(150)}
        aria-label="Scroll right"
        className="hidden md:flex shrink-0 w-8 h-8 items-center justify-center rounded-full border border-gray-200 bg-white text-[#A3AED0] hover:bg-gray-50 hover:text-[#E31A1A] transition-all"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};

export default CategoryFilter;
