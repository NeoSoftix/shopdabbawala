export default function StatCard({
  title,
  value,
  growth,
  Icon,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {value}
          </h3>

          <p className="text-green-600 text-sm mt-2">
            ↑ {growth}
          </p>
        </div>

        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <Icon
            size={22}
            className="text-[#E23747]"
          />
        </div>
      </div>
    </div>
  );
}