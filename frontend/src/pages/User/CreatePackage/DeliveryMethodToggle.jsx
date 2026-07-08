import { MdStorefront, MdDeliveryDining } from "react-icons/md";

// Pickup / Delivery segmented pill toggle. Doesn't use the shared
// PillToggleGroup because its selected-state colors (solid red fill) differ
// from PillToggleGroup's hardcoded white/shadow selected style.
export default function DeliveryMethodToggle({ value, onChange, fullWidth = false }) {
  const buttonBase = fullWidth ? "w-1/2 py-1.5 px-3" : "py-1.5 px-6";

  return (
    <div className="bg-[#f3f1f1] p-1 rounded-full flex border border-gray-200/40">
      <button
        type="button"
        onClick={() => onChange("Pickup")}
        className={`${buttonBase} rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
          value === "Pickup" ? "bg-red-600 text-white shadow-sm font-extrabold" : "text-gray-500 hover:text-gray-800"
        }`}
      >
        <MdStorefront className="w-4 h-4" />
        <span>Pickup</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("Delivery")}
        className={`${buttonBase} rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
          value === "Delivery" ? "bg-red-600 text-white shadow-sm font-extrabold" : "text-gray-500 hover:text-gray-800"
        }`}
      >
        <MdDeliveryDining className="w-4 h-4" />
        <span>Delivery</span>
      </button>
    </div>
  );
}
