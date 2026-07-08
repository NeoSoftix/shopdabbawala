import { motion, AnimatePresence } from "framer-motion";
import PackageGridCard from "./PackageGridCard";
import { isCurrentPlan } from "./packageUtils";

// Full-screen modal overlay listing every active package in a grid, so users
// can browse without stepping through the carousel one card at a time.
export default function ViewAllPackagesModal({
  isOpen,
  onClose,
  packages,
  activeSubscriptions,
  onChoosePlan,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl z-10 p-6 md:p-10 max-h-[85vh] overflow-y-auto pointer-events-auto border border-slate-100"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors focus:outline-none shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                All Meal Packages
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-1.5">
                Browse and select your perfect health subscription bundle
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <PackageGridCard
                  key={pkg._id}
                  pkg={pkg}
                  isCurrentPlan={isCurrentPlan(pkg, activeSubscriptions)}
                  onChoose={() => onChoosePlan(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
