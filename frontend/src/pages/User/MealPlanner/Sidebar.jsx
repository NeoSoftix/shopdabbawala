import { FaBowlFood, FaCalendarDays, FaClipboardList } from "react-icons/fa6";
import { Crown, ArrowRight, FileText, User } from "lucide-react";
import logoImg from "/logo.png";
import { useNavigate } from "react-router-dom";

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

import { Menu, X } from "lucide-react";

// ================= COMPONENT: LEFT NAVIGATION SIDEBAR =================
const Sidebar = ({ activeStep, setActiveStep, isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[1010] transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`
        fixed lg:static top-0 left-0 h-full bg-white z-[1020]
        flex flex-col flex-shrink-0 overflow-y-auto border-r border-gray-100
        transition-transform duration-300 ease-in-out
        w-[280px] lg:w-[220px]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        <div className="bg-white border-b border-gray-100 p-4 lg:p-6 flex items-center justify-center relative shrink-0">
          <img src={logoImg} alt="Meals Logo" className="h-16 lg:h-28 w-auto object-contain" />
          <button onClick={() => setIsOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-1 lg:hidden">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 lg:p-5 flex-1 flex flex-col gap-6">

      {/* Navigation */}
      <div className="flex flex-col gap-2 mt-4 lg:mt-0">
        {sidebarItems.map((item) => {
          const isActive = activeStep === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveStep(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-colors text-left ${
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
      <div className="bg-[#FFFDF4] rounded-[20px] border border-[#FFEAB2]/40 p-4 text-center relative overflow-hidden flex flex-col items-center mt-auto mb-4">
        <div className="w-10 h-10 bg-[#FFF9E6] text-[#FFB800] rounded-full flex items-center justify-center mb-3 shrink-0">
          <Crown size={18} />
        </div>
        <h4 className="text-xs font-bold text-[#1B254B]">
          Upgrade to Premium
        </h4>
        <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">
          Unlock exclusive meals and advanced features.
        </p>
        <button className="mt-3 w-full bg-white border border-[#FFEAB2] hover:bg-[#FFFDF4] text-[#E31A1A] text-[10px] font-black py-2 rounded-lg tracking-wider transition-all flex items-center justify-center gap-1.5" onClick={() => navigate("/plans")}>
          UPGRADE NOW <ArrowRight size={12} />
        </button>
      </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
