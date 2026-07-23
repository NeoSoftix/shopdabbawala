import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_IMAGES } from "./packageUtils";

// Modal showing the full feature list for a single package. Renders nothing
// when `pkg` is falsy (mirrors the previous inline conditional render).
export default function PackageFeaturesModal({ pkg, onClose, onChoosePlan }) {
  return (
    <AnimatePresence>
      {pkg && (
        <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl z-10 p-6 sm:p-8 border border-slate-100 pointer-events-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors focus:outline-none shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-4 border-slate-50 shadow-md">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = DEFAULT_IMAGES[0]; e.target.onerror = null; }}
                />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide">
                {pkg.title} Plan
              </h3>
              <p className="text-red-600 font-extrabold text-sm uppercase tracking-wider mt-0.5">
                {pkg.meals} • {pkg.price}/mo
              </p>
            </div>

            <div className="w-full h-[1px] bg-slate-100 mb-5" />

            <h4 className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-3 text-left">
              Included Premium Features
            </h4>
            <ul className="space-y-3 text-left mb-6">
              {pkg.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center text-slate-700 text-xs sm:text-sm font-semibold tracking-wide"
                >
                  <div className="w-5 h-5 bg-red-500/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-red-600"
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
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                onChoosePlan?.(pkg);
                onClose();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all focus:outline-none"
            >
              Buy Now
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
