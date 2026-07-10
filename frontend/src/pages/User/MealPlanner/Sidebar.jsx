import { FaBowlFood, FaCalendarDays, FaCircleInfo } from "react-icons/fa6";
import { CookingPot, Crown, ArrowRight } from "lucide-react";

const sidebarItems = [
  {
    id: 1,
    label: "Plan Summary",
    desc: "Overview of your current plan",
    icon: <FaCircleInfo size={16} />,
  },
  {
    id: 2,
    label: "Build Custom Meal",
    desc: "Create your perfect plan",
    icon: <FaBowlFood size={16} />,
  },
  {
    id: 3,
    label: "My Orders",
    desc: "Track your orders & history",
    icon: <FaCalendarDays size={16} />,
  },
];

// ================= COMPONENT: LEFT NAVIGATION SIDEBAR =================
const Sidebar = ({ activeStep, setActiveStep }) => {
  return (
    <section className="lg:col-span-3 bg-white rounded-[30px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-6 w-full lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      {/* Dashboard Header Banner */}
      <div className="bg-gradient-to-br from-[#FF4141] to-[#E31A1A] rounded-[24px] p-5 text-white relative overflow-hidden shadow-lg shadow-red-100 min-h-[110px] flex flex-col justify-center">
        <h3 className="text-xl font-bold">Meal Plan</h3>
        <p className="text-white/70 text-xs sm:text-sm mt-0.5 font-medium">
          Dashboard
        </p>
        <span className="absolute right-3 bottom-2 opacity-80 filter drop-shadow-md">
          <CookingPot size={44} />
        </span>
      </div>

      {/* Navigation Sidebar Tabs */}
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const isActive = activeStep === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStep(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-[20px] transition-all duration-200 text-left ${isActive
                ? "bg-[#FFF5F5] border border-red-100/50"
                : "bg-transparent hover:bg-gray-50/80"
                }`}
            >
              <span
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${isActive ? "bg-white text-[#E31A1A] shadow-sm" : "bg-gray-50 text-[#A3AED0]"}`}
              >
                {item.icon}
              </span>
              <div>
                <span
                  className={`block text-sm sm:text-base font-bold ${isActive ? "text-[#E31A1A]" : "text-[#1B254B]"}`}
                >
                  {item.label}
                </span>
                <span className="block text-xs text-[#A3AED0] font-medium mt-0.5">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Premium Upgrade Card */}
      <div className="bg-[#FFFDF4] rounded-[24px] border border-[#FFEAB2]/40 p-5 text-center relative overflow-hidden flex flex-col items-center">
        <div className="w-11 h-11 bg-[#FFF9E6] text-[#FFB800] rounded-full flex items-center justify-center shadow-sm mb-3">
          <Crown size={20} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-[#1B254B]">
          Upgrade to Premium
        </h4>
        <p className="text-xs sm:text-sm text-[#A3AED0] font-medium mt-1 max-w-[200px] mx-auto leading-relaxed">
          Unlock exclusive meals and advanced features.
        </p>
        <button className="mt-4 w-full bg-white border border-[#FFEAB2] hover:bg-[#FFFDF4] text-[#E31A1A] text-xs sm:text-sm font-black py-3 rounded-xl tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5">
          UPGRADE NOW <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
