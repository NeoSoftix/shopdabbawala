import QuantityStepper from "../../../components/shared/QuantityStepper";

// Right-column pricing/summary card: selected config recap + cost breakdown.
export default function PlanSummaryCard({
  selectedPlan,
  preference,
  startDate,
  quantity,
  onQuantityChange,
  duration,
  deliveryMethod,
  totalMeals,
  subtotal,
  discount,
  deliveryCharges,
  totalAmount,
  pricePerMeal,
}) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="bg-red-50 p-2 rounded-lg text-[#dc2626]">
          <svg width="4" height="4" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">
          Plan Summary
        </h2>
      </div>

      <div className="py-2 space-y-1.5 text-xs font-bold border-b border-gray-100 text-slate-600 uppercase tracking-wide">
        <div className="flex justify-between">
          <span className="text-slate-700">Meal Size / Tier</span>
          <span className="text-[#dc2626] font-extrabold uppercase">
            {selectedPlan}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-700">Meal preference</span>
          <span className="text-slate-900">{preference}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-700">Start date</span>
          <span className="text-slate-900">{startDate || "—"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-700">Tiffin Quantity</span>
          <QuantityStepper value={quantity} onChange={onQuantityChange} min={1} size="sm" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-700">Duration</span>
          <span className="text-slate-900">
            {duration}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-700">Fulfillment</span>
          <span className="text-[#dc2626] font-extrabold">
            {deliveryMethod}
          </span>
        </div>
      </div>

      <div className="bg-[#f4f5f7] p-2.5 rounded-xl my-2 space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wide">
          <span>Subtotal ({totalMeals} meals)</span>
          <span className="text-slate-700">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs font-bold text-[#dc2626] uppercase tracking-wide">
          <span>Discount (20% off)</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
          <span>{deliveryMethod} Charges</span>
          <span className={deliveryCharges === 0 ? "text-green-600 font-black" : "text-slate-700"}>
            {deliveryCharges === 0 ? "FREE" : `$${deliveryCharges.toFixed(2)}`}
          </span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between items-center pt-0.5">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
            Total Amount
          </span>
          <span className="text-lg font-black text-[#dc2626] tracking-tight">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 text-[#dc2626] text-[10px] rounded-xl p-1.5 text-center font-black uppercase tracking-widest mb-2 flex items-center justify-center space-x-1.5">
        <svg width="3.5" height="3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Price per Tiffin: ${pricePerMeal.toFixed(2)}</span>
      </div>
    </div>
  );
}
