import { FileText } from "lucide-react";

const fieldRow = (label, value) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-[10px] text-black font-medium uppercase tracking-wider">{label}</span>
    <span className="text-[11px] text-[#1B254B] text-right ml-2">{value}</span>
  </div>
);

// ================= COMPONENT: ACTIVE PLAN DETAILS =================
const MyPlan = ({ subscriptions, activeSubscription, onChange }) => {
  if (!subscriptions || subscriptions.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-full bg-[#E31A1A] text-white flex items-center justify-center shrink-0">
          <FileText size={18} strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-lg text-[#1B254B]">My Plans</h2>
          <p className="text-xs text-black font-medium">Details of your active subscriptions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {subscriptions.map((sub) => {
          const mealsUsed = sub.mealsUsed ?? 0;
          const totalMeals = sub.totalMeals ?? 0;
          const mealsRemaining = Math.max(totalMeals - mealsUsed, 0);
          const progressPct = totalMeals > 0 ? Math.min((mealsUsed / totalMeals) * 100, 100) : 0;
          const isActive = activeSubscription?._id === sub._id;

          return (
            <div 
              key={sub._id} 
              onClick={() => !isActive && onChange(sub)}
              className={`bg-white rounded-[20px] border ${isActive ? 'border-[#E31A1A] ring-1 ring-[#E31A1A]' : 'border-gray-100 hover:border-gray-300 cursor-pointer'} p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all`}
            >
              <div className="flex flex-col mb-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-sm text-[#1B254B] leading-tight">
                    {sub.mealSize || "Custom"} Plan<br/>
                    <span className="text-xs text-black font-medium">({sub.preference || "Veg"})</span>
                  </h3>
                  {subscriptions.length > 1 && isActive && (
                    <span className="text-[9px] text-[#E31A1A] bg-red-50 px-2 py-1 rounded-md uppercase tracking-wider border border-red-100 shrink-0">
                      Editing
                    </span>
                  )}
                </div>
                
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] text-black font-medium uppercase tracking-wider">Meals Used</span>
                    <span className="text-[10px] text-[#1B254B]">{mealsUsed} / {totalMeals}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-[#E31A1A] rounded-full" style={{ width: `${progressPct}%` }} />
                  </div>
                  <p className="text-[9px] text-black font-medium mt-1.5">{mealsRemaining} meals remaining</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2">
                {fieldRow("Meal Size", sub.mealSize)}
                {fieldRow("Preference", sub.preference)}
                {fieldRow("Duration", sub.duration)}
                {fieldRow("Quantity", sub.quantity)}
                {fieldRow("Fulfillment", sub.deliveryMethod)}
                {sub.pincode && fieldRow("Pincode", sub.pincode)}
                {fieldRow("Price", `$${Number(sub.price || 0).toFixed(2)}`)}
                {fieldRow(
                  "Start Date",
                  sub.startDate
                    ? new Date(sub.startDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                    : "—"
                )}
                {fieldRow(
                  "End Date",
                  sub.endDate
                    ? new Date(sub.endDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                    : "—"
                )}
                {fieldRow(
                  "Status",
                  <span className={`text-[9px] px-2 py-1 rounded-md uppercase tracking-wider inline-block mt-0.5 ${
                    sub.status === "active" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}>
                    {sub.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyPlan;
