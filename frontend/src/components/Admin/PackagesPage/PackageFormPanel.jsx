import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";

/**
 * Add/Edit package form panel shown alongside the packages table.
 */
const PackageFormPanel = ({
  formData,
  editId,
  isActive,
  savingPackage,
  togglingId,
  onChange,
  onSubmit,
  onCancel,
  onToggleStatus,
}) => {
  const isToggling = togglingId === editId;

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 sticky top-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          {editId ? "Edit Package" : "Add Package"}
        </h2>
        <div className="flex items-center gap-3">
          {editId && (
            <button
              type="button"
              onClick={() => onToggleStatus(editId)}
              disabled={isToggling}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 transition-colors disabled:opacity-50 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-600 ring-gray-500/10 hover:bg-gray-200"
              }`}
            >
              {isToggling
                ? "Updating..."
                : isActive
                ? "Active"
                : "Inactive"}
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Package Name *"
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Package Name"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price ($) *"
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            placeholder="Price"
          />
          <Input
            label="Total Meals *"
            type="number"
            name="totalMeals"
            value={formData.totalMeals}
            onChange={onChange}
            placeholder="Total Meals"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Discount (%)"
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={onChange}
            min="0"
            max="100"
            placeholder="Optional discount percentage"
          />

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

        <Input
          label="Validity (Days) *"
          type="number"
          name="validityDays"
          value={formData.validityDays}
          onChange={onChange}
          placeholder="Validity (Days)"
        />

        <Input
          label="Features (comma separated)"
          type="text"
          name="features"
          value={formData.features}
          onChange={onChange}
          placeholder="Free Delivery, Extra Rice, Sweet Included"
        />

        <Textarea
          label="Description"
          rows="3"
          name="description"
          value={formData.description}
          onChange={onChange}
          className="resize-none"
          placeholder="Description"
        />

        <div className="pt-2">
          <Button type="submit" loading={savingPackage} className="w-full">
            {savingPackage ? "Saving..." : editId ? "Update Package" : "Save Package"}
          </Button>
          <p className="text-[11px] text-gray-400 text-center mt-2.5">
            Packages will be visible after saving.
          </p>
        </div>
      </div>
    </form>
  );
};

export default PackageFormPanel;
