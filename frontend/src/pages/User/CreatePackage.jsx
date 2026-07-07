import React, { useState, useEffect, useMemo } from "react";
import { MdStorefront, MdDeliveryDining } from "react-icons/md";

import vegIcon from "../../../public/spinach.svg";
import VEGICOn from "../../../public/veg icon.svg";

import PhoneInputPkg from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const PhoneInput = PhoneInputPkg.default ? PhoneInputPkg.default : PhoneInputPkg;

import CheckoutFlowModal from "../../components/shared/CheckoutFlowModal";
import { toast } from "react-hot-toast";

import { createSubscription } from "../../services/subscription.service";
// Nayi service layer import kiya jahan se dynamic plans aayenge
import { getActivePlans } from "../../services/customPlanConfig.service.js";
import { getActiveMealTiers } from "../../services/mealTier.service.js";

export default function CreatePackage({ isOpen, onClose }) {
  // Config States
  const [preference, setPreference] = useState("Veg");

  // Dynamic States from Backend
  const [dbPlans, setDbPlans] = useState([]);
  const [duration, setDuration] = useState(""); // Dynamic initial value handles via useEffect
  const [totalMeals, setTotalMeals] = useState(0);

  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [quantity, setQuantity] = useState(1);
  const [mealSize, setMealSize] = useState("Basic");

  // Start Date & Calendar States
  const [startDate, setStartDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const [selectedPlan, setSelectedPlan] = useState("Basic");
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // Meal Tiers (Basic / Medium / Premium etc.) — admin ke MealTierManager se aate hain
  const [mealTiers, setMealTiers] = useState([]);

  // 1. Fetch Dynamic Duration Plans from Backend
  useEffect(() => {
    const fetchDurationPlans = async () => {
      try {
        const res = await getActivePlans();
        const activePlansData = res.data || res || [];
        setDbPlans(activePlansData);

        if (activePlansData.length > 0) {
          // Default selection pehla plan sets karega safely
          const defaultPlan = activePlansData[0];
          setDuration(defaultPlan.durationLabel);
          setTotalMeals(defaultPlan.totalMeals);
        }
      } catch (error) {
        console.error("Error fetching duration plans:", error);
        toast.error("Failed to load live plan durations");
      }
    };
    fetchDurationPlans();
  }, []);

  // 2. Fetch Active Meal Tiers (Basic / Medium / Premium etc., set by admin)
  useEffect(() => {
    const fetchMealTiers = async () => {
      try {
        const res = await getActiveMealTiers();
        const activeTiers = res.data || [];
        setMealTiers(activeTiers);

        if (activeTiers.length > 0) {
          setSelectedPlan(activeTiers[0].name);
        }
      } catch (error) {
        console.error("Error fetching meal tiers:", error);
        toast.error("Failed to load meal plan tiers");
      }
    };
    fetchMealTiers();
  }, []);

  // 3. Unique Duration Labels Extract karne ke liye (Tabs banane ke liye)
  const uniqueDurationLabels = useMemo(() => {
    const labels = dbPlans.map(p => p.durationLabel);
    return [...new Set(labels)];
  }, [dbPlans]);

  // 4. Selected Duration Label ke corresponding sub-options dynamic get karein
  const currentOptions = useMemo(() => {
    return dbPlans
      .filter(p => p.durationLabel === duration)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [dbPlans, duration]);

  // Handle matching choice when user switches tabs smoothly
  useEffect(() => {
    if (currentOptions.length > 0) {
      const matchStillExists = currentOptions.some(o => o.totalMeals === totalMeals);
      if (!matchStillExists) {
        setTotalMeals(currentOptions[0].totalMeals);
      }
    }
  }, [duration, currentOptions, totalMeals]);

  // Known tier names keep their original pricing multiplier; any custom tier the
  // admin adds beyond Basic/Medium/Premium scales up by position instead of guessing.
  const getPlanMultiplier = (name, index) => {
    const key = name?.trim().toLowerCase();
    if (key === "basic") return 1;
    if (key === "medium") return 1.2;
    if (key === "premium") return 1.4;
    return 1 + index * 0.2;
  };

  // 5. Dynamic Calculations Engine based on DB values
  const planMultiplier = getPlanMultiplier(
    selectedPlan,
    mealTiers.findIndex((t) => t.name === selectedPlan)
  );

  const matchedOption = useMemo(() => {
    return currentOptions.find((o) => o.totalMeals === totalMeals) || currentOptions[0];
  }, [currentOptions, totalMeals]);

  const basePricePerMeal = matchedOption ? matchedOption.pricePerMeal : 0;

  const pricePerMeal = parseFloat((basePricePerMeal * planMultiplier).toFixed(2));
  const subtotal = totalMeals * pricePerMeal * quantity;
  const discount = subtotal * 0.2; 
  const deliveryCharges = deliveryMethod === "Delivery" ? 15.0 : 0.0;
  const totalAmount = subtotal - discount + deliveryCharges;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const getCustomizationError = () => {
    if (!startDate) return "Please select a Delivery Start Date from the calendar above.";
    if (dbPlans.length === 0) return "Loading active plan details from server...";
    return "";
  };
  const validationError = getCustomizationError();

  return (
    <CheckoutFlowModal
      isOpen={isOpen !== undefined ? isOpen : true}
      onClose={onClose || (() => window.history.back())}
      mode="create"
      isCustomizationValid={!validationError}
      customizationErrorMsg={validationError}
      subscriptionData={{
        mealSize: selectedPlan,
        preference,
        duration,
        quantity,
        deliveryMethod,
        startDate,
      }}
    >
      {({ goBack, loading, error: submitError }) => (
      <div className={`bg-[#f9f9fb] text-gray-800 font-sans antialiased py-3 px-2 sm:px-4 lg:px-5 relative`}>
            <main className="max-w-full bg-white/50 rounded-3xl">
              {/* ================= HEADER AREA ================= */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1.5 pb-1.5 border-b border-gray-200/60 px-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
                    Create Your Plan
                  </h1>
                  <p className="text-gray-500 text-xs max-w-2xl leading-relaxed">
                    Customize your culinary journey with premium ingredients delivered to your doorstep.
                  </p>
                </div>

                {/* Pickup / Delivery selector — desktop, sits in the header */}
                <div className="hidden lg:block bg-white p-1 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] shrink-0">
                  <div className="bg-[#f3f1f1] p-1 rounded-full flex border border-gray-200/40">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("Pickup")}
                      className={`py-1.5 px-6 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                        deliveryMethod === "Pickup" ? "bg-red-600 text-white shadow-sm font-extrabold" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <MdStorefront className="w-4 h-4" />
                      <span>Pickup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("Delivery")}
                      className={`py-1.5 px-6 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                        deliveryMethod === "Delivery" ? "bg-red-600 text-white shadow-sm font-extrabold" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <MdDeliveryDining className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickup / Delivery selector */}
              <div className="lg:hidden px-2 mb-3">
                <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="bg-[#f3f1f1] p-1 rounded-full flex border border-gray-200/40">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("Pickup")}
                      className={`w-1/2 py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                        deliveryMethod === "Pickup"
                          ? "bg-red-600 text-white shadow-sm font-extrabold"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <MdStorefront className="w-4 h-4" />
                      <span>Pickup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("Delivery")}
                      className={`w-1/2 py-1.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                        deliveryMethod === "Delivery"
                          ? "bg-red-600 text-white shadow-sm font-extrabold"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <MdDeliveryDining className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 content-start">
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {/* Row 1: Preference & Timing */}
                  <div className="bg-white p-2.5 px-3 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="#16A34A" strokeWidth="2" />
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
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="#DC2626" strokeWidth="2" />
                                <path d="M12 7L16.5 15H7.5L12 7Z" fill="#DC2626" />
                              </svg>
                              <span>Non Veg</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                          <span>📅</span> Start Date
                        </label>
                        <div
                          onClick={() => setShowCalendar(!showCalendar)}
                          className="w-full bg-white border border-gray-300 rounded-xl p-2.5 flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer hover:border-[#dc2626] transition-all"
                        >
                          <span className={startDate ? "text-gray-900 font-bold" : "text-gray-400"}>
                            {startDate ? startDate : "Select Delivery Start Date"}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#dc2626]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                        </div>

                        {showCalendar && (
                          <div className="absolute left-0 top-full mt-2 z-50 w-[300px] max-w-[90vw] bg-white border border-red-100 shadow-2xl rounded-2xl p-4 border-t-4 border-t-[#dc2626]">
                            <div className="flex items-center justify-between mb-3">
                              <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                className="p-1 hover:bg-red-50 rounded-lg text-[#dc2626]"
                              >
                                &larr;
                              </button>
                              <span className="text-xs font-black text-gray-800 uppercase tracking-wide">
                                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="p-1 hover:bg-red-50 rounded-lg text-[#dc2626]"
                              >
                                &rarr;
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                              {daysOfWeek.map(day => (
                                <span key={day} className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center">
                              {getDaysInMonth(currentMonth).map((date, idx) => {
                                if (!date) return <div key={`empty-${idx}`} />;

                                const dayStr = String(date.getDate()).padStart(2, '0');
                                const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
                                const yearStr = date.getFullYear();
                                const formattedDate = `${dayStr} ${monthStr} ${yearStr}`;

                                const isSelected = startDate === formattedDate;
                                const isPast = date < new Date().setHours(0,0,0,0);

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => {
                                      setStartDate(formattedDate);
                                      setShowCalendar(false);
                                    }}
                                    className={`text-[11px] p-1.5 rounded-lg font-bold transition-all focus:outline-none
                                      ${isPast ? "text-gray-200 cursor-not-allowed" : "text-gray-700 hover:bg-red-50 hover:text-[#dc2626]"}
                                      ${isSelected ? "bg-[#dc2626] !text-white shadow-md shadow-red-600/20" : ""}
                                    `}
                                  >
                                    {date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Dynamic Duration & Total Meals */}
                  <div className="bg-white p-2.5 px-3 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                        <span>📅</span> Duration
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* Dynamic labels generated from active db values */}
                        {uniqueDurationLabels.map((lbl) => (
                          <button
                            type="button"
                            key={lbl}
                            onClick={() => setDuration(lbl)}
                            className={`py-2 rounded-xl text-xs font-bold border text-center transition-all focus:outline-none ${duration === lbl ? "border-2 border-[#dc2626] text-[#dc2626] bg-red-50/20 font-black" : "border-gray-200 text-gray-400 bg-white hover:border-[#dc2626] hover:text-slate-800"}`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                        <span>🍱</span> Total Meals
                      </label>
                      <div className="bg-[#f3f1f1] p-1 rounded-3xl border border-gray-200/40 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        {/* Dynamic custom meal options mapping */}
                        {currentOptions.map((option) => {
                          const isSelected = totalMeals === option.totalMeals;
                          return (
                            <button
                              type="button"
                              key={option._id}
                              onClick={() => setTotalMeals(option.totalMeals)}
                              className={`py-2 px-2 rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center focus:outline-none relative ${
                                isSelected ? "bg-white text-gray-900 shadow-md font-black" : "text-gray-500 hover:text-gray-800"
                              }`}
                            >
                              <div className={`text-xl font-black ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                                {option.totalMeals}
                              </div>
                              <div className="text-[11px] font-bold mt-0.5 opacity-90">
                                ${(option.pricePerMeal * planMultiplier).toFixed(2)} 
                              </div>
                              <div className="text-[9px] mt-0.5 font-bold uppercase tracking-wide opacity-60">
                                {option.frequencyLabel} meal per week 
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Meal Plan Selector — flex-1 so it stretches to match the right
                      column's height instead of leaving blank space beneath it */}
                  <div className="flex-1 bg-white p-2.5 px-3 rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <label className="text-xs font-bold text-[#dc2626] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                      <span>🍱</span> Select Your Meal Plan:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {mealTiers.length === 0 && (
                        <p className="text-xs text-gray-400 col-span-3 text-center py-4">
                          Loading meal plans...
                        </p>
                      )}
                      {mealTiers.map((tier) => {
                        const planName = tier.name;
                        const isSelected = selectedPlan === planName;
                        const shortDescription = tier.features?.[0] || "";
                        return (
                          <div key={tier._id} className="relative group">
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
                                ${isSelected ? "bg-[#dc2626] text-white border-[#dc2626] shadow-lg shadow-red-600/10 font-black" : "bg-white text-gray-800 border-gray-200 hover:border-[#dc2626]/60"}`}
                            >
                              <span className="text-sm font-black tracking-tight">
                                {planName}
                              </span>
                              <span className={`text-[10px] font-medium mt-0.5 leading-tight max-w-[170px] line-clamp-2 ${isSelected ? "text-white/90" : "text-gray-400"}`}>
                                {shortDescription}
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
                                  <span>ℹ️</span> {planName} Includes:
                                </div>
                                <div className="space-y-3.5">
                                  <div className="text-[11px]">
                                    <ul className="list-none space-y-1.5 font-semibold text-slate-600">
                                      {(tier.features || []).map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5">
                                          <span className="text-[#dc2626] mt-0.5">•</span>
                                          <span>{feature}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {tier.items?.length > 0 && (
                                    <div className="text-[11px] pt-2 border-t border-slate-100">
                                      <span className="font-extrabold text-slate-800 block mb-1 uppercase tracking-wider text-[10px]">
                                        🍽️ Items — choose {tier.selectionCount || 1} of {tier.items.length}
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {tier.items.map((item) => (
                                          <span
                                            key={item._id}
                                            className="text-[10px] font-semibold text-slate-600 bg-slate-100 rounded-md px-1.5 py-0.5"
                                          >
                                            {item.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
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
                <div className="flex flex-col gap-3 relative z-10">
                  {/* Plan Summary Card */}
                  <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <div className="bg-red-50 p-2 rounded-lg text-[#dc2626]">
                        <svg width="4" height="4" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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
                        <span className="text-slate-700">Start date</span>
                        <span className="text-slate-900">{startDate || "—"}</span>
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
                          {duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Fulfillment</span>
                        <span className="text-[#dc2626] font-extrabold">
                          {deliveryMethod}
                        </span>
                      </div>
                    </div>

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
                        <span className={deliveryCharges === 0 ? "text-green-600 font-black" : "text-slate-700"}>
                          {deliveryCharges === 0 ? "FREE" : `$${deliveryCharges.toFixed(2)}`}
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
                      <svg width="3.5" height="3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Price per Tiffin: ${pricePerMeal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Proceed / Go Back — directly below Plan Summary in the same sticky stack */}
                  <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    {submitError && (
                      <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                        {submitError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 text-white font-black text-[11px] tracking-widest uppercase py-3.5 rounded-2xl transition-all shadow-lg shadow-red-100"
                    >
                      {loading ? "Please wait..." : "Proceed"}
                    </button>
                    <button
                      type="button"
                      onClick={goBack}
                      className="w-full text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors pt-2.5"
                    >
                      ← Go Back
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
      )}
    </CheckoutFlowModal>
  );
}