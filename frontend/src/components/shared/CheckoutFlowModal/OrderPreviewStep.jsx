import { motion } from "framer-motion";
import { FALLBACK_ADDON_IMAGE } from "../../User/AddOnsSection/addOnsUtils";

// Step 1 for mode="addons": review the cart before checking delivery area.
export default function OrderPreviewStep({ cart, addonsData, totalCartAmount, onConfirm }) {
  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
        Order Preview
      </h3>
      <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto mb-6 pr-2">
        {Object.entries(cart).map(([id, qty]) => {
          const item = addonsData.find((f) => f._id === id);
          if (!item) return null;
          return (
            <div key={id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.image?.url || FALLBACK_ADDON_IMAGE}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover bg-slate-100"
                  onError={(e) => { e.target.src = FALLBACK_ADDON_IMAGE; e.target.onerror = null; }}
                />
                <div>
                  <h5 className="font-bold text-slate-900 text-sm uppercase">
                    {item.name}
                  </h5>
                  <span className="text-xs font-semibold text-gray-400">
                    ${item.price} x {qty}
                  </span>
                </div>
              </div>
              <span className="font-black text-slate-900 text-sm">
                ${item.price * qty}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-6">
        <span className="font-black text-slate-900 uppercase text-xs tracking-wider">
          Grand Total:
        </span>
        <span className="text-2xl font-black text-red-600">
          ${totalCartAmount}
        </span>
      </div>
      <button
        onClick={onConfirm}
        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
      >
        Confirm Order
      </button>
    </motion.div>
  );
}
