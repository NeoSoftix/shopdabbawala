// Shown above the meal-schedule builder. If the user only has one plan we
// just name it; if they have several we can't guess which one they're
// scheduling for, so a dropdown lets them pick.
const planLabel = (sub) => `${sub.mealSize || "Custom"} Plan (${sub.preference || "Veg"})`;

export default function PlanSelector({ subscriptions, activeSubscription, onChange }) {
  if (!subscriptions || subscriptions.length === 0) return null;

  if (subscriptions.length === 1) {
    return (
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider">
          Scheduling for:
        </span>
        <span className="text-sm font-black text-[#1B254B]">
          {planLabel(subscriptions[0])}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 px-1">
      <span className="text-xs font-bold text-[#A3AED0] uppercase tracking-wider shrink-0">
        Scheduling for:
      </span>
      <select
        value={activeSubscription?._id || ""}
        onChange={(e) => {
          const next = subscriptions.find((sub) => sub._id === e.target.value);
          if (next) onChange(next);
        }}
        className="text-sm font-black text-[#1B254B] bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#E31A1A] shadow-sm max-w-full sm:max-w-xs"
      >
        {subscriptions.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {planLabel(sub)} {sub.status !== "active" ? `— ${sub.status}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
