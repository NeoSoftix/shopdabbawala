export default function StatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive" }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
