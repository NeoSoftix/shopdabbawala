import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Flame } from "lucide-react";

import { FALLBACK_ADDON_IMAGE } from "./addOnsUtils";

export default function AddOnCard({
  item,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative flex flex-col justify-between bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-300 group"
    >
      {/* Favorite */}
      <button
        onClick={() => onToggleFavorite(item._id)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm text-slate-400 hover:text-red-500 transition-colors focus:outline-none cursor-pointer flex items-center justify-center z-10"
      >
        {isFavorite ? (
          <FaHeart size={12} className="text-red-500" />
        ) : (
          <FaRegHeart size={12} />
        )}
      </button>

      {/* Image (left) + Details (right) */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden bg-slate-50 border-2 border-slate-50 shadow-inner flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <img
            src={item.image?.url || FALLBACK_ADDON_IMAGE}
            alt={item.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { e.target.src = FALLBACK_ADDON_IMAGE; e.target.onerror = null; }}
          />
        </div>

        <div className="text-left min-w-0 pr-6">
          {item.tag && (
            <span
              className={`inline-flex items-center gap-1 text-[7px] font-black tracking-widest px-1.5 py-0.5 rounded-full text-white shadow-sm mb-1
              ${item.tag === "BEST SELLER" || item.tag === "POPULAR" ? "bg-red-600" : "bg-amber-500"}`}
            >
              <Flame size={7} /> {item.tag}
            </span>
          )}

          <h3 className="text-[11px] font-black tracking-tight leading-tight uppercase transition-colors duration-300 text-slate-900 group-hover:text-red-600 truncate">
            {item.name}
          </h3>

          <p className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300 text-[9px] font-semibold mt-0.5 truncate">
            {item.description || "Freshly prepared add-on option"}
          </p>

          <div className="font-black text-sm mt-1 transition-colors duration-300 text-[#111625] group-hover:text-red-600">
            ${item.price}
          </div>
        </div>
      </div>

      {/* Add-ons are ordered while scheduling a meal (see DayAddOns), not
          browsed/purchased directly from this catalog page - no add-to-cart
          action here. */}
      <div className="mt-2 pt-1.5 border-t border-slate-50 text-center">
        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
          Add while scheduling your meal
        </span>
      </div>
    </motion.div>
  );
}
