export default function PillToggleGroup({ options, value, onChange, className = "" }) {
  return (
    <div className={`bg-[#f3f1f1] p-1 rounded-full flex border border-gray-200/40 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none ${
            value === opt.value
              ? "bg-white text-gray-900 shadow-sm font-extrabold"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
