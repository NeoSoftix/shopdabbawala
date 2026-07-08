// Proceed / Go Back footer for the checkout flow's customization step.
export default function ProceedActions({ submitError, loading, onGoBack }) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
      {submitError && (
        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
          {submitError}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 text-white font-black text-[11px] tracking-widest uppercase py-3.5 rounded-2xl transition-all shadow-lg shadow-red-100"
      >
        {loading ? "Please wait..." : "Proceed"}
      </button>
      <button
        type="button"
        onClick={onGoBack}
        className="w-full text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors pt-2.5"
      >
        ← Go Back
      </button>
    </div>
  );
}
