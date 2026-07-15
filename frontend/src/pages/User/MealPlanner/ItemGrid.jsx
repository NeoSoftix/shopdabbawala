import { FaCheck } from "react-icons/fa6";
import { SectionLoader } from "../../../components/shared/Loader";
import QuantityStepper from "../../../components/shared/QuantityStepper";

// ================= COMPONENT: FOOD ITEM SELECTION GRID =================
const ItemGrid = ({ loadingData, filteredFoodItems, currentDayMeals, onToggleItem, onUpdateQuantity }) => {
  if (loadingData) {
    return (
      <div className="col-span-full">
        <SectionLoader text="Loading items..." />
      </div>
    );
  }

  if (filteredFoodItems.length === 0) {
    return (
      <div className="col-span-full py-8 text-center text-sm text-gray-500 font-medium">No items are available for this category on this day yet.</div>
    );
  }

  return filteredFoodItems.map((item) => {
    const selectedItem = currentDayMeals.find(
      (meal) => meal?._id === item._id,
    );

    const isChecked = Boolean(selectedItem);

    const quantity = selectedItem?.quantity || 0;

    return (
      <div
        key={item._id}
        onClick={() => onToggleItem(item)}
        className="bg-white rounded-xl border border-gray-100 p-3 relative flex flex-col justify-between cursor-pointer group shadow-[0_2px_15px_rgba(0,0,0,0.01)] hover:border-gray-200 transition-all"
      >
        <div className="space-y-3">
          <div className="relative">
            <img
              src={
                item.image?.url ||
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150&auto=format&fit=crop&q=80"
              }
              alt={item.name}
              className={`w-full h-24 object-cover rounded-lg transition-all ${isChecked ? "brightness-75" : ""
                }`}
            />

            {isChecked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#E31A1A] border-2 border-white shadow-lg">
                  <FaCheck
                    className="text-white"
                    size={16}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1B254B] leading-tight">
              {item.name}
            </h4>

            <p className="text-xs text-[#A3AED0] font-medium mt-1 line-clamp-2 leading-normal">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    );
  });
};

export default ItemGrid;
