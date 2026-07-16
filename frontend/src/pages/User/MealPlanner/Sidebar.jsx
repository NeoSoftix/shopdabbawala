import { FaBowlFood, FaCalendarDays, FaClipboardList } from "react-icons/fa6";
import { Crown, ArrowRight, FileText, User } from "lucide-react";
import logoImg from "/logo.png";

const sidebarItems = [
  {
    id: 1,
    label: "Select Meals",
    icon: <FaBowlFood size={16} />,
  },
  {
    id: 2,
    label: "My Plan",
    icon: <FileText size={16} />,
  },
  {
    id: 3,
    label: "My Orders",
    icon: <FaCalendarDays size={16} />,
  },
  {
    id: 4,
    label: "My Schedule",
    icon: <FaClipboardList size={16} />,
  },
  {
    id: 5,
    label: "My Account",
    icon: <User size={16} />,
  },
];

// ================= COMPONENT: LEFT NAVIGATION SIDEBAR =================
const Sidebar = ({ activeStep, setActiveStep }) => {
  return (
    <aside className="bg-white p-5 pt-[110px] flex flex-col gap-6 w-[260px] flex-shrink-0 h-full overflow-y-auto border-r border-gray-100 hidden lg:flex">
      {/* Brand */}
      <div className="pb-2 flex flex-col items-center justify-center mt-2">
        {/* Logo removed as requested to avoid duplication with top header */}
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2 mt-4">
        {sidebarItems.map((item) => {
          const isActive = activeStep === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStep(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-colors text-left ${
                isActive
                  ? "bg-[#E31A1A] text-white"
                  : "text-[#1B254B] hover:bg-gray-50"
              }`}
            >
              <span className={isActive ? "text-white" : "text-[#A3AED0]"}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Premium Upgrade Card */}
      <div className="bg-[#FFFDF4] rounded-[24px] border border-[#FFEAB2]/40 p-5 text-center relative overflow-hidden flex flex-col items-center mt-auto mb-4">
        <div className="w-10 h-10 bg-[#FFF9E6] text-[#FFB800] rounded-full flex items-center justify-center mb-3">
          <Crown size={18} />
        </div>
        <h4 className="text-sm font-bold text-[#1B254B]">
          Upgrade to Premium
        </h4>
        <p className="text-xs text-[#A3AED0] font-medium mt-1 leading-relaxed">
          Unlock exclusive meals and advanced features.
        </p>
        <button className="mt-4 w-full bg-white border border-[#FFEAB2] hover:bg-[#FFFDF4] text-[#E31A1A] text-xs font-black py-2.5 rounded-xl tracking-wider transition-all flex items-center justify-center gap-1.5">
          UPGRADE NOW <ArrowRight size={14} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
