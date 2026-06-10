import AreaMealCard from "./AreaMealCard";

export default function VendorAreaSection({
  areas = [],
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Assigned Areas & Meals
        </h2>

        <button className="text-[#E23747] font-medium">
          Manage Areas
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {areas.map((item) => (
          <AreaMealCard
            key={item.area}
            area={item.area}
            mealType={item.mealType}
            orders={item.orders}
          />
        ))}
      </div>
    </div>
  );
}