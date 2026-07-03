export default function NotificationFilters() {
  const filters = [
    "All (12)",
    "Orders (7)",
    "Payments (2)",
    "System (3)",
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          className="px-5 py-2 rounded-xl border hover:border-[#E23747] hover:text-[#E23747]"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}