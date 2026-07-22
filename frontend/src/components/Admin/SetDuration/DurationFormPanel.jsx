import Input from "../../ui/Input";
import Button from "../../ui/Button";

const DurationFormPanel = ({
  isOpen,
  editingId,
  form,
  formErrors,
  submitting,
  mealTiers,
  onChange,
  onTierPriceChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const totalMeals = Number(form.totalMeals) || 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
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
            <Input
              label="Duration Label"
              type="text"
              value={form.durationLabel}
              onChange={(e) => onChange("durationLabel", e.target.value)}
              placeholder="e.g. Weekly, Monthly, Fortnightly"
              error={formErrors.durationLabel}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              This is what customers see as a tab — e.g. "Weekly", "Monthly". You can group
              multiple meal-count options under the same label.
            </p>
          </div>

          <div>
            <Input
              label={<>Duration Tab Order <span className="text-gray-400 font-normal">(optional)</span></>}
              type="number"
              value={form.labelOrder}
              onChange={(e) => onChange("labelOrder", e.target.value)}
              placeholder="0"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Controls which tab shows first — e.g. "Weekly" before "Monthly". Lower numbers
              show first. Applies to every plan under this duration label.
            </p>
          </div>

          <Input
            label="Total Meals"
            type="number"
            min="1"
            value={form.totalMeals}
            onChange={(e) => onChange("totalMeals", e.target.value)}
            placeholder="4"
            error={formErrors.totalMeals}
          />

          <div>
            <Input
              label="Duration (Days)"
              type="number"
              min="1"
              value={form.durationDays}
              onChange={(e) => onChange("durationDays", e.target.value)}
              placeholder="e.g. 7"
              error={formErrors.durationDays}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              How many calendar days this plan actually runs for - sets the subscription's
              end date and billing cycle, regardless of the label above.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-2 block">
              Price Per Meal Tier
            </label>
            <p className="text-[10px] text-gray-400 -mt-1.5 mb-2">
              Each meal plan tier (Basic/Medium/Premium...) gets its own price for this
              duration + meal-count combo.
            </p>

            {mealTiers.length === 0 && (
              <p className="text-xs text-gray-400 py-2">
                No active meal tiers found. Add one under "Meal Tiers" first.
              </p>
            )}

            <div className="space-y-2.5">
              {mealTiers.map((tier) => {
                const row = form.tierPricing[tier._id] || { pricePerMeal: "", discountPercentage: "0" };
                const price = Number(row.pricePerMeal) || 0;
                const discountPct = Number(row.discountPercentage) || 0;
                const total = totalMeals * price;
                const discountedTotal = total - (total * discountPct) / 100;
                const tierError = formErrors[`tier_${tier._id}`];

                return (
                  <div key={tier._id} className="border border-gray-200 rounded-xl p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-gray-800">{tier.name}</span>
                      {total > 0 && (
                        <span className="text-right">
                          {discountPct > 0 ? (
                            <>
                              <span className="text-[11px] font-bold text-gray-400 line-through mr-1.5">
                                ${total.toFixed(2)}
                              </span>
                              <span className="text-sm font-black text-[#dc2626]">
                                ${discountedTotal.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-black text-[#dc2626]">
                              ${total.toFixed(2)}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.pricePerMeal}
                        onChange={(e) => onTierPriceChange(tier._id, "pricePerMeal", e.target.value)}
                        placeholder="Price / meal ($)"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={row.discountPercentage}
                        onChange={(e) => onTierPriceChange(tier._id, "discountPercentage", e.target.value)}
                        placeholder="Discount %"
                      />
                    </div>
                    {tierError && <p className="text-[11px] text-red-600 mt-1">{tierError}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Input
              label="Frequency Label"
              type="text"
              value={form.frequencyLabel}
              onChange={(e) => onChange("frequencyLabel", e.target.value)}
              placeholder="e.g. 4 Meals / Week"
              error={formErrors.frequencyLabel}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Small caption shown under the meal count on the customer's plan card.
            </p>
          </div>

          <div>
            <Input
              label={<>Sort Order <span className="text-gray-400 font-normal">(optional)</span></>}
              type="number"
              value={form.sortOrder}
              onChange={(e) => onChange("sortOrder", e.target.value)}
              placeholder="0"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Lower numbers show first among cards with the same duration label.
            </p>
          </div>
        </form>

        <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmit} loading={submitting} className="flex-1">
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DurationFormPanel;
