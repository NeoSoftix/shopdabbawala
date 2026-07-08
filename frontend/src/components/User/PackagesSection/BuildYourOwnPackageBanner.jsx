// CTA banner promoting the custom "build your own package" flow.
export default function BuildYourOwnPackageBanner({ onCustomize }) {
  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 relative z-30 flex-shrink-0 mt-6">
      <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-6 sm:p-7 md:p-8 shadow-[0_25px_50px_-10px_rgba(220,38,38,0.25)] border border-red-400/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0 backdrop-blur-sm">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
            <h3 className="text-white text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide">
              BUILD YOUR OWN PACKAGE
            </h3>
            <p className="text-red-50/80 mt-1 text-[10px] sm:text-xs font-semibold">
              Customize calories, proteins, meal count, and delivery schedule.
            </p>
          </div>
        </div>

        <button
          className="relative z-10 w-full md:w-auto bg-white text-slate-950 font-black text-[10px] sm:text-xs tracking-widest uppercase px-7 sm:px-9 py-3.5 rounded-xl shadow-md transition-all duration-300 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-1.5 group whitespace-nowrap focus:outline-none cursor-pointer"
          onClick={onCustomize}
        >
          Customize Now
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
