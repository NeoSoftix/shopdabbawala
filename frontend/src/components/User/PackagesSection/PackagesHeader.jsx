import { Zap } from "lucide-react";

// Top hero/header block for the packages section: eyebrow badge, heading and
// the "View All Packages" trigger.
export default function PackagesHeader({ onViewAll }) {
  return (
    <div className="text-center relative z-20 px-4 mb-2 md:mb-3 flex-shrink-0">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-red-200 shadow-md text-red-600 font-extrabold text-[9px] md:text-[11px] tracking-widest mb-2">
        <Zap size={11} className="fill-current" /> CHOOSE YOUR PLAN
      </span>

      <h2 className="font-black tracking-tight uppercase leading-none">
        <span className="block text-[24px] sm:text-[34px] md:text-[42px] text-slate-900 tracking-tighter font-black">
          PICK YOUR
        </span>
        <span className="block text-[20px] sm:text-[30px] md:text-[36px] text-red-600 tracking-normal mt-1 font-black">
          PERFECT PACKAGE
        </span>
      </h2>

      <div className="mt-2 flex flex-col items-center gap-1.5">
        <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] sm:text-[10px] md:text-[11px]">
          <span className="md:hidden">
            Swipe or click cards to discover plans.
          </span>
          <span className="hidden md:inline">
            Click any card directly or use arrows to discover plans.
          </span>
        </p>
        <button
          onClick={onViewAll}
          className="mt-0.5 bg-white hover:bg-slate-50 text-red-600 border border-red-200 shadow-sm font-black text-[10px] md:text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-full transition-all focus:outline-none"
        >
          View All Packages +
        </button>
      </div>
    </div>
  );
}
