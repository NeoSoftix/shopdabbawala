import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Saare icons Font Awesome (fa) se import kiye gaye hain
// 'react-icons/fa' (Font Awesome Standard v5) ka use karein
import { FaHeart, FaRegHeart, FaTrash, FaArrowRight, FaCheckCircle } from "react-icons/fa";
// Kuch versions mein Shopping bag aur X mark ka naam alag hota hai, isliye inko 'fa' ke compatible names se replace kiya:
import { FaShoppingBasket, FaTimes } from "react-icons/fa";

// Path ko apne folder structure ke according adjust karlein
import { getActiveAddOns } from "../../service/addOn.service"; 

export default function AddonsSection() {
  const [addonsData, setAddonsData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeTab, setActiveTab] = useState("All");
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MODAL & CHECKOUT STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Preview, 2: Pincode, 3: Details, 4: OTP, 5: Success
  const [pincode, setPincode] = useState("");
  const [addressData, setAddressData] = useState({ city: "", state: "" });
  const [pincodeError, setPincodeError] = useState("");
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Sample deliverable pincodes list
  const DELIVERABLE_PINCODES = ["110001", "400001", "700001", "600001", "144001"]; 

  useEffect(() => {
    const fetchActiveAddons = async () => {
      try {
        setLoading(true);
        const result = await getActiveAddOns();

        if (result.success && result.data) {
          setAddonsData(result.data);
          const dynamicCategories = result.data
            .map((item) => item.category)
            .filter((category) => category); 
          
          const uniqueCategories = ["All", "Recommended", ...new Set(dynamicCategories)];
          setCategories(uniqueCategories);
        } else {
          setError(result.message || "Failed to fetch active add-ons");
        }
      } catch (err) {
        console.error("Error fetching add-ons via service:", err);
        setError("Something went wrong while loading add-ons.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAddons();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item._id]: (prev[item._id] || 0) + 1 }));
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

  // --- MODAL HANDLERS ---
  const handleOpenCheckout = () => {
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setPincode("");
    setAddressData({ city: "", state: "" });
    setPincodeError("");
    setUserData({ name: "", email: "", phone: "" });
    setOtp("");
    setOtpError("");
  };

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    setPincodeError("");

    if (pincode.length !== 6) {
      setPincodeError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!DELIVERABLE_PINCODES.includes(pincode)) {
      setPincodeError("Sorry, we do not deliver to this area.");
      return;
    }

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setAddressData({
          city: postOffice.District,
          state: postOffice.State,
        });
        setModalStep(3);
      } else {
        setPincodeError("Invalid pincode details.");
      }
    } catch (err) {
      setAddressData({ city: "Your City", state: "Your State" });
      setModalStep(3);
    }
  };

  const handleUserDetailsSubmit = (e) => {
    e.preventDefault();
    setModalStep(4);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp === "1234") { 
      setModalStep(5);
    } else {
      setOtpError("Invalid OTP. Enter '1234' for testing.");
    }
  };

  const handleFinalDone = () => {
    clearAllCart();
    handleCloseModal();
  };

  const filteredItems = addonsData.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Recommended") return item.tag && item.tag !== "";
    return item.category && item.category.toLowerCase() === activeTab.toLowerCase();
  });

  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  
  const totalCartAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = addonsData.find((f) => f._id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const cartItemNames = Object.entries(cart)
    .map(([id]) => addonsData.find((f) => f._id === id)?.name)
    .filter(Boolean)
    .join(", ");

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF9] p-4 text-center">
        <div className="text-red-600 font-bold max-w-md">{error}</div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-[#FDFBF9] p-[15px] sm:p-8 lg:px-16 font-sans select-none pb-36">      
      {/* Header Info Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
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

        {/* Dynamic Categories Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((tab) => {
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

      {/* Dynamic Main Addons Grid Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const qtyInCart = cart[item._id] || 0;
            const isFavorite = favorites[item._id];

            return (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`relative flex flex-col justify-between bg-white rounded-3xl p-5 border transition-all duration-300 group
                  ${qtyInCart > 0 
                    ? "border-red-500 shadow-[0_20px_40px_rgba(231,0,11,0.05)] scale-[1.01]" 
                    : "border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] hover:border-slate-300"}`}
              >
                {/* Badge Tags & Favorites */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  {item.tag ? (
                    <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full text-white shadow-sm
                      ${item.tag === "BEST SELLER" || item.tag === "POPULAR" ? "bg-red-600" : "bg-amber-500"}`}>
                      🔥 {item.tag}
                    </span>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={() => toggleFavorite(item._id)}
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
                      src={item.image?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>

                  <h3 className={`text-lg font-black tracking-tight leading-tight uppercase transition-colors duration-300 
                    ${qtyInCart > 0 ? "text-red-600" : "text-slate-900 group-hover:text-red-600"}`}>
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300 text-xs font-semibold mt-1 max-w-[200px] mx-auto min-h-[32px]">
                    {item.description || "Freshly prepared add-on option"}
                  </p>
                  
                  <div className={`font-black text-lg mt-2 transition-colors duration-300 
                    ${qtyInCart > 0 ? "text-red-600" : "text-[#111625] group-hover:text-red-600"}`}>
                    ₹{item.price}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-50">
                  {qtyInCart > 0 ? (
                    <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl p-1 w-full">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-10 h-10 rounded-xl bg-white text-red-600 border border-red-100 shadow-sm flex items-center justify-center font-bold text-lg hover:bg-red-50 transition-colors cursor-pointer focus:outline-none"
                      >
                        —
                      </button>
                      <span className="font-black text-slate-900 text-base px-2">
                        {qtyInCart}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg hover:bg-red-700 shadow-md shadow-red-500/10 transition-colors cursor-pointer focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  ) : (
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

      {/* Floating Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 border border-slate-800"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">✓</div>
            <span className="text-xs font-bold uppercase tracking-wider">{toastMessage} successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM BILLING FOOTER FLOATING CARD BAR */}
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
                  <span className="text-[10px] font-black text-gray-400 tracking-widest block uppercase">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{totalCartAmount}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAllCart}
                    className="p-3.5 rounded-2xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                    title="Clear All Cart"
                  >
                    <FaTrash size={16} />
                  </button>
                  
                  <button
                    onClick={handleOpenCheckout}
                    className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md shadow-red-500/20 transition-all active:scale-[0.98] flex items-center gap-2 group focus:outline-none cursor-pointer"
                  >
                    <span>Checkout Order</span>
                    <FaArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CHECKOUT SYSTEM MULTI-STEP MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Layout wrapper */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto font-sans"
            >
              {/* Close Button element (FaTimes used here) */}
              {modalStep !== 5 && (
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                >
                  <FaTimes size={18} />
                </button>
              )}

              {/* STEP 1: PREVIEW */}
              {modalStep === 1 && (
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Order Preview</h3>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto mb-6 pr-2">
                    {Object.entries(cart).map(([id, qty]) => {
                      const item = addonsData.find((f) => f._id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"} 
                              alt={item.name} 
                              className="w-12 h-12 rounded-full object-cover bg-slate-100" 
                            />
                            <div>
                              <h5 className="font-bold text-slate-900 text-sm uppercase">{item.name}</h5>
                              <span className="text-xs font-semibold text-gray-400">₹{item.price} x {qty}</span>
                            </div>
                          </div>
                          <span className="font-black text-slate-900 text-sm">₹{item.price * qty}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-6">
                    <span className="font-black text-slate-900 uppercase text-xs tracking-wider">Grand Total:</span>
                    <span className="text-2xl font-black text-red-600">₹{totalCartAmount}</span>
                  </div>
                  <button
                    onClick={() => setModalStep(2)}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                  >
                    Confirm Order
                  </button>
                </div>
              )}

              {/* STEP 2: PINCODE SEARCH ENGINE */}
              {modalStep === 2 && (
                <form onSubmit={handlePincodeSubmit}>
                  {/* ... Same content unchanged ... */}
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Check Availability</h3>
                  <p className="text-xs font-medium text-gray-400 mb-6">Please enter your 6-digit pincode to check deliverability status.</p>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter Pincode (Try: 144001 or 110001)"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-red-500 bg-slate-50/50"
                    />
                    {pincodeError && <p className="text-red-500 font-bold text-xs mt-2 pl-1">⚠️ {pincodeError}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                  >
                    Verify Area
                  </button>
                </form>
              )}

              {/* STEP 3: USER PROFILE CAPTURE FORM */}
              {modalStep === 3 && (
                <form onSubmit={handleUserDetailsSubmit}>
                  {/* ... Same content unchanged ... */}
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Contact Details</h3>
                  <div className="bg-emerald-50 text-emerald-700 rounded-xl p-2.5 mb-5 text-[11px] font-bold flex gap-1.5 items-center">
                    <span>✓</span> Available in: {addressData.city}, {addressData.state}
                  </div>

                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-red-500 bg-slate-50/50 text-sm"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-red-500 bg-slate-50/50 text-sm"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Phone Number"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value.replace(/\D/g, "") })}
                      className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-red-500 bg-slate-50/50 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                  >
                    Send OTP Verification
                  </button>
                </form>
              )}

              {/* STEP 4: SECURE OTP MODULE */}
              {modalStep === 4 && (
                <form onSubmit={handleOtpVerify}>
                  {/* ... Same content unchanged ... */}
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Phone Verification</h3>
                  <p className="text-xs font-medium text-gray-400 mb-6">Enter OTP sent to +91 {userData.phone}. Use master bypass code <b>1234</b>.</p>

                  <div className="mb-4">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl font-black text-center tracking-widest text-slate-900 text-xl focus:outline-none focus:border-red-500 bg-slate-50/50"
                    />
                    {otpError && <p className="text-red-500 font-bold text-xs mt-2 text-center">⚠️ {otpError}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                  >
                    Verify & Pay
                  </button>
                </form>
              )}

              {/* STEP 5: SUCCESS ARCHITECTURE */}
              {modalStep === 5 && (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="text-emerald-500 flex justify-center mb-4"
                  >
                    {/* FaCheckCircle used here to replace FaCircleCheck */}
                    <FaCheckCircle size={64} className="text-emerald-500" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Order Success!</h3>
                  <p className="text-sm font-semibold text-gray-500 max-w-xs mx-auto mb-6">
                    Awesome, {userData.name}! Payment received, your custom add-on list has been booked successfully!
                  </p>
                  <button
                    onClick={handleFinalDone}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}