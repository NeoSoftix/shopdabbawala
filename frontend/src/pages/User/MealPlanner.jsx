import React, { useMemo, useState } from "react";
import { 
  FaCheck,
  FaTrashCan,
  FaRegCalendar,
  FaShieldHalved,
  FaRegClock,
  FaBowlFood,
  FaCalendarDays,
  FaCircleInfo
} from "react-icons/fa6";

import Header from "../../components/HeroHeader";
import Footer from "../../components/Footer";
import UserHistorydetails from "../../components/User/UserHistoryDetails";

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
  { id: "dal", name: "Makhani Dal", category: "High Protein", cal: "320 Cal", desc: "Rich & creamy slow-cooked black lentils.", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150&auto=format&fit=crop&q=80" },
  { id: "paneer", name: "Paneer Tikka Masala", category: "High Protein", cal: "380 Cal", desc: "Spiced cottage cheese cubes in rich gravy.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=150&auto=format&fit=crop&q=80" },
  { id: "chicken", name: "Grilled Herb Chicken", category: "High Protein", cal: "450 Cal", desc: "Lean chicken breast grilled with fresh herbs.", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=150&auto=format&fit=crop&q=80" },
  { id: "mixveg", name: "Sautéed Mix Veggies", category: "Low Carb", cal: "180 Cal", desc: "Crunchy seasonal vegetables lightly tossed.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop&q=80" },
  { id: "keto-bowl", name: "Keto Paneer Bowl", category: "Keto Diet", cal: "290 Cal", desc: "High fat, low carb paneer and greens layout.", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=150&auto=format&fit=crop&q=80" },
  { id: "roti", name: "Multigrain Roti Box", category: "Vegan", cal: "120 Cal", desc: "Fiber-rich flatbreads served warm.", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=150&auto=format&fit=crop&q=80" },
];

// ================= COMPONENT: MEAL PLAN SUMMARY =================
const MealPlanSummary = () => {
  return (
    <div className="w-full bg-white rounded-[32px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.015)] border border-gray-50 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FFF5F5] rounded-2xl flex items-center justify-center text-3xl shadow-sm">
            🍲
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B254B] tracking-tight">Meal Plan Summary</h2>
            <p className="text-sm font-medium text-[#A3AED0] mt-0.5">Quick overview of your current plan</p>
          </div>
        </div>
        
        <div className="bg-[#E6F9EE] text-[#05CD99] font-bold text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <FaShieldHalved size={14} /> Active Plan
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
        <div className="md:col-span-3 bg-gradient-to-b from-[#FF5E5E] to-[#E31A1A] rounded-[24px] p-6 text-center flex flex-col justify-center items-center h-44 shadow-lg shadow-red-100/40 relative overflow-hidden">
          <span className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white mb-2 text-lg">🍽️</span>
          <span className="text-5xl font-black text-white tracking-tight">60</span>
          <span className="text-sm font-bold text-white/80 mt-1 uppercase tracking-wider">Total Meals</span>
        </div>

        <div className="md:col-span-5 px-2 flex flex-col justify-center h-44">
          <div className="flex justify-between items-center mb-3">
            <span className="text-base font-bold text-[#1B254B]">Plan Usage</span>
            <span className="text-xs font-bold text-[#E31A1A] bg-[#FFF5F5] px-2.5 py-1 rounded-md">40% Used</span>
          </div>
          <div className="w-full h-3 bg-[#F4F7FE] rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-[#FF5E5E] to-[#E31A1A] rounded-full" style={{ width: "40%" }} />
          </div>
          <div className="grid grid-cols-2 text-center relative">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-[#FFF5F5] text-[#E31A1A] rounded-xl flex items-center justify-center text-base">🚫</div>
              <div className="text-left">
                <span className="block text-2xl font-black text-[#E31A1A] leading-none">24</span>
                <span className="text-xs font-semibold text-[#A3AED0] mt-1 block">Consumed</span>
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-gray-100"></div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-[#F4F7FE] text-[#1B254B] rounded-xl flex items-center justify-center text-base">🧺</div>
              <div className="text-left">
                <span className="block text-2xl font-black text-[#1B254B] leading-none">36</span>
                <span className="text-xs font-semibold text-[#A3AED0] mt-1 block">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 space-y-5 flex flex-col justify-center h-44">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFF5F5] rounded-xl flex items-center justify-center text-[#E31A1A] shrink-0 shadow-sm">
              <FaRegCalendar size={20} />
            </div>
            <div>
              <span className="block text-xs font-medium text-[#A3AED0] leading-none mb-1.5">Valid Till</span>
              <span className="text-base font-extrabold text-[#1B254B]">25 Jun 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFF5F5] rounded-xl flex items-center justify-center text-[#E31A1A] shrink-0 shadow-sm">
              <FaRegClock size={20} />
            </div>
            <div>
              <span className="block text-xs font-medium text-[#A3AED0] leading-none mb-1.5">Expires in</span>
              <span className="text-base font-extrabold text-[#1B254B]">91 Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-[#E6F9EE]/60 rounded-2xl px-5 py-4 border border-[#05CD99]/10 flex items-center gap-3 text-sm font-bold text-[#05CD99]">
        <div className="w-6 h-6 bg-[#05CD99] text-white rounded-full flex items-center justify-center text-xs shrink-0">✔</div>
        <span>Your plan is active and ready to use. Enjoy your meals and stay consistent!</span>
      </div>
    </div>
  );
};

// ================= COMPONENT: WORKSPACE INTERFACE =================
const MealSchedule = ({ selectedDay, setSelectedDay, weeklyPlan, setWeeklyPlan }) => {
  const [selectedCategory, setSelectedCategory] = useState("High Protein"); 

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item => item && item.category === selectedCategory);
  }, [selectedCategory]);

  const toggleItemForDay = (item) => {
    if (!item) return;
    setWeeklyPlan((prev) => {
      const currentDayItems = prev[selectedDay] || [];
      const exists = currentDayItems.some((i) => i && i.id === item.id);
      
      if (!exists && currentDayItems.length >= 6) {
        alert("You can only add up to 6 meals per day in this plan.");
        return prev;
      }

      return {
        ...prev,
        [selectedDay]: exists
          ? currentDayItems.filter((i) => i && i.id !== item.id)
          : [...currentDayItems, item]
      };
    });
  };

  const removeItemFromDay = (day, itemId) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((item) => item && item.id !== itemId)
    }));
  };

  const totalSlots = 6;
  const currentDayMeals = weeklyPlan[selectedDay] || [];

  return (
    <div className="w-full space-y-8 bg-white rounded-[32px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.015)] border border-gray-50">
      <div className="text-center py-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1B254B]">
          Build Your Custom Meal Plan in <span className="text-[#E31A1A]">2 Easy Steps</span>
        </h2>
        <p className="text-sm font-medium text-[#A3AED0] mt-1">Healthy meals, your way!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SECTION */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-white border-2 border-[#E31A1A] text-[#E31A1A] rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</span>
            <div>
              <h3 className="text-sm font-bold text-[#1B254B] tracking-wider uppercase">CHOOSE YOUR MEALS</h3>
              <p className="text-xs font-medium text-[#A3AED0] mt-0.5">Select your favorite meals and diet preference</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 py-1">
            {categoriesData.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all border ${
                  selectedCategory === cat.name
                    ? "bg-[#E31A1A] text-white border-[#E31A1A] shadow-sm"
                    : "bg-white text-[#A3AED0] border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFoodItems.map((item) => {
              const isChecked = currentDayMeals.some(i => i && i.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemForDay(item)}
                  className="bg-white rounded-xl border border-gray-100 p-3 relative flex flex-col justify-between cursor-pointer group shadow-[0_2px_15px_rgba(0,0,0,0.01)] hover:border-gray-200 transition-all"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-[#E31A1A] border-[#E31A1A]' : 'border-gray-300 bg-white'}`}>
                      {isChecked && <FaCheck className="text-white" size={9} />}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-sm font-bold text-[#1B254B] leading-tight">{item.name}</h4>
                      <p className="text-xs text-[#A3AED0] font-medium mt-1 line-clamp-2 leading-normal">{item.desc}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-end text-xs font-bold text-gray-500">
                    <span>🔥 {item.cal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-white border-2 border-[#E31A1A] text-[#E31A1A] rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</span>
            <div>
              <h3 className="text-sm font-bold text-[#1B254B] tracking-wider uppercase">PICK DELIVERY DAY</h3>
              <p className="text-xs font-medium text-[#A3AED0] mt-0.5">Choose your target day to get started</p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-5 space-y-5 shadow-sm">
            <span className="text-xs font-bold text-[#1B254B] uppercase block tracking-wider">Select Delivery Day</span>
            
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day.name;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDay(day.name)}
                    className="flex flex-col items-center py-1.5 text-center focus:outline-none group"
                  >
                    <span className="text-[10px] sm:text-xs font-bold text-[#A3AED0] uppercase mb-1">{day.label}</span>
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                      isSelected ? 'bg-[#E31A1A] text-white shadow-sm' : 'text-[#1B254B] hover:bg-gray-100'
                    }`}>
                      {day.date}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-[#1B254B] border-b border-gray-100 pb-2 mb-3">
                <span className="uppercase text-[#A3AED0]">Your Plan ({selectedDay})</span>
                <span className="text-gray-500">{currentDayMeals.length} / {totalSlots} Items</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-[160px]">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const item = currentDayMeals[index];

                  if (item) {
                    return (
                      <div 
                        key={item.id} 
                        className="flex flex-col justify-between bg-white p-2 rounded-xl border border-gray-100 relative group min-h-[90px] sm:min-h-[110px]"
                      >
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItemFromDay(selectedDay, item.id);
                          }}
                          className="absolute top-1 right-1 text-gray-300 hover:text-red-500 p-1 z-10 bg-white rounded-full shadow-sm"
                        >
                          <FaTrashCan size={11} />
                        </button>
                        
                        <div className="space-y-1.5 text-center mt-2 flex flex-col items-center">
                          <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                          <div className="w-full px-0.5">
                            <p className="text-xs font-bold text-[#1B254B] truncate leading-tight">{item.name}</p>
                            <p className="text-[11px] text-[#A3AED0] font-medium mt-0.5">{item.cal}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`empty-${index}`} className="flex flex-col items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-2 h-[90px] sm:h-[110px] text-center">
                        <span className="text-gray-300 text-sm font-light">✕</span>
                        <span className="text-[#A3AED0] text-[10px] sm:text-xs font-bold tracking-tight uppercase mt-0.5">Empty</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => alert("Order Confirmed!")}
                className="w-full sm:w-auto bg-[#E31A1A] hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl tracking-wider shadow-sm transition-all"
              >
                PREVIEW & CONFIRM &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX WEEKLY VIEW */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <span className="text-lg">📅</span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1B254B] tracking-wider uppercase">YOUR WEEKLY PLAN</h4>
            <p className="text-xs font-medium text-[#A3AED0]">Review your meals for the week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {daysOfWeek.map((day) => {
            const items = weeklyPlan[day.name] || [];
            const hasItems = items.length > 0;

            return (
              <div key={day.id} className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col justify-between min-h-[120px]">
                <div>
                  <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-gray-50">
                    <span className="text-xs sm:text-sm font-bold text-[#1B254B]">{day.name}</span>
                    {hasItems && (
                      <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                        {items.length} M
                      </span>
                    )}
                  </div>

                  {hasItems ? (
                    <div className="space-y-1">
                      {items.map((item, idx) => (
                        <div key={item ? item.id : idx} className="flex justify-between items-center text-xs font-bold text-[#A3AED0]">
                          <span className="truncate w-full text-left">{item ? item.name : ""}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-300">
                      <p className="text-xs italic">No meals</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ================= MAIN PARENT COMPONENT WITH WIZARD AS SIDEBAR =================
const MealPlanner = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState("Tuesday"); 
  const [weeklyPlan, setWeeklyPlan] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  const sidebarItems = [
    { id: 1, label: "Plan Summary", desc: "Overview of your current plan", icon: <FaCircleInfo size={16} /> },
    { id: 2, label: "Build Custom Meal", desc: "Create your perfect plan", icon: <FaBowlFood size={16} /> },
    { id: 3, label: "My Orders", desc: "Track your orders & history", icon: <FaCalendarDays size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans antialiased flex flex-col">
      <Header />
      
      {/* ================= MAIN CONTENT LAYOUT ================= */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start pt-24 md:pt-28 pb-12">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <section className="lg:col-span-3 bg-white rounded-[30px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-6 w-full">
          {/* Dashboard Header Banner */}
          <div className="bg-gradient-to-br from-[#FF4141] to-[#E31A1A] rounded-[24px] p-5 text-white relative overflow-hidden shadow-lg shadow-red-100 min-h-[110px] flex flex-col justify-center">
            <h3 className="text-xl font-bold">Meal Plan</h3>
            <p className="text-white/70 text-xs sm:text-sm mt-0.5 font-medium">Dashboard</p>
            <span className="absolute right-3 bottom-2 text-5xl opacity-80 filter drop-shadow-md">🍲</span>
          </div>

          {/* Navigation Sidebar Tabs */}
          <div className="flex flex-col gap-2">
            {sidebarItems.map((item) => {
              const isActive = activeStep === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveStep(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[20px] transition-all duration-200 text-left ${
                    isActive 
                      ? "bg-[#FFF5F5] border border-red-100/50" 
                      : "bg-transparent hover:bg-gray-50/80"
                  }`}
                >
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${isActive ? "bg-white text-[#E31A1A] shadow-sm" : "bg-gray-50 text-[#A3AED0]"}`}>
                    {item.icon}
                  </span>
                  <div>
                    <span className={`block text-sm sm:text-base font-bold ${isActive ? "text-[#E31A1A]" : "text-[#1B254B]"}`}>
                      {item.label}
                    </span>
                    <span className="block text-xs text-[#A3AED0] font-medium mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Premium Upgrade Card */}
          <div className="bg-[#FFFDF4] rounded-[24px] border border-[#FFEAB2]/40 p-5 text-center relative overflow-hidden flex flex-col items-center">
            <div className="w-11 h-11 bg-[#FFF9E6] text-[#FFB800] rounded-full flex items-center justify-center text-xl shadow-sm mb-3">
              👑
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#1B254B]">Upgrade to Premium</h4>
            <p className="text-xs sm:text-sm text-[#A3AED0] font-medium mt-1 max-w-[200px] mx-auto leading-relaxed">
              Unlock exclusive meals and advanced features.
            </p>
            <button className="mt-4 w-full bg-white border border-[#FFEAB2] hover:bg-[#FFFDF4] text-[#E31A1A] text-xs sm:text-sm font-black py-3 rounded-xl tracking-wider shadow-sm transition-all">
              UPGRADE NOW <span>➔</span>
            </button>
          </div>
        </section>

        {/* ================= RIGHT MAIN AREA (DYNAMIC CONTENT) ================= */}
        <section className="lg:col-span-9 w-full">
          {activeStep === 1 && (
            <div className="fade-in">
              <MealPlanSummary />
            </div>
          )}

          {activeStep === 2 && (
            <div className="fade-in">
              <MealSchedule 
                selectedDay={selectedDay} 
                setSelectedDay={setSelectedDay} 
                weeklyPlan={weeklyPlan} 
                setWeeklyPlan={setWeeklyPlan} 
              />
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] fade-in">
              <UserHistorydetails /> 
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MealPlanner;