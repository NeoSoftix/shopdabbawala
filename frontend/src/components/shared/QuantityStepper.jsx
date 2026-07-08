export default function QuantityStepper({ value, onChange, min = 1, max = Infinity, size = "sm" }) {
  const buttonSize = size === "sm" ? "w-5 h-5 text-[10px]" : "w-8 h-8 text-sm";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${buttonSize} rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-black text-gray-800 focus:outline-none transition-all active:scale-[0.98]`}
      >
        -
      </button>
      <span className="text-xs font-black text-slate-800 min-w-[14px] text-center">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${buttonSize} rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-black text-gray-800 focus:outline-none transition-all active:scale-[0.98]`}
      >
        +
      </button>
    </div>
  );
}
