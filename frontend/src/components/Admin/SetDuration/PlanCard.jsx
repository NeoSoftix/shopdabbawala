const PlanCard = ({ plan, onEdit, onToggle, onDeleteRequest }) => {
  const totalPrice =
    plan.totalPrice ?? Number((plan.pricePerMeal * plan.totalMeals).toFixed(2));

  return (
    <div
      className={`relative bg-white rounded-2xl border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all ${
        plan.isActive ? "border-gray-200/80" : "border-gray-200/60 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-2xl font-black text-gray-900 leading-none">
            {plan.totalMeals}
            <span className="text-xs font-bold text-gray-400 ml-1">meals</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mt-1">
            {plan.frequencyLabel}
          </div>
        </div>
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
            plan.isActive
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {plan.isActive ? "Active" : "Hidden"}
        </span>
      </div>

      <div className="bg-[#f4f5f7] rounded-xl p-2.5 mt-3 space-y-1">
        <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wide">
          <span>Per meal</span>
          <span className="text-gray-700">${plan.pricePerMeal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-gray-200">
          <span className="text-[11px] font-black text-gray-800 uppercase tracking-wide">
            Total
          </span>
          <span className="text-base font-black text-[#dc2626]">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        <button
          onClick={() => onEdit(plan)}
          className="flex-1 text-[11px] font-bold text-gray-600 hover:text-[#dc2626] bg-gray-50 hover:bg-red-50 rounded-lg py-1.5 transition-all focus:outline-none"
        >
          Edit
        </button>
        <button
          onClick={() => onToggle(plan)}
          className="flex-1 text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg py-1.5 transition-all focus:outline-none"
        >
          {plan.isActive ? "Hide" : "Show"}
        </button>
        <button
          onClick={() => onDeleteRequest(plan)}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
          aria-label="Delete plan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79l-.622 10.72a2.25 2.25 0 01-2.244 2.13H7.638a2.25 2.25 0 01-2.244-2.13L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.956.397a48.11 48.11 0 013.478-.397m0 0V4.67c0-1.03.83-1.874 1.86-1.913a45.62 45.62 0 013.28 0c1.03.04 1.86.883 1.86 1.913v.816m-6 0a48.667 48.667 0 017.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
