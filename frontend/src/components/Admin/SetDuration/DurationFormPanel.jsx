const DurationFormPanel = ({
  isOpen,
  editingId,
  form,
  formErrors,
  submitting,
  livePreviewTotal,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
            {editingId ? "Edit Duration Plan" : "New Duration Plan"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">
              Duration Label
            </label>
            <input
              type="text"
              value={form.durationLabel}
              onChange={(e) => onChange("durationLabel", e.target.value)}
              placeholder="e.g. Weekly, Monthly, Fortnightly"
              className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                formErrors.durationLabel
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
              }`}
            />
            {formErrors.durationLabel && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.durationLabel}</p>
            )}
            <p className="text-[10px] text-gray-400 mt-1">
              This is what customers see as a tab — e.g. "Weekly", "Monthly". You can group
              multiple meal-count options under the same label.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1 block">
                Total Meals
              </label>
              <input
                type="number"
                min="1"
                value={form.totalMeals}
                onChange={(e) => onChange("totalMeals", e.target.value)}
                placeholder="4"
                className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                  formErrors.totalMeals
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                }`}
              />
              {formErrors.totalMeals && (
                <p className="text-[11px] text-red-600 mt-1">{formErrors.totalMeals}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1 block">
                Price / Meal ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerMeal}
                onChange={(e) => onChange("pricePerMeal", e.target.value)}
                placeholder="12.50"
                className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                  formErrors.pricePerMeal
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
                }`}
              />
              {formErrors.pricePerMeal && (
                <p className="text-[11px] text-red-600 mt-1">{formErrors.pricePerMeal}</p>
              )}
            </div>
          </div>

          <div className="bg-[#f4f5f7] rounded-xl p-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              Total Price (auto-calculated)
            </span>
            <span className="text-lg font-black text-[#dc2626]">
              {livePreviewTotal ? `$${livePreviewTotal}` : "—"}
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">
              Frequency Label
            </label>
            <input
              type="text"
              value={form.frequencyLabel}
              onChange={(e) => onChange("frequencyLabel", e.target.value)}
              placeholder="e.g. 4 Meals / Week"
              className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                formErrors.frequencyLabel
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
              }`}
            />
            {formErrors.frequencyLabel && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.frequencyLabel}</p>
            )}
            <p className="text-[10px] text-gray-400 mt-1">
              Small caption shown under the meal count on the customer's plan card.
            </p>
          </div>

          {/* <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">
              Sort Order <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => onChange("sortOrder", e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Lower numbers show first among cards with the same duration label.
            </p>
          </div> */}
        </form>

        <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2.5 transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 text-xs font-bold text-white bg-[#dc2626] hover:bg-red-700 rounded-xl py-2.5 transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DurationFormPanel;
