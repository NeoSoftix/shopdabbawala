/**
 * Add/Edit package form panel shown alongside the packages table.
 */
const PackageFormPanel = ({
  formData,
  editId,
  savingPackage,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 sticky top-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-5">
        <h2 className="font-bold text-gray-800 text-base sm:text-lg">
          {editId ? "Edit Package" : "Add Package"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Package Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            placeholder="Package Name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Total Meals *
            </label>
            <input
              type="number"
              name="totalMeals"
              value={formData.totalMeals}
              onChange={onChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Total Meals"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Discount (%)
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={onChange}
              min="0"
              max="100"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Optional discount percentage"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Discounted Price
            </label>
            <div className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 flex items-center min-h-10.5">
              {formData.price && formData.discountPercentage
                ? `$${(
                    formData.price -
                    (formData.price * formData.discountPercentage) / 100
                  ).toFixed(2)}`
                : "—"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Validity (Days) *
            </label>
            <input
              type="number"
              name="validityDays"
              value={formData.validityDays}
              onChange={onChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Validity (Days)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Max Items Per Meal *
            </label>
            <input
              type="number"
              name="maxItemsPerMeal"
              value={formData.maxItemsPerMeal}
              onChange={onChange}
              placeholder="e.g. 6"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>
        </div>

        {/* 💡 यहाँ NEW Features UI Input Field ऐड कर दी गई है */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Features (comma separated)
          </label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={onChange}
            placeholder="Free Delivery, Extra Rice, Sweet Included"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Description
          </label>
          <textarea
            rows="3"
            name="description"
            value={formData.description}
            onChange={onChange}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
            placeholder="Description"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={savingPackage}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl shadow-sm shadow-red-600/10 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {savingPackage && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {savingPackage ? "Saving..." : editId ? "Update Package" : "Save Package"}
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-2.5">
            Packages will be visible after saving.
          </p>
        </div>
      </div>
    </form>
  );
};

export default PackageFormPanel;
