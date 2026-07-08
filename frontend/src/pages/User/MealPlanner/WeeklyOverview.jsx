import { daysOfWeek } from "./constants";

// ================= COMPONENT: WEEKLY PLAN MATRIX VIEW =================
const WeeklyOverview = ({ weeklyPlan }) => {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <span className="text-lg">📅</span>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#1B254B] tracking-wider uppercase">
            YOUR WEEKLY PLAN
          </h4>
          <p className="text-xs font-medium text-[#A3AED0]">
            Review your meals for the week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {daysOfWeek.map((day) => {
          const items = weeklyPlan[day.name] || [];
          const hasItems = items.length > 0;

          return (
            <div
              key={day.id}
              className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between min-h-[120px]"
            >
              <div>
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-gray-50">
                  <span className="text-xs sm:text-sm font-bold text-[#1B254B]">
                    {day.name}
                  </span>
                  {hasItems && (
                    <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      {items.length} M
                    </span>
                  )}
                </div>

                {hasItems ? (
                  <div className="space-y-1">
                    {items.map((item, idx) => (
                      <div
                        key={item ? item._id : idx}
                        className="flex justify-between items-center text-xs font-bold text-[#A3AED0]"
                      >
                        <span className="truncate w-full text-left">
                          {item ? item.name : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-300">
                    <p className="text-xs italic">No meals</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyOverview;
