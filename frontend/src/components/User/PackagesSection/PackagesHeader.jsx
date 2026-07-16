import { Zap } from "lucide-react";

export default function PackagesHeader({ onViewAll }) {
  return (
    <div className="text-center relative z-20 px-4 mb-2 md:mb-3 flex-shrink-0">
      <h2 className="text-[15px] sm:text-[25px] md:text-[30px] font-black uppercase tracking-tight text-slate-900">
        <span className="text-slate-900">PICK YOUR </span>
        <span className="text-red-600">PERFECT PACKAGE</span>
      </h2>

      <div className="mt-3 flex flex-col items-center gap-1.5">
        {/* <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] sm:text-[10px] md:text-[11px]">
          <span className="md:hidden">
            Swipe or click cards to discover plans.
          </span>
          <span className="hidden md:inline">
            Click any card directly or use arrows to discover plans.
          </span>
        </p> */}

        <button
          onClick={onViewAll}
          className="bg-white hover:bg-slate-50 text-red-600 border border-red-200 shadow-sm font-black text-[10px] md:text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-full transition-all focus:outline-none"
        >
          View All Packages +
        </button>
      </div>
    </div>
  );
}
