import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

/**
 * Modal backdrop + centered panel shell (open/close animation, gradient
 * top bar, scrollable body, optional close button). Purely presentational.
 */
export default function Modal({ isOpen, onClose, wide, maxWidthClass, showCloseButton, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative bg-white w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh] ${maxWidthClass || (wide ? "max-w-4xl" : "max-w-md")
              }`}
          >
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-400 to-red-600 shrink-0" />

            <div className="px-5 sm:px-7 pt-3 sm:pt-4 pb-5 sm:pb-7 overflow-y-auto custom-scrollbar">
              {/* Close Button */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center transition-colors z-20"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}

              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
