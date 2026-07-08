export default function NotificationFilters({
  counts = { all: 0, order: 0, payment: 0, system: 0 },
  activeFilter = "all",
  onFilterChange = () => {},
}) {
  const filters = [
    { key: "all", label: "All" },
    { key: "order", label: "Orders" },
    { key: "payment", label: "Payments" },
    { key: "system", label: "System" },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-5 py-2 rounded-xl border transition ${
            activeFilter === key
              ? "border-[#E23747] text-[#E23747] bg-red-50"
              : "hover:border-[#E23747] hover:text-[#E23747]"
          }`}
        >
          {label} ({counts[key] || 0})
        </button>
      ))}
    </div>
  );
}
