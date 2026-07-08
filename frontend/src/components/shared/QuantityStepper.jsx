import { useState } from "react";

export default function QuantityStepper({ value, onChange, min = 1, max = Infinity, size = "sm" }) {
  const [lastAction, setLastAction] = useState(null); // "decrease" | "increase" | null
  const buttonSize = size === "sm" ? "w-5 h-5 text-[10px]" : "w-8 h-8 text-sm";
  const baseButton = `${buttonSize} rounded flex items-center justify-center font-black focus:outline-none transition-all active:scale-[0.98]`;

  const handleDecrease = () => {
    setLastAction("decrease");
    onChange(Math.max(min, value - 1));
  };

  const handleIncrease = () => {
    setLastAction("increase");
    onChange(Math.min(max, value + 1));
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleDecrease}
        className={`${baseButton} ${
          lastAction === "decrease"
            ? "bg-red-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
      >
        -
      </button>
      <span className="text-xs font-black text-slate-800 min-w-[14px] text-center">{value}</span>
      <button
        type="button"
        onClick={handleIncrease}
        className={`${baseButton} ${
          lastAction === "increase"
            ? "bg-red-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
      >
        +
      </button>
    </div>
  );
}
