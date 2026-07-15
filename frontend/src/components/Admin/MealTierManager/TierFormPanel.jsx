import FeatureListInput from "./FeatureListInput.jsx";
import { MAX_FEATURES } from "./constants.js";

// Slide-over add/edit tier panel — name and features, wired to the
// state/handlers from useTierForm.
export default function TierFormPanel({ tierForm }) {
  const {
    isFormOpen,
    editingId,
    form,
    formErrors,
    submitting,
    closeForm,
    handleNameChange,
    handleFeatureChange,
    addFeatureField,
    removeFeatureField,
    handleSubmit,
  } = tierForm;

  if (!isFormOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={closeForm}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
            {editingId ? "Edit Meal Tier" : "New Meal Tier"}
          </h2>
          <button
            onClick={closeForm}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">
              Tier Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Basic, Medium, Premium"
              className={`w-full border rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                formErrors.name
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#dc2626] focus:ring-[#dc2626]"
              }`}
            />
            {formErrors.name && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>
            )}
          </div>

          <FeatureListInput
            features={form.features}
            error={formErrors.features}
            onFeatureChange={handleFeatureChange}
            onAddFeature={addFeatureField}
            onRemoveFeature={removeFeatureField}
            max={MAX_FEATURES}
          />
        </form>

        <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={closeForm}
            className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2.5 transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 text-xs font-bold text-white bg-[#dc2626] hover:bg-red-700 rounded-xl py-2.5 transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Tier"}
          </button>
        </div>
      </div>
    </div>
  );
}
