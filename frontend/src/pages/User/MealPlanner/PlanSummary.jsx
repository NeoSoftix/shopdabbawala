import { FaRegCalendar, FaShieldHalved, FaRegClock } from "react-icons/fa6";
import { SectionLoader } from "../../../components/shared/Loader";
import NoActivePlan from "./NoActivePlan";

// ================= COMPONENT: MEAL PLAN SUMMARY =================
const PlanSummary = ({ subscriptions, loading }) => {
  if (loading) {
    return <SectionLoader text="Loading your plans..." />;
  }

  if (!subscriptions || subscriptions.length === 0) {
    return <NoActivePlan />;
  }

  return (
    <div className="w-full space-y-6">
      {subscriptions.map((sub, idx) => {
        const {
          mealSize = "Basic",
          preference = "Veg",
          totalMeals = 0,
          mealsUsed = 0,
          endDate,
          status,
        } = sub;

        const remaining = totalMeals - mealsUsed;
        const usagePercentage = totalMeals > 0 ? Math.round((mealsUsed / totalMeals) * 100) : 0;

        // Calculate remaining days
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end - today;
        const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const validTillStr = end.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });

        return (
          <div key={sub._id || idx} className="w-full bg-white rounded-[32px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.015)] border border-gray-50 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#FFF5F5] rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                  🍲
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1B254B] tracking-tight capitalize">
                    {mealSize} Plan ({preference})
                  </h2>
                  <p className="text-sm font-medium text-[#A3AED0] mt-0.5">
                    Plan #{idx + 1} Details
                  </p>
                </div>
              </div>

              <div className={`font-bold text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm ${status === 'active' ? 'bg-[#E6F9EE] text-[#05CD99]' : 'bg-gray-100 text-gray-400'}`}>
                <FaShieldHalved size={14} /> <span className="capitalize">{status === 'active' ? 'Active Plan' : status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              <div className="md:col-span-3 bg-gradient-to-b from-[#FF5E5E] to-[#E31A1A] rounded-[24px] p-6 text-center flex flex-col justify-center items-center h-44 shadow-lg shadow-red-100/40 relative overflow-hidden">
                <span className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white mb-2 text-lg">
                  🍽️
                </span>
                <span className="text-5xl font-black text-white tracking-tight">
                  {totalMeals}
                </span>
                <span className="text-sm font-bold text-white/80 mt-1 uppercase tracking-wider">
                  Total Meals
                </span>
              </div>

              <div className="md:col-span-5 px-2 flex flex-col justify-center h-44">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-bold text-[#1B254B]">
                    Plan Usage
                  </span>
                  <span className="text-xs font-bold text-[#E31A1A] bg-[#FFF5F5] px-2.5 py-1 rounded-md">
                    {usagePercentage}% Used
                  </span>
                </div>
                <div className="w-full h-3 bg-[#F4F7FE] rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF5E5E] to-[#E31A1A] rounded-full"
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 text-center relative">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-[#FFF5F5] text-[#E31A1A] rounded-xl flex items-center justify-center text-base">
                      🚫
                    </div>
                    <div className="text-left">
                      <span className="block text-2xl font-black text-[#E31A1A] leading-none">
                        {mealsUsed}
                      </span>
                      <span className="text-xs font-semibold text-[#A3AED0] mt-1 block">
                        Consumed
                      </span>
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-gray-100"></div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-[#F4F7FE] text-[#1B254B] rounded-xl flex items-center justify-center text-base">
                      🧺
                    </div>
                    <div className="text-left">
                      <span className="block text-2xl font-black text-[#1B254B] leading-none">
                        {remaining}
                      </span>
                      <span className="text-xs font-semibold text-[#A3AED0] mt-1 block">
                        Remaining
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 space-y-5 flex flex-col justify-center h-44">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFF5F5] rounded-xl flex items-center justify-center text-[#E31A1A] shrink-0 shadow-sm">
                    <FaRegCalendar size={20} />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-[#A3AED0] leading-none mb-1.5">
                      Valid Till
                    </span>
                    <span className="text-base font-extrabold text-[#1B254B]">
                      {validTillStr}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFF5F5] rounded-xl flex items-center justify-center text-[#E31A1A] shrink-0 shadow-sm">
                    <FaRegClock size={20} />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-[#A3AED0] leading-none mb-1.5">
                      Expires in
                    </span>
                    <span className="text-base font-extrabold text-[#1B254B]">
                      {diffDays} Days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanSummary;
