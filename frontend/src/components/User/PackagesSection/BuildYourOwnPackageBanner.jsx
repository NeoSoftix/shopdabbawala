import { ArrowRight } from "lucide-react";

// CTA banner promoting the custom "build your own package" flow.
export default function BuildYourOwnPackageBanner({ onCustomize }) {
  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 relative z-30 flex-shrink-0 mt-3">
      <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-3.5 sm:p-4 md:p-5 shadow-[0_25px_50px_-10px_rgba(220,38,38,0.25)] border border-red-400/20 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0 backdrop-blur-sm">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white text-sm sm:text-base md:text-lg font-black uppercase tracking-wide">
              BUILD YOUR OWN PACKAGE
            </h3>
            <p className="text-red-50/80 mt-0.5 text-[10px] sm:text-xs font-semibold">
              Customize calories, proteins, meal count, and delivery schedule.
            </p>
          </div>
        </div>

        <button
          className="relative z-10 w-full md:w-auto bg-white text-slate-950 font-black text-[10px] sm:text-xs tracking-widest uppercase px-6 sm:px-7 py-2.5 rounded-xl shadow-md transition-all duration-300 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-1.5 group whitespace-nowrap focus:outline-none cursor-pointer"
          onClick={onCustomize}
        >
          Customize Now
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight size={16} />
          </span>
        </button>
      </div>
    </div>
  );
}
