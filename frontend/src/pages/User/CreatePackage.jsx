import React, { useState, useEffect } from "react";
import ThankYouPage from "../../components/User/ThankyouPage";
import vegIcon from "../../../public/spinach.svg";
import VEGICOn from "../../../public/veg icon.svg";

export default function CreatePackage({ onClose, userData }) {
  // Config States
  const [preference, setPreference] = useState("Veg");
  const [timing, setTiming] = useState("Lunch");
  const [duration, setDuration] = useState("Monthly");
  const [totalMeals, setTotalMeals] = useState(16);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // FIXED: Added missing checkoutData state initialization with Email and Address fields separately
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    phone: "",
    email: "", 
    address: "", // Added address field separately
    otp: "", 
  });

  // OTP & Workflow States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPaymentSuccessMsg, setShowPaymentSuccessMsg] = useState(false);

  // Red & White Theme Based Meal Plan State
  const [selectedPlan, setSelectedPlan] = useState("Regular");
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // Dynamic Meals adjustment based on Duration selection
  useEffect(() => {
    if (duration === "1 Meal") {
      setTotalMeals(1);
    } else if (duration === "Weekly") {
      setTotalMeals(4); // Default weekly meals
    } else if (duration === "Monthly") {
      setTotalMeals(16); // Default monthly meals
    } else if (duration === "Quarterly") {
      setTotalMeals(48); // Default quarterly meals
    }
  }, [duration]);

  // Meal Plan Details Data
  const planDetails = {
    Regular: {
      title: "Regular Plan Includes:",
      description: "Standard portion for one person",
      indian: [
        "Dal (8 oz) - choose 1 from 2 options",
        "Veg / Non-Veg Curry (8 oz) - choose 1 from 2 options",
        "Choice of Sides: 4 Rotis OR 2 Rotis + Rice",
        "Salad / Achar / Dessert (2x Weekly) (optional)",
      ],
      global:
        "A Veg/Non-Veg Continental Dish (24 oz) - choose 1 from 2 options",
    },
    Large: {
      title: "Large Plan Includes:",
      description: "Extra portion for hearty appetite",
      indian: [
        "Dal (12 oz) - premium selection",
        "Veg / Non-Veg Curry (12 oz) - richer portions",
        "Choice of Sides: 6 Rotis OR 4 Rotis + Rice",
        "Salad / Achar / Dessert (Included Daily)",
      ],
      global:
        "A Veg/Non-Veg Continental Dish (32 oz) - customized chef options",
    },
    "Large Premium": {
      title: "Large Premium Plan Includes:",
      description: "Premium ingredients + extra sides",
      indian: [
        "Dal (12 oz) - organic premium collection",
        "Veg / Non-Veg Curry (12 oz) - luxury protein base",
        "Choice of Sides: Unlimited Rotis OR Premium Basmati Rice Choice",
        "Appetizer + Salad + Complete Premium Dessert Platter Daily",
      ],
      global:
        "Premium Gourmet Continental Platter (36 oz) with extra side assortments",
    },
  };

  // Dynamic Meal Pricing Options Data Array
  const getMealOptions = () => {
    if (duration === "1 Meal") {
      return [{ count: 1, price: "$15.00", label: "Single Tiffin" }];
    }
    if (duration === "Weekly") {
      return [
        { count: 4, price: "$12.50", label: "4 Meals / Week" },
        { count: 5, price: "$12.00", label: "5 Meals / Week" },
        { count: 6, price: "$11.50", label: "6 Meals / Week" },
      ];
    }
    if (duration === "Quarterly") {
      return [
        { count: 48, price: "$10.95", label: "4 Meals / Week" },
        { count: 60, price: "$10.50", label: "5 Meals / Week" },
        { count: 72, price: "$9.95", label: "6 Meals / Week" },
      ];
    }
    // Default "Monthly" options
    return [
      { count: 16, price: "$11.95", label: "4 Meals / Week" },
      { count: 20, price: "$11.50", label: "5 Meals / Week" },
      { count: 24, price: "$10.95", label: "6 Meals / Week" },
    ];
  };

  // Price Calculation Logic
  const planMultiplier =
    selectedPlan === "Regular" ? 1 : selectedPlan === "Large" ? 1.2 : 1.4;

  // Find base price based on selected total meals count
  const currentOptions = getMealOptions();
  const matchedOption =currentOptions.find((o) => o.count === totalMeals) || currentOptions[0];
  const basePricePerMeal = parseFloat(matchedOption.price.replace("$", ""));

  const pricePerMeal = parseFloat(
    (basePricePerMeal * planMultiplier).toFixed(2),
  );
  const subtotal = totalMeals * pricePerMeal * quantity;
  const discount = subtotal * 0.2; // 20% Off
  const deliveryCharges = deliveryMethod === "Delivery" ? 15.0 : 0.0;
  const totalAmount = subtotal - discount + deliveryCharges;

  // OTP Actions
  const handleSendOtp = () => {
    if (!checkoutData.phone) {
      alert("Please enter phone number");
      return;
    }
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!checkoutData.otp) {
      alert("Please enter OTP");
      return;
    }
    setIsOtpVerified(true);
    setShowPaymentSuccessMsg(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.phone || !checkoutData.email || !checkoutData.address) {
      alert("Please fill all details");
      return;
    }
    setShowCheckoutForm(false);
    setShowSuccess(true);
  };

  return (
    <div className={`bg-white rounded-[2.5rem] ${onClose ? "h-auto" : "h-screen"}`}>
      {showSuccess ? (
       <ThankYouPage setShowSuccess={setShowSuccess} />
      ) : showCheckoutForm ? (
        /* ================= CHECKOUT FORM VIEW ================= */
        <div className="bg-[#f9f9fb] text-gray-800 font-sans antialiased min-h-[500px] py-10 px-4 flex flex-col items-center justify-center relative rounded-[2.5rem]">
          <button
            type="button"
            onClick={() => {
              setShowCheckoutForm(false);
              setIsOtpSent(false);
              setIsOtpVerified(false);
              setShowPaymentSuccessMsg(false);
            }}
            className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
          >
            ← Back to Summary
          </button>

          <div className="max-w-md w-full space-y-4">
            {/* Green Success Message in English */}
            {showPaymentSuccessMsg && (
              <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-2xl text-xs font-bold text-center shadow-md">
                🎉 Your payment has been successfully processed! Please provide your delivery and contact details below to proceed with your order.
              </div>
            )}

            <div className="w-full bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xl">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight uppercase mb-1">
                Checkout Details
              </h2>
              <p className="text-gray-500 text-xs mb-5 leading-relaxed">
                Please provide your information to complete the meal subscription booking.
              </p>

              {/* STEP 1: OTP and Phone verification */}
              {!isOtpVerified ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        required
                        placeholder="Enter phone number"
                        value={checkoutData.phone}
                        onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                      />
                      {!isOtpSent && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="bg-[#dc2626] text-white px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-[#b91c1c] transition-all"
                        >
                          Send OTP
                        </button>
                      )}
                    </div>
                  </div>

                  {isOtpSent && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter OTP"
                          value={checkoutData.otp}
                          onChange={(e) => setCheckoutData({ ...checkoutData, otp: e.target.value })}
                          className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="w-full bg-[#dc2626] text-white py-2.5 rounded-xl text-xs font-black tracking-widest uppercase shadow-sm hover:bg-[#b91c1c] transition-all"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* STEP 2: Name, Phone, Email & Address Details Form after verification */
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      readOnly
                      placeholder="Enter phone number"
                      value={checkoutData.phone}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-500 focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={checkoutData.email || ""}
                      onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-gray-600 uppercase mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      required
                      rows="2"
                      placeholder="Enter your complete delivery address"
                      value={checkoutData.address || ""}
                      onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] resize-none"
                    />
                  </div>

                  <div className="bg-[#f4f5f7] p-3 rounded-xl text-xs font-bold text-slate-600 mt-2">
                    <div className="flex justify-between">
                      <span>Total Amount Paid:</span>
                      <span className="text-[#dc2626] font-black text-sm">${(totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#dc2626] text-white py-2.5 rounded-xl text-xs font-black tracking-widest uppercase shadow-sm hover:bg-[#b91c1c] transition-all active:scale-[0.98] focus:outline-none mt-2"
                  >
                    Submit & Complete Order
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={`bg-[#f9f9fb] text-gray-800 font-sans antialiased ${onClose ? "h-auto rounded-[2.5rem]" : "min-h-screen"} py-3 px-2 sm:px-4 lg:px-5 relative`}>
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
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
            )}

            <main className="max-w-full bg-white/50 rounded-3xl">
              {/* ================= HEADER AREA WITH USER DETAILS ================= */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1.5 pb-1.5 border-b border-gray-200/60 px-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
                    Create Your Plan
                  </h1>
                  <p className="text-gray-500 text-xs max-w-2xl leading-relaxed">
                    Customize your culinary journey with premium ingredients delivered to your doorstep.
                  </p>
                </div>

                {userData && (
                  <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-4 flex items-center gap-x-6 gap-y-2 shadow-sm min-w-[280px] md:max-w-md self-start md:self-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-wider text-red-500 uppercase">
                        Pincode
                      </span>
                      <span className="text-sm font-bold text-slate-700 bg-red-100/40 px-2 py-0.5 rounded-md border border-red-100/70">
                        {userData.pincode || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pickup / Delivery selector for mobile/small screens, shown below header */}
              <div className="lg:hidden px-2 mb-3">
                <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="bg-[#f3f1f1] p-1 rounded-full flex border border-gray-200/40">
                    {/* Pickup Button */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("Pickup")}
                      className={`w-1/2 py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                        deliveryMethod === "Pickup"
                          ? "bg-white text-gray-900 shadow-sm font-extrabold"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v3.25c0 .414.336.75.75.75Z"
                        />
                      </svg>
                      <span>Pickup</span>
                    </button>

                    {/* Delivery Button */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("Delivery")}
                      className={`w-1/2 py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                        deliveryMethod === "Delivery"
                          ? "bg-white text-gray-900 shadow-sm font-extrabold"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <circle cx="6" cy="18" r="2.5" />
                        <circle cx="18" cy="18" r="2.5" />
                        <path
                          d="M12 18V13H16L18 9M9 13H12M12 13L10 7H14"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Delivery</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
                {/* Left Configurator Side */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Row 1: Preference & Timing */}
                  <div className="bg-white p-2.5 px-3 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Meal Preference Toggle */}
                      <div>
                        <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                          <span>🍴</span> Meal Preference
                        </label>
                        <div className="bg-[#f3f1f1] p-1 rounded-full flex border border-gray-200/40">
                          <button
                            type="button"
                            onClick={() => setPreference("Veg")}
                            className={`w-1/2 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none ${
                              preference === "Veg"
                                ? "bg-white text-gray-900 shadow-sm font-extrabold"
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="flex items-center gap-2 text-green-700 font-medium">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="2.5"
                                  y="2.5"
                                  width="19"
                                  height="19"
                                  rx="2"
                                  fill="none"
                                  stroke="#16A34A"
                                  strokeWidth="2"
                                />
                                <circle cx="12" cy="12" r="4" fill="#16A34A" />
                              </svg>

                              <span>Veg</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreference("Non-Veg")}
                            className={`w-1/2 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none ${
                              preference === "Non-Veg"
                                ? "bg-white text-gray-900 shadow-sm font-extrabold"
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="flex items-center gap-2 text-red-700 font-medium">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="2.5"
                                  y="2.5"
                                  width="19"
                                  height="19"
                                  rx="2"
                                  fill="none"
                                  stroke="#DC2626"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M12 7L16.5 15H7.5L12 7Z"
                                  fill="#DC2626"
                                />
                              </svg>

                              <span>Non Veg</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Meal Timing */}
                      <div>
                        <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                          <span>🕒</span> Meal Timing
                        </label>
                        <div className="relative">
                          <select
                            value={timing}
                            onChange={(e) => setTiming(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl p-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] appearance-none"
                          >
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Both">Both</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
                            <svg
                              className="fill-current h-4 w-4"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Duration & Total Meals */}
                  <div className="bg-white p-2.5 px-3 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                        <span>📅</span> Duration
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {["1 Meal", "Weekly", "Monthly", "Quarterly"].map(
                          (d) => (
                            <button
                              type="button"
                              key={d}
                              onClick={() => setDuration(d)}
                              className={`py-2 rounded-xl text-xs font-bold border text-center transition-all focus:outline-none ${duration === d ? "border-2 border-[#dc2626] text-[#dc2626] bg-red-50/20 font-black" : "border-gray-200 text-gray-400 bg-white hover:border-[#dc2626] hover:text-slate-800"}`}
                            >
                              {d}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Total Meals config selection */}
                    <div>
                      <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                        <span>🍱</span> Total Meals
                      </label>
                      <div className="bg-[#f3f1f1] p-1 rounded-3xl border border-gray-200/40 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        {getMealOptions().map((option) => {
                          const isSelected = totalMeals === option.count;
                          return (
                            <button
                              type="button"
                              key={option.count}
                              onClick={() => setTotalMeals(option.count)}
                              className={`py-2 px-2 rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center focus:outline-none relative ${
                                isSelected
                                  ? "bg-white text-gray-900 shadow-md font-black"
                                  : "text-gray-500 hover:text-gray-800"
                              }`}
                            >
                              <div
                                className={`text-xl font-black ${isSelected ? "text-gray-900" : "text-gray-700"}`}
                              >
                                {option.count}
                              </div>
                              <div className="text-[11px] font-bold mt-0.5 opacity-90">
                                {option.price} / meal
                              </div>
                              <div className="text-[9px] mt-0.5 font-bold uppercase tracking-wide opacity-60">
                                {option.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Meal Plan Selector */}
                  <div className="bg-white p-2.5 px-3 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <label className="text-xs font-bold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                      <span>🍱</span> Select Your Meal Plan:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {Object.keys(planDetails).map((planName) => {
                        const isSelected = selectedPlan === planName;
                        return (
                          <div key={planName} className="relative group">
                            <div
                              onMouseEnter={() => setHoveredPlan(planName)}
                              onMouseLeave={() => setHoveredPlan(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setHoveredPlan(hoveredPlan === planName ? null : planName);
                              }}
                              className="absolute top-2 right-2 z-30 w-4 h-4 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#dc2626] hover:bg-red-50 flex items-center justify-center text-[10px] font-serif font-black cursor-pointer sm:cursor-help transition-all shadow-sm"
                            >
                              i
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedPlan(planName)}
                              className={`w-full p-2.5 rounded-xl text-center border transition-all flex flex-col items-center justify-center min-h-[90px] focus:outline-none relative
                                ${
                                  isSelected
                                    ? "bg-[#dc2626] text-white border-[#dc2626] shadow-lg shadow-red-600/10 font-black"
                                    : "bg-white text-gray-800 border-gray-200 hover:border-[#dc2626]/60"
                                }`}
                            >
                              <span className="text-sm font-black tracking-tight">
                                {planName}
                              </span>
                              <span
                                className={`text-[10px] font-medium mt-0.5 leading-tight max-w-[170px] ${isSelected ? "text-white/90" : "text-gray-400"}`}
                              >
                                {planDetails[planName].description}
                              </span>
                            </button>

                            {hoveredPlan === planName && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHoveredPlan(null);
                                }}
                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 w-[350px] sm:w-[250px] bg-white/95 backdrop-blur-md border border-red-100 shadow-2xl rounded-2xl p-5 text-left cursor-pointer border-t-4 border-t-[#dc2626] transition-all duration-200 pointer-events-auto"
                              >
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-red-100"></div>

                                <div className="text-xs font-black text-[#dc2626] flex items-center gap-1.5 mb-3 uppercase tracking-wide">
                                  <span>ℹ️</span> {planDetails[planName].title}
                                </div>

                                <div className="space-y-3.5">
                                  <div className="text-[11px]">
                                    <span className="font-extrabold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
                                      🚩 Indian Option
                                    </span>
                                    <ul className="list-none space-y-1.5 font-semibold text-slate-600">
                                      {planDetails[planName].indian.map(
                                        (item, idx) => (
                                          <li
                                            key={idx}
                                            className="flex items-start gap-1.5"
                                          >
                                            <span className="text-[#dc2626] mt-0.5">
                                              •
                                            </span>
                                            <span>{item}</span>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                  <div className="text-[11px] pt-2 border-t border-slate-100">
                                    <span className="font-extrabold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
                                      🌍 Global Option
                                    </span>
                                    <p className="font-semibold text-slate-600 pl-2 border-l-2 border-red-500/30">
                                      {planDetails[planName].global}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side Stack */}
                <div className="space-y-3 lg:sticky lg:top-6 relative z-10">
                  {/* Fulfillment Mode Toggle Card */}
                  <div className="hidden lg:block bg-white p-1.5 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="bg-[#f3f1f1] p-1 rounded-full flex border border-gray-200/40">
                      {/* Pickup Button */}
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("Pickup")}
                        className={`w-1/2 py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                          deliveryMethod === "Pickup"
                            ? "bg-white text-gray-900 shadow-sm font-extrabold"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v3.25c0 .414.336.75.75.75Z"
                          />
                        </svg>
                        <span>Pickup</span>
                      </button>

                      {/* Delivery Button */}
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("Delivery")}
                        className={`w-1/2 py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                          deliveryMethod === "Delivery"
                            ? "bg-white text-gray-900 shadow-sm font-extrabold"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <circle cx="6" cy="18" r="2.5" />
                          <circle cx="18" cy="18" r="2.5" />
                          <path
                            d="M12 18V13H16L18 9M9 13H12M12 13L10 7H14"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Delivery</span>
                      </button>
                    </div>
                  </div>

                  {/* Plan Summary Card */}
                  <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <div className="bg-red-50 p-2 rounded-lg text-[#dc2626]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">
                        Plan Summary
                      </h2>
                    </div>

                    <div className="py-2 space-y-1.5 text-xs font-bold border-b border-gray-100 text-slate-600 uppercase tracking-wide">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Meal Size / Tier</span>
                        <span className="text-[#dc2626] font-extrabold uppercase">
                          {selectedPlan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Meal preference</span>
                        <span className="text-slate-900">{preference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Delivery timing</span>
                        <span className="text-slate-900">{timing}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Tiffin Quantity</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-black text-gray-800 text-[10px] focus:outline-none transition-all active:scale-[0.98]"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-slate-800 min-w-[14px] text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-black text-gray-800 text-[10px] focus:outline-none transition-all active:scale-[0.98]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Duration</span>
                        <span className="text-slate-900">
                          {duration === "Monthly" ? "1 month" : duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Fulfillment</span>
                        <span className="text-[#dc2626] font-extrabold">
                          {deliveryMethod}
                        </span>
                      </div>
                    </div>

                    {/* Computations Box */}
                    <div className="bg-[#f4f5f7] p-2.5 rounded-xl my-2 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wide">
                        <span>Subtotal ({totalMeals} meals)</span>
                        <span className="text-slate-700">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-[#dc2626] uppercase tracking-wide">
                        <span>Discount (20% off)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <span>{deliveryMethod} Charges</span>
                        <span
                          className={
                            deliveryCharges === 0
                              ? "text-green-600 font-black"
                              : "text-slate-700"
                          }
                        >
                          {deliveryCharges === 0
                            ? "FREE"
                            : `$${deliveryCharges.toFixed(2)}`}
                        </span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between items-center pt-0.5">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                          Total Amount
                        </span>
                        <span className="text-lg font-black text-[#dc2626] tracking-tight">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-100 text-[#dc2626] text-[10px] rounded-xl p-1.5 text-center font-black uppercase tracking-widest mb-2 flex items-center justify-center space-x-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/xl"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Price per Tiffin: ${pricePerMeal}</span>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-[#dc2626] text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#b91c1c] transition-all"
                      onClick={() => setShowCheckoutForm(true)}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}