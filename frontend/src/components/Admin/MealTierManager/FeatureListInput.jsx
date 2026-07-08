// Editable list of tier feature bullet points (add/remove/edit rows), capped at `max`.
export default function FeatureListInput({
  features,
  error,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  max,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-gray-700 block">
          Features
        </label>
        <span className="text-[10px] text-gray-400">
          {features.length}/{max}
        </span>
      </div>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              type="text"
              value={feature}
              onChange={(e) => onFeatureChange(index, e.target.value)}
              placeholder={`Feature ${index + 1}`}
              className="flex-1 border border-gray-300 rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
            />
            <button
              type="button"
              onClick={() => onRemoveFeature(index)}
              disabled={features.length === 1}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Remove feature"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-[11px] text-red-600 mt-1">{error}</p>
      )}
      <button
        type="button"
        onClick={onAddFeature}
        disabled={features.length >= max}
        className="mt-2 text-xs font-bold text-[#dc2626] hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
      >
        + Add Feature
      </button>
    </div>
  );
}
