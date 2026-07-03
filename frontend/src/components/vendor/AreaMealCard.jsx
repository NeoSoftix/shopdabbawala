import { MapPin } from "lucide-react";

export default function AreaMealCard({
  area,
  mealType,
  orders = 0,
}) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            Delivery Area
          </p>

          <h3 className="text-lg font-semibold flex items-center gap-2 mt-1">
            <MapPin size={18} />
            {area}
          </h3>
        </div>

        <span className="bg-red-50 text-[#E23747] px-3 py-1 rounded-full text-sm font-medium">
          {mealType}
        </span>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Active Orders: <strong>{orders}</strong>
      </div>
    </div>
  );
}