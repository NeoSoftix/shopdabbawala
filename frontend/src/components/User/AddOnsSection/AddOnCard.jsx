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
      className="relative flex flex-col justify-between bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all duration-300 group"
    >
      {/* Badge Tags & Favorites */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        {item.tag ? (
          <span
            className={`flex items-center gap-1 text-[9px] font-black tracking-widest px-3 py-1 rounded-full text-white shadow-sm
            ${item.tag === "BEST SELLER" || item.tag === "POPULAR" ? "bg-red-600" : "bg-amber-500"}`}
          >
            <Flame size={10} /> {item.tag}
          </span>
        ) : (
          <div />
        )}

        <button
          onClick={() => onToggleFavorite(item._id)}
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm text-slate-400 hover:text-red-500 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
        >
          {isFavorite ? (
            <FaHeart size={16} className="text-red-500" />
          ) : (
            <FaRegHeart size={16} />
          )}
        </button>
      </div>

      {/* Image */}
      <div className="text-center mt-4">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-50 border-4 border-slate-50 shadow-inner flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-105">
          <img
            src={item.image?.url || FALLBACK_ADDON_IMAGE}
            alt={item.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { e.target.src = FALLBACK_ADDON_IMAGE; e.target.onerror = null; }}
          />
        </div>

        <h3 className="text-lg font-black tracking-tight leading-tight uppercase transition-colors duration-300 text-slate-900 group-hover:text-red-600">
          {item.name}
        </h3>

        <p className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300 text-xs font-semibold mt-1 max-w-[200px] mx-auto min-h-[32px]">
          {item.description || "Freshly prepared add-on option"}
        </p>

        <div className="font-black text-lg mt-2 transition-colors duration-300 text-[#111625] group-hover:text-red-600">
          ${item.price}
        </div>
      </div>

      {/* Add-ons are ordered while scheduling a meal (see DayAddOns), not
          browsed/purchased directly from this catalog page - no add-to-cart
          action here. */}
      <div className="mt-5 pt-3 border-t border-slate-50 text-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Add while scheduling your meal
        </span>
      </div>
    </motion.div>
  );
}
