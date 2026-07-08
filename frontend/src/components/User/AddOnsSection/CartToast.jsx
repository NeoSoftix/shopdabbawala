import { motion, AnimatePresence } from "framer-motion";

export default function CartToast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 border border-slate-800"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">
            ✓
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">
            {message} successfully!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
