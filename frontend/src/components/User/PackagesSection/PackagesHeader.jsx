// Top hero/header block for the packages section: eyebrow badge, heading and
// the "View All Packages" trigger.
export default function PackagesHeader({ onViewAll }) {
  return (
    <div className="text-center relative z-20 px-4 mb-4 md:mb-6 flex-shrink-0">
      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-red-200 shadow-md text-red-600 font-extrabold text-[10px] md:text-xs tracking-widest mb-3 md:mb-4">
        ⚡ CHOOSE YOUR PLAN
      </span>

      <h2 className="font-black tracking-tight uppercase leading-none">
        <span className="block text-[32px] sm:text-[48px] md:text-[64px] text-slate-900 tracking-tighter font-black">
          PICK YOUR
        </span>
        <span className="block text-[28px] sm:text-[42px] md:text-[54px] text-red-600 tracking-normal mt-1 font-black">
          PERFECT PACKAGE
        </span>
      </h2>

      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] sm:text-[11px] md:text-xs">
          <span className="md:hidden">
            Swipe or click cards to discover plans.
          </span>
          <span className="hidden md:inline">
            Click any card directly or use arrows to discover plans.
          </span>
        </p>
        <button
          onClick={onViewAll}
          className="mt-1 bg-white hover:bg-slate-50 text-red-600 border border-red-200 shadow-sm font-black text-[11px] md:text-xs uppercase tracking-wider px-5 py-2 rounded-full transition-all focus:outline-none"
        >
          View All Packages +
        </button>
      </div>
    </div>
  );
}
