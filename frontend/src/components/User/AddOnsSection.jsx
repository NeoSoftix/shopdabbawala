import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuHeart, LuTrash2, LuShoppingBag, LuArrowRight } from "react-icons/lu";

const CATEGORIES = ["All", "Recommended", "Sides", "Drinks", "Extras"];

const ADDONS_DATA = [
  {
    id: 1,
    name: "Fresh Salad",
    desc: "Crisp and healthy mix salad",
    price: 30,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80",
    tag: "BEST SELLER"
  },
  {
    id: 2,
    name: "Cold Drink",
    desc: "Refreshing soft drink",
    price: 40,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80",
    tag: "POPULAR"
  },
  {
    id: 3,
    name: "Gulab Jamun",
    desc: "Soft & juicy indian dessert",
    price: 50,
    category: "Extras",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80",
    tag: "SWEET"
  },
  {
    id: 4,
    name: "Curd",
    desc: "Fresh and creamy curd",
    price: 25,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80",
    tag: ""
  },
  {
    id: 5,
    name: "Butter",
    desc: "Pure and creamy butter",
    price: 20,
    category: "Extras",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=80",
    tag: "DAILY FRESH"
  },
  {
    id: 6,
    name: "Paneer",
    desc: "Soft and fresh cottage cheese",
    price: 60,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80",
    tag: "HIGH PROTEIN"
  },
  {
    id: 7,
    name: "Roasted Papad",
    desc: "Crispy roasted papad",
    price: 15,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&auto=format&fit=crop&q=80",
    tag: ""
  },
  {
    id: 8,
    name: "Mixed Pickle",
    desc: "Spicy and tangy pickle",
    price: 20,
    category: "Extras",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&auto=format&fit=crop&q=80",
    tag: ""
  }
];

export default function AddonsSection() {
  const [activeTab, setActiveTab] = useState("All");
  const [cart, setCart] = useState({});
  const [favorites, setExpandedCards] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  const toggleFavorite = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    setToastMessage(`${item.name} added`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const updatedCart = { ...prev };
        delete updatedCart[id];
        return updatedCart;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const clearAllCart = () => {
    setCart({});
  };

  const filteredItems = ADDONS_DATA.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Recommended") return item.tag !== "";
    return item.category === activeTab;
  });

  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalCartAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = ADDONS_DATA.find((f) => f.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const cartItemNames = Object.entries(cart)
    .map(([id]) => ADDONS_DATA.find((f) => f.id === parseInt(id))?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <section className="relative w-full min-h-screen bg-[#FDFBF9] py-16 px-4 sm:px-8 lg:px-16 font-sans select-none pb-36">
      
      {/* Top Main Heading Header Panel */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="text-left">
          <span className="text-xs font-black tracking-widest text-red-600 uppercase block mb-1">
            CUSTOMIZE YOUR MEAL
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Add-<span className="text-red-600">ons</span>
          </h2>
          <p className="text-gray-400 font-medium text-xs sm:text-sm mt-2">
            Add extra items and make your meal perfect.
          </p>
        </div>

        {/* Categories Symmetrical Filtering Horizontal Grid Deck */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 max-w-full">
          {CATEGORIES.map((tab) => {
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all cursor-pointer focus:outline-none
                  ${isTabActive 
                    ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/10 scale-105" 
                    : "bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Items Cards Grid Frame Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const qtyInCart = cart[item.id] || 0;
            const isFavorite = favorites[item.id];

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`relative flex flex-col justify-between bg-white rounded-3xl p-5 border transition-all duration-300 group
                  ${qtyInCart > 0 
                    ? "border-red-500 shadow-[0_20px_40px_rgba(231,0,11,0.05)] scale-[1.01]" 
                    : "border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] hover:border-slate-300"}`}
              >
                {/* Floating Heart & Tags Node Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  {item.tag ? (
                    <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full text-white shadow-sm
                      ${item.tag === "BEST SELLER" || item.tag === "POPULAR" ? "bg-red-600" : "bg-amber-500"}`}>
                      🔥 {item.tag}
                    </span>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm pointer-events-auto text-slate-400 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
                  >
                    <LuHeart size={16} strokeWidth={2.5} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                  </button>
                </div>

                {/* Card Media Top Header Panel Area */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-50 border-4 border-slate-50 shadow-inner flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-105">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-full" />
                  </div>

                  {/* Title Hover Color Change */}
                  <h3 className={`text-lg font-black tracking-tight leading-tight uppercase transition-colors duration-300 
                    ${qtyInCart > 0 ? "text-red-600" : "text-slate-900 group-hover:text-red-600"}`}>
                    {item.name}
                  </h3>
                  
                  {/* Desc Hover Color Change */}
                  <p className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300 text-xs font-semibold mt-1 max-w-[200px] mx-auto min-h-[32px]">
                    {item.desc}
                  </p>
                  
                  {/* Price Hover Dynamic Scaling Feel */}
                  <div className={`font-black text-lg mt-2 transition-colors duration-300 
                    ${qtyInCart > 0 ? "text-red-600" : "text-[#111625] group-hover:text-red-600"}`}>
                    ₹{item.price}
                  </div>
                </div>

                {/* Card Bottom CTA Increment Trigger Systems */}
                <div className="mt-5 pt-3 border-t border-slate-50">
                  {qtyInCart > 0 ? (
                    <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl p-1 w-full">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 rounded-xl bg-white text-red-600 border border-red-100 shadow-sm flex items-center justify-center font-bold text-lg hover:bg-red-50 transition-colors cursor-pointer focus:outline-none"
                      >
                        —
                      </button>
                      <span className="font-black text-slate-900 text-base px-2">
                        {qtyInCart}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg hover:bg-red-700 shadow-md shadow-red-500/10 transition-colors cursor-pointer focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    /* Add button converted to solid brand Red */
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full h-[46px] rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest shadow-md shadow-red-500/10 transition-all focus:outline-none cursor-pointer"
                    >
                      <span>+</span> Add
                    </button>
                  )}
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Modern Dynamic Interactive Toast Alert Systems */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 border border-slate-800"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">✓</div>
            <span className="text-xs font-bold uppercase tracking-wider">{toastMessage} successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FIXED FLOATING FOOTER BILLING BAR CONTAINER ================= */}
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
              
              {/* Left Column Parameters */}
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="relative w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-inner">
                  <LuShoppingBag size={20} strokeWidth={2.5} />
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

              {/* Right Column Checkout Actions Trigger */}
              <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest block uppercase">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{totalCartAmount}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAllCart}
                    className="p-3.5 rounded-2xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-colors focus:outline-none cursor-pointer"
                    title="Clear All Cart"
                  >
                    <LuTrash2 size={18} strokeWidth={2.5} />
                  </button>
                  
                  <button
                    className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md shadow-red-500/20 transition-all active:scale-[0.98] flex items-center gap-2 group focus:outline-none cursor-pointer"
                  >
                    <span>Add to Cart</span>
                    <LuArrowRight size={14} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}