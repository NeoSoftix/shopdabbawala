import { FaBoxOpen, FaClock, FaDollarSign } from "react-icons/fa";

/**
 * Top stats grid (total / active / inactive packages + revenue placeholder).
 */
const PackageStatsCards = ({ packages }) => {
  const stats = [
    {
      title: "Total Packages",
      value: packages.length,
      sub: "All packages",
      icon: <FaBoxOpen />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Active Packages",
      value: packages.filter((p) => p.isActive === true).length,
      sub: "Currently active",
      icon: <FaClock />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Inactive Packages",
      value: packages.filter((p) => p.isActive !== true).length,
      sub: "Disabled packages",
      icon: <FaBoxOpen />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
    },
    {
      title: "Revenue",
      value: "$0",
      sub: "Package sales",
      icon: <FaDollarSign />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {s.title}
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">
              {s.value}
            </h3>
            {s.sub && (
              <p className="text-[10px] text-purple-600 font-medium mt-0.5">
                {s.sub}
              </p>
            )}
          </div>
          <div
            className={`p-2 sm:p-2.5 rounded-xl ${s.bgColor} ${s.textColor} text-lg sm:text-xl`}
          >
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackageStatsCards;
