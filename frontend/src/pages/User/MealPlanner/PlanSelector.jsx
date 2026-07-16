// Shown above the meal-schedule builder. If the user only has one plan we
// just name it; if they have several we can't guess which one they're
// scheduling for, so a dropdown lets them pick.
const planLabel = (sub) => `${sub.mealSize || "Custom"} Plan (${sub.preference || "Veg"})`;

export default function PlanSelector({ subscriptions, activeSubscription, onChange }) {
  if (!subscriptions || subscriptions.length === 0) return null;

  if (subscriptions.length === 1) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-[#A3AED0] uppercase tracking-wider">
          Scheduling for
        </span>
        <span className="text-sm text-[#1B254B] font-medium">
          {planLabel(subscriptions[0])}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-[#A3AED0] uppercase tracking-wider">
        Scheduling for
      </span>
      <select
        value={activeSubscription?._id || ""}
        onChange={(e) => {
          const next = subscriptions.find((sub) => sub._id === e.target.value);
          if (next) onChange(next);
        }}
        className="text-xs text-[#1B254B] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#E31A1A] shadow-sm w-full sm:w-40"
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
