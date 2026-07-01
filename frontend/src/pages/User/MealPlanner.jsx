import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { 
  FaCheck,
  FaTrashCan,
  FaCalendarDays,
  FaRegCalendar,
  FaRegClock,
  FaShieldHalved
} from "react-icons/fa6";

import Header from "../../components/HeroHeader";
import Footer from "../../components/Footer";

// Configuration Data
const daysOfWeek = [
  { id: "mon", name: "Monday", label: "MON", date: "1" },
  { id: "tue", name: "Tuesday", label: "TUE", date: "2" },
  { id: "wed", name: "Wednesday", label: "WED", date: "3" },
  { id: "thu", name: "Thursday", label: "THU", date: "4" },
  { id: "fri", name: "Friday", label: "FRI", date: "5" },
  { id: "sat", name: "Saturday", label: "SAT", date: "6" },
  { id: "sun", name: "Sunday", label: "SUN", date: "7" },
];

const categoriesData = [
  { id: "high-protein", name: "High Protein", icon: "❤️" },
  { id: "low-carb", name: "Low Carb", icon: "🌱" },
  { id: "keto", name: "Keto Diet", icon: "🥑" },
  { id: "vegan", name: "Vegan", icon: "🌿" }
];

const foodItems = [
  { id: "dal", name: "Makhani Dal", price: 40, category: "High Protein", cal: "320 Cal", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=250&auto=format&fit=crop&q=80" },
  { id: "paneer", name: "Paneer Tikka Masala", price: 50, category: "High Protein", cal: "380 Cal", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=250&auto=format&fit=crop&q=80" },
  { id: "chicken", name: "Grilled Herb Chicken", price: 90, category: "High Protein", cal: "450 Cal", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=250&auto=format&fit=crop&q=80" },
  { id: "mixveg", name: "Sautéed Mix Veggies", price: 40, category: "Low Carb", cal: "180 Cal", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=250&auto=format&fit=crop&q=80" },
  { id: "keto-bowl", name: "Keto Paneer Bowl", price: 70, category: "Keto Diet", cal: "290 Cal", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=250&auto=format&fit=crop&q=80" },
  { id: "roti", name: "Multigrain Roti Box", price: 15, category: "Vegan", cal: "120 Cal", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=250&auto=format&fit=crop&q=80" },
];

// ================= COMPONENT: MEAL PLAN SUMMARY (IMAGE 1) =================
const MealPlanSummary = () => {
  return (
    <div className="w-full bg-white rounded-[24px] border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
      {/* Top Header Row */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-xl font-bold">
            🍲
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1B254B]">Meal Plan Summary</h2>
            <p className="text-sm font-medium text-gray-400">Quick overview of your current plan</p>
          </div>
        </div>
        <div className="bg-red-50 text-red-500 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5">
          <FaShieldHalved size={12} /> Active Plan
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
        {/* Left 60 Total Meals Box */}
        <div className="md:col-span-3 bg-[#FFF5F5] rounded-[20px] p-6 text-center flex flex-col justify-center items-center h-40">
          <span className="text-6xl font-black text-[#D32F2F]">60</span>
          <span className="text-sm font-bold text-gray-500 mt-2">Total Meals</span>
        </div>

        {/* Center Progress Bar Area */}
        <div className="md:col-span-5 px-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-base font-bold text-[#1B254B]">Plan Usage</span>
            <span className="text-xs font-bold text-[#D32F2F]">40% Used</span>
          </div>
          {/* Progress Track */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#D32F2F] rounded-full" style={{ width: '40%' }}></div>
          </div>
          {/* Metrics Row */}
          <div className="flex justify-center items-center gap-8 mt-6">
            <div className="text-center">
              <span className="block text-2xl font-black text-[#D32F2F]">24</span>
              <span className="text-xs font-semibold text-gray-400">Consumed</span>
            </div>
            <div className="w-[1px] h-8 bg-gray-200"></div>
            <div className="text-center">
              <span className="block text-2xl font-black text-[#1B254B]">36</span>
              <span className="text-xs font-semibold text-gray-400">Remaining</span>
            </div>
          </div>
        </div>

        {/* Right Expiry Column */}
        <div className="md:col-span-4 border-l border-gray-100 pl-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#D32F2F]">
              <FaRegCalendar size={18} />
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-400">Valid Till</span>
              <span className="text-base font-extrabold text-[#1B254B]">25 Jun 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#D32F2F]">
              <FaRegClock size={18} />
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-400">Expires in</span>
              <span className="text-base font-extrabold text-[#1B254B]">91 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Alert Shield */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm font-semibold text-gray-600">
        <FaShieldHalved className="text-[#D32F2F]" size={16} />
        <span>Your plan is active and ready to use.</span>
      </div>
    </div>
  );
};

// ================= COMPONENT: WORKSPACE INTERFACE (IMAGE 2) =================
const MealSchedule = () => {
  const [selectedCategory, setSelectedCategory] = useState("High Protein"); 
  const [selectedDay, setSelectedDay] = useState("Tuesday"); 
  
  const [weeklyPlan, setWeeklyPlan] = useState({
    Monday: [foodItems.find(i => i.id === "roti")],
    Tuesday: [foodItems.find(i => i.id === "mixveg")],
    Wednesday: [foodItems.find(i => i.id === "keto-bowl")],
    Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const toggleItemForDay = (item) => {
    setWeeklyPlan((prev) => {
      const currentDayItems = prev[selectedDay] || [];
      const exists = currentDayItems.some((i) => i.id === item.id);
      
      // 6 स्लॉट्स से ज्यादा ऐड होने पर रोक
      if (!exists && currentDayItems.length >= 6) {
        alert("You can only add up to 6 meals per day in this plan.");
        return prev;
      }

      return {
        ...prev,
        [selectedDay]: exists
          ? currentDayItems.filter((i) => i.id !== item.id)
          : [...currentDayItems, item]
      };
    });
  };

  const removeItemFromDay = (day, itemId) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: prev[day].filter((item) => item.id !== itemId)
    }));
  };

  const totalWeeklyPrice = useMemo(() => {
    return Object.values(weeklyPlan)
      .flatMap(items => items)
      .filter(Boolean)
      .reduce((sum, item) => sum + item.price, 0);
  }, [weeklyPlan]);

  const totalSlots = 6;
  const currentDayMeals = weeklyPlan[selectedDay] || [];

  return (
    <div className="w-full space-y-8">
      
      {/* Title block */}
      <div className="text-center py-4">
        <h2 className="text-3xl font-black text-[#1B254B]">
          Build Your Custom Meal Plan in <span className="text-[#D32F2F]">2 Easy Steps</span>
        </h2>
        <p className="text-sm font-medium text-gray-400 mt-1">Healthy meals, your way!</p>
      </div>

      {/* 2 COLUMN MODULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT SECTION: STEP 1 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-white border-2 border-[#D32F2F] text-[#D32F2F] rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</span>
            <div>
              <h3 className="text-xs font-black text-[#1B254B] tracking-wider uppercase">CHOOSE YOUR MEALS</h3>
              <p className="text-xs font-medium text-gray-400">Select your favorite meals and diet preference</p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 py-2">
            {categoriesData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 border ${
                  selectedCategory === cat.name
                    ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredFoodItems.map((item) => {
              const isChecked = weeklyPlan[selectedDay]?.some(i => i.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemForDay(item)}
                  className="bg-white rounded-2xl border border-gray-100 p-3 relative flex flex-col justify-between cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-gray-200 transition-all"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-[#D32F2F] border-[#D32F2F]' : 'border-gray-300 bg-white'}`}>
                      {isChecked && <FaCheck className="text-white" size={10} />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <img src={item.image} alt={item.name} className="w-full h-28 object-cover rounded-xl" />
                    <div>
                      <h4 className="text-xs font-black text-[#1B254B] mt-1 leading-tight">{item.name}</h4>
                      <p className="text-xs font-black text-[#D32F2F] mt-1">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <span className="bg-red-50 text-[#D32F2F] px-1.5 py-0.5 rounded">{item.category}</span>
                    <span>{item.cal}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 italic">ℹ️ You can add or remove items anytime before confirming your plan.</p>
        </div>

        {/* RIGHT SECTION: STEP 2 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-white border-2 border-[#D32F2F] text-[#D32F2F] rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</span>
            <div>
              <h3 className="text-xs font-black text-[#1B254B] tracking-wider uppercase">PICK DELIVERY DAY</h3>
              <p className="text-xs font-medium text-gray-400">Choose your target day to get started</p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-6 space-y-4 shadow-[0_6px_25px_rgba(0,0,0,0.01)]">
            <span className="text-xs font-black text-[#1B254B] uppercase block tracking-wider">Select Delivery Day</span>
            
            {/* Days Calendar row */}
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day.name;
                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.name)}
                    className="flex flex-col items-center py-2 text-center focus:outline-none"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">{day.label}</span>
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-black transition-all ${
                      isSelected ? 'bg-[#D32F2F] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      {day.date}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mapped items in 3-Column Grid */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#1B254B] border-b border-gray-100 pb-2 mb-3">
                <span className="uppercase text-gray-400">Your Plan ({selectedDay})</span>
                <span className="text-gray-500">{currentDayMeals.length} / {totalSlots} Items</span>
              </div>

              {/* 3-column grid (grid-cols-3) और ऊँचाई (h-[80px]) को बड़ा किया गया है */}
              <div className="grid grid-cols-3 gap-2 min-h-[170px]">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const item = currentDayMeals[index];

                  if (item) {
                    // सिलेक्टेड मील ब्लॉक (Vertical structure for better fitting in 3 columns)
                    return (
                      <div key={item.id} className="flex flex-col justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] relative group min-h-[80px]">
                        <button 
                          onClick={() => removeItemFromDay(selectedDay, item.id)}
                          className="absolute top-1.5 right-1.5 text-gray-300 hover:text-red-500 p-0.5 z-10 bg-white rounded-full shadow-sm"
                        >
                          <FaTrashCan size={10} />
                        </button>
                        
                        <div className="space-y-1.5 text-center mt-1 flex flex-col items-center">
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="w-full px-1">
                            <p className="text-[10px] font-bold text-[#1B254B] truncate leading-tight">{item.name}</p>
                            <p className="text-[9px] font-black text-[#D32F2F] mt-0.5">₹{item.price}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // खाली क्रॉस स्लॉट (बड़ा किया हुआ)
                    return (
                      <div key={`empty-${index}`} className="flex flex-col items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-2 h-[80px] text-center">
                        <span className="text-gray-300 text-[14px] font-light mb-0.5">✕</span>
                        <span className="text-gray-400 text-[9px] font-bold tracking-tight uppercase">Empty Slot</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            {/* Action Checkout Trigger Row */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Weekly Total</span>
                <span className="text-2xl font-black text-[#1B254B]">₹{totalWeeklyPrice}</span>
              </div>
              <button
                onClick={() => alert("Order Confirmed!")}
                className="bg-[#D32F2F] hover:bg-red-700 text-white font-black text-xs px-6 py-3 rounded-xl tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                PREVIEW & CONFIRM &gt;
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: YOUR WEEKLY PLAN MATRIX */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <span className="text-lg">📅</span>
          <div>
            <h4 className="text-xs font-black text-[#1B254B] tracking-wider uppercase">YOUR WEEKLY PLAN</h4>
            <p className="text-xs font-medium text-gray-400">Review your meals for the week</p>
          </div>
        </div>

        {/* 7 Columns Matrix Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysOfWeek.map((day) => {
            const items = weeklyPlan[day.name] || [];
            const hasItems = items.length > 0;
            const subtotal = items.reduce((s, i) => s + (i?.price || 0), 0);

            return (
              <div key={day.id} className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between min-h-[140px]">
                <div>
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-50">
                    <span className="text-xs font-black text-[#1B254B]">{day.name}</span>
                    {hasItems && (
                      <span className="text-[9px] font-bold bg-green-50 text-green-600 px-1.5 py-0.2 rounded-full">
                        {items.length} {items.length === 1 ? 'Meal' : 'Meals'}
                      </span>
                    )}
                  </div>

                  {hasItems ? (
                    <div className="space-y-1">
                      {items.map((item) => (
                        <div key={item?.id} className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                          <span className="truncate max-w-[75%]">{item?.name}</span>
                          <span className="text-gray-400 shrink-0">₹{item?.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-300">
                      <p className="text-[10px] italic">No meals planned</p>
                    </div>
                  )}
                </div>

                {hasItems && (
                  <div className="pt-2 mt-2 border-t border-dashed border-gray-100 flex justify-between items-center text-[10px] font-black text-[#1B254B]">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-green-600">₹{subtotal}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand value features row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 text-center text-xs font-bold text-gray-500">
        <div>🌱 100% Fresh & Healthy</div>
        <div>👨‍🍳 Expert Nutritionists</div>
        <div>🚚 On-Time Delivery</div>
        <div>🛡️ No Commitment</div>
      </div>
    </div>
  );
};
// ================= MAIN PARENT COMPONENT: MEAL PLANNER =================
const MealPlanner = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFF] font-sans antialiased">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 max-w-7xl mx-auto w-full space-y-8">
        {/* Step 1 UI Summary Card Dashboard */}
        <MealPlanSummary />
        
        {/* Step 2 Selection Module */}
        <MealSchedule />
      </main>
      <Footer />
    </div>
  );
};

export default MealPlanner;