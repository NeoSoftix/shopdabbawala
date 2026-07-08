/**
 * Row of numbered dots showing progress through the checkout flow.
 */
export default function StepIndicator({ stepLabels, currentStepIndex }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-6 mt-1">
      {stepLabels.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black transition-all duration-300 ${i < currentStepIndex
              ? "bg-emerald-500 text-white"
              : i === currentStepIndex
                ? "bg-red-600 text-white ring-4 ring-red-100"
                : "bg-slate-100 text-slate-400"
              }`}>
              {i < currentStepIndex ? "✓" : i + 1}
            </div>
            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wide mt-1 whitespace-nowrap ${i === currentStepIndex ? "text-red-600" : "text-slate-400"}`}>
              {label}
            </span>
          </div>
          {i < stepLabels.length - 1 && (
            <div className={`w-4 sm:w-6 lg:w-8 h-0.5 mb-3 mx-1 sm:mx-1.5 rounded-full transition-all duration-300 ${i < currentStepIndex ? "bg-emerald-400" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
