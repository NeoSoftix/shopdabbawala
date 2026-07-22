// Label + error wrapper shared by Input/Select/Textarea call sites.
export default function FormField({ label, error, required, className = "", children }) {
  return (
    <div className={className}>
      {label && (
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
