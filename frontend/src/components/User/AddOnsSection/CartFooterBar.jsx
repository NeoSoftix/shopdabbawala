import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBasket, FaTrash, FaArrowRight } from "react-icons/fa";

export default function CartFooterBar({
  cartItemsCount,
  cartItemNames,
  totalCartAmount,
  onClearCart,
  onCheckout,
}) {
  return (
    <AnimatePresence>
      {cartItemsCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] z-40 p-4 sm:p-5"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-inner">
                <FaShoppingBasket size={18} />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartItemsCount}
                </span>
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-wide">
                  {cartItemsCount} Items Added
                </h4>
                <p className="text-xs font-bold text-gray-400 truncate max-w-[220px] sm:max-w-md uppercase tracking-wider mt-0.5">
                  {cartItemNames || "Custom packages selection bundles"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-black text-gray-400 tracking-widest block uppercase">
                  Total Amount
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  ₹{totalCartAmount}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClearCart}
                  className="p-3.5 rounded-2xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                  title="Clear All Cart"
                >
                  <FaTrash size={16} />
                </button>

                <button
                  onClick={onCheckout}
                  className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md shadow-red-500/20 transition-all active:scale-[0.98] flex items-center gap-2 group focus:outline-none cursor-pointer"
                >
                  <span>Checkout Order</span>
                  <FaArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
