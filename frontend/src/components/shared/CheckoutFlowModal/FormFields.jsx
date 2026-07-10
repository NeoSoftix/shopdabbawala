import { FiLoader, FiX, FiArrowRight } from "react-icons/fi";

/**
 * Small presentational primitives shared across the CheckoutFlowModal steps.
 */
export const InputField = ({ label, type = "text", placeholder, value, onChange, maxLength, extraClass = "" }) => (
  <div>
    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
      {label}
    </label>
    <input
      type={type}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all ${extraClass}`}
    />
  </div>
);

export const SubmitBtn = ({ label, disabled: isDisabled, loading }) => (
  <button
    type="submit"
    disabled={isDisabled || loading}
    className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 text-white font-black text-[11px] tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg shadow-red-100 mt-2"
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <FiLoader className="w-4 h-4 animate-spin" />
        Please wait...
      </span>
    ) : (
      <span className="flex items-center justify-center gap-2">
        {label}
        <FiArrowRight className="w-4 h-4" />
      </span>
    )}
  </button>
);

export const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
      <FiX className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );
};
