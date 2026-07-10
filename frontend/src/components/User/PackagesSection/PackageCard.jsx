import { motion } from "framer-motion";
import { Zap, Tag } from "lucide-react";
import { DEFAULT_IMAGES } from "./packageUtils";

// A single plan card within the interactive carousel. Position/scale/rotation
// are computed by the parent carousel and passed in as `xPosition`/`distance`.
export default function PackageCard({
  pkg,
  isActive,
  distance,
  xPosition,
  isCurrentPlan,
  onSelect,
  onDragEnd,
  onOpenFeatures,
  onChoosePlan,
}) {
  const visibleFeatures = pkg.features.slice(0, 3);

  return (
    <motion.div
      onClick={() => !isActive && onSelect()}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      animate={{
        x: xPosition,
        scale: isActive ? 1 : 0.86,
        opacity: 1,
        rotate: isActive ? 0 : distance * 3,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      whileHover={{
        scale: isActive ? 1.02 : 0.9,
      }}
      className="absolute w-[230px] sm:w-[265px] md:w-[290px] overflow-visible select-none touch-pan-y"
      style={{
        zIndex: isActive ? 30 : 10,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div
        className="relative bg-white rounded-[2rem] border p-4 sm:p-5 flex flex-col justify-between h-full min-h-[370px] sm:min-h-[400px] md:min-h-[430px] cursor-pointer shadow-2xl transition-colors duration-300"
        style={{
          boxShadow: isActive
            ? "0 30px 60px rgba(220,38,38,0.15)"
            : "0 15px 35px rgba(0,0,0,0.06)",
          borderColor: isActive ? "#ef4444" : "#f1f5f9",
        }}
      >
        {pkg.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-md z-30 whitespace-nowrap flex items-center gap-1">
            <Zap size={10} className="fill-current" /> POPULAR CHOICE
          </div>
        )}

        {pkg.hasDiscount && (
  <div className="absolute -top-4 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full text-xs font-extrabold tracking-wide shadow-xl z-30 whitespace-nowrap border border-white/30 flex items-center gap-1.5">
    <Tag size={13} /> {pkg.discountPercentage}% OFF
  </div>
)}

        <div className="w-full flex justify-center mb-3 md:mb-4 mt-1">
          <div
            className={`relative rounded-full overflow-hidden bg-slate-50 border-[4px] border-slate-100 shadow-md transition-all duration-500
            ${isActive ? "w-24 h-24 sm:w-26 sm:h-26 md:w-28 h-28 ring-4 ring-red-500/10" : "w-18 h-18 sm:w-20 sm:h-20"}`}
          >
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => { e.target.src = DEFAULT_IMAGES[0]; e.target.onerror = null; }}
            />
          </div>
        </div>

        <div className="text-center flex-grow flex flex-col justify-between">
          <div>
            <h3
              className={`text-base sm:text-lg md:text-xl font-black tracking-wide uppercase ${isActive ? "text-red-600" : "text-slate-800"}`}
            >
              {pkg.title}
            </h3>
            <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5">
              {pkg.meals}
            </p>

            <div className="w-8 h-[2px] bg-red-500/20 mx-auto my-2" />

            <div className="my-1 flex items-baseline justify-center gap-1.5">
              {pkg.hasDiscount && (
                <span className="text-sm sm:text-base font-bold text-slate-400 line-through">
                  {pkg.originalPrice}
                </span>
              )}
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {pkg.price}
              </span>
              <span className="text-slate-400 font-bold text-[10px] sm:text-xs ml-0.5">
                /mo
              </span>
            </div>

            <div className="my-3 overflow-hidden">
              <ul className="space-y-2 text-left max-w-[150px] sm:max-w-[190px] mx-auto">
                {visibleFeatures.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center text-slate-600 text-[11px] sm:text-xs font-semibold tracking-wide"
                  >
                    <div className="w-4 h-4 bg-red-500/10 rounded-full flex items-center justify-center mr-2.5 flex-shrink-0">
                      <svg
                        className="w-2.5 h-2.5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => onOpenFeatures(e, pkg)}
                className="mt-3.5 text-[10px] sm:text-xs font-black tracking-widest text-red-500 hover:text-red-600 transition-colors uppercase focus:outline-none block mx-auto underline decoration-dashed underline-offset-4"
              >
                View Full Features +
              </button>
            </div>
          </div>

          <button
            disabled={isCurrentPlan}
            className={`w-full py-3 sm:py-3.5 rounded-xl font-black text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 border focus:outline-none mt-2 shadow-sm ${isCurrentPlan ? "" : "cursor-pointer"}
              ${
                isCurrentPlan
                  ? "bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed shadow-none opacity-80"
                  : isActive
                    ? "bg-red-600 border-red-600 text-white shadow-red-500/20"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
              }`}
            onClick={() => onChoosePlan(pkg)}
          >
            {isCurrentPlan ? "Current Plan" : "Choose Plan"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
