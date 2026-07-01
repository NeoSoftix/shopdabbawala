import React, { useMemo, useState } from "react";

import { 
  FaCheck,
  FaTrashCan,
  FaRegCalendar,
  FaShieldHalved,
  FaRegClock,
  FaFileInvoice, 
  FaRotateLeft, // फिक्स्ड आइकॉन
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
    <div className="w-full bg-white rounded-[24px] border border-gray-100 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative opacity-100 transition-opacity duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50/60 rounded-2xl flex items-center justify-center text-red-500 text-2xl shrink-0">
            🍲
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1B254B] tracking-tight">Meal Plan Summary</h2>
            <p className="text-sm font-medium text-gray-400">Quick overview of your current plan</p>
          </div>
        </div>
        
        <div className="bg-[#FFF5F5] text-[#D32F2F] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5">
          <FaShieldHalved size={12} /> Active Plan
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-3 bg-[#FFF5F5]/60 rounded-[20px] p-6 text-center flex flex-col justify-center items-center h-36 border border-red-50/50">
          <span className="text-5xl font-black text-[#D32F2F] tracking-tight">60</span>
          <span className="text-sm font-bold text-gray-500 mt-1">Total Meals</span>
        </div>

        <div className="md:col-span-5 px-4 flex flex-col justify-center h-36">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-black text-[#1B254B]">Plan Usage</span>
            <span className="text-xs font-bold text-[#D32F2F]">40% Used</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-[#D32F2F] rounded-full" style={{ width: "40%" }} />
          </div>
          <div className="grid grid-cols-2 text-center relative">
            <div>
              <span className="block text-2xl font-black text-[#D32F2F]">24</span>
              <span className="text-xs font-bold text-gray-400">Consumed</span>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gray-100"></div>
            <div>
              <span className="block text-2xl font-black text-[#1B254B]">36</span>
              <span className="text-xs font-bold text-gray-400">Remaining</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 border-l border-gray-100 pl-8 space-y-4 flex flex-col justify-center h-36">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50/50 rounded-full flex items-center justify-center text-[#D32F2F] shrink-0">
              <FaRegCalendar size={16} />
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-400 leading-tight">Valid Till</span>
              <span className="text-base font-extrabold text-[#1B254B]">25 Jun 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50/50 rounded-full flex items-center justify-center text-[#D32F2F] shrink-0">
              <FaRegClock size={16} />
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-400 leading-tight">Expires in</span>
              <span className="text-base font-extrabold text-[#1B254B]">91 Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[#FFF5F5]/40 rounded-xl px-4 py-3 border border-red-50/30 flex items-center gap-2.5 text-xs font-bold text-gray-600">
        <FaShieldHalved className="text-[#D32F2F]" size={14} />
        <span>Your plan is active and ready to use.</span>
      </div>
    </div>
  );
};

// ================= COMPONENT: WORKSPACE INTERFACE =================
const MealSchedule = () => {
  const [selectedCategory, setSelectedCategory] = useState("High Protein"); 
  const [selectedDay, setSelectedDay] = useState("Tuesday"); 
  
  // यहाँ से .find() हटा दिया है ताकि कोई स्टेट इनिशियलाइजेशन क्रैश न हो
  const [weeklyPlan, setWeeklyPlan] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

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
    <div className="w-full space-y-8 bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
      <div className="text-center py-2">
        <h2 className="text-2xl font-black text-[#1B254B]">
          Build Your Custom Meal Plan in <span className="text-[#D32F2F]">2 Easy Steps</span>
        </h2>
        <p className="text-xs font-medium text-gray-400 mt-0.5">Healthy meals, your way!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT SECTION */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-white border-2 border-[#D32F2F] text-[#D32F2F] rounded-full flex items-center justify-center font-bold text-xs shrink-0">1</span>
            <div>
              <h3 className="text-xs font-black text-[#1B254B] tracking-wider uppercase">CHOOSE YOUR MEALS</h3>
              <p className="text-[11px] font-medium text-gray-400">Select your favorite meals and diet preference</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 py-1">
            {categoriesData.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border ${
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredFoodItems.map((item) => {
              const isChecked = currentDayMeals.some(i => i && i.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemForDay(item)}
                  className="bg-white rounded-xl border border-gray-100 p-2.5 relative flex flex-col justify-between cursor-pointer group shadow-[0_2px_15px_rgba(0,0,0,0.01)] hover:border-gray-200 transition-all"
                >
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-[#D32F2F] border-[#D32F2F]' : 'border-gray-300 bg-white'}`}>
                      {isChecked && <FaCheck className="text-white" size={8} />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-xs font-black text-[#1B254B] leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 line-clamp-2 leading-tight">{item.desc}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-gray-50 flex items-center justify-end text-[10px] font-bold text-gray-500">
                    <span>🔥 {item.cal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-white border-2 border-[#D32F2F] text-[#D32F2F] rounded-full flex items-center justify-center font-bold text-xs shrink-0">2</span>
            <div>
              <h3 className="text-xs font-black text-[#1B254B] tracking-wider uppercase">PICK DELIVERY DAY</h3>
              <p className="text-[11px] font-medium text-gray-400">Choose your target day to get started</p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-gray-100 p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <span className="text-xs font-black text-[#1B254B] uppercase block tracking-wider">Select Delivery Day</span>
            
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
                    <span className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">{day.label}</span>
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-black transition-all ${
                      isSelected ? 'bg-[#D32F2F] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      {day.date}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-[#1B254B] border-b border-gray-100 pb-1.5 mb-2.5">
                <span className="uppercase text-gray-400">Your Plan ({selectedDay})</span>
                <span className="text-gray-500">{currentDayMeals.length} / {totalSlots} Items</span>
              </div>

              <div className="grid grid-cols-3 gap-2 min-h-[150px]">
                {Array.from({ length: totalSlots }).map((_, index) => {
                  const item = currentDayMeals[index];

                  if (item) {
                    return (
                      <div 
                        key={item.id} 
                        className="flex flex-col justify-between bg-white p-1.5 rounded-xl border border-gray-100 relative group min-h-[75px]"
                      >
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItemFromDay(selectedDay, item.id);
                          }}
                          className="absolute top-1 right-1 text-gray-300 hover:text-red-500 p-0.5 z-10 bg-white rounded-full shadow-sm"
                        >
                          <FaTrashCan size={9} />
                        </button>
                        
                        <div className="space-y-1 text-center mt-1 flex flex-col items-center">
                          <img src={item.image} alt="" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                          <div className="w-full px-0.5">
                            <p className="text-[9px] font-bold text-[#1B254B] truncate leading-tight">{item.name}</p>
                            <p className="text-[8px] text-gray-400 mt-0.5">{item.cal}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={`empty-${index}`} className="flex flex-col items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-1.5 h-[75px] text-center">
                        <span className="text-gray-300 text-[12px] font-light">✕</span>
                        <span className="text-gray-400 text-[8px] font-bold tracking-tight uppercase">Empty</span>
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
                className="bg-[#D32F2F] hover:bg-red-700 text-white font-black text-xs px-5 py-2.5 rounded-xl tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                PREVIEW & CONFIRM &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX */}
      <div className="bg-white rounded-[20px] border border-gray-100 p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
          <span className="text-md">📅</span>
          <div>
            <h4 className="text-xs font-black text-[#1B254B] tracking-wider uppercase">YOUR WEEKLY PLAN</h4>
            <p className="text-[11px] font-medium text-gray-400">Review your meals for the week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysOfWeek.map((day) => {
            const items = weeklyPlan[day.name] || [];
            const hasItems = items.length > 0;

            return (
              <div key={day.id} className="bg-white border border-gray-100 rounded-xl p-2.5 flex flex-col justify-between min-h-[110px]">
                <div>
                  <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-gray-50">
                    <span className="text-[11px] font-black text-[#1B254B]">{day.name}</span>
                    {hasItems && (
                      <span className="text-[8px] font-bold bg-green-50 text-green-600 px-1.5 py-0.2 rounded-full">
                        {items.length} M
                      </span>
                    )}
                  </div>

                  {hasItems ? (
                    <div className="space-y-0.5">
                      {items.map((item, idx) => (
                        <div key={item ? item.id : idx} className="flex justify-between items-center text-[9px] font-bold text-gray-500">
                          <span className="truncate w-full text-left">{item ? item.name : ""}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-300">
                      <p className="text-[9px] italic">No meals</p>
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

// ================= MAIN PARENT COMPONENT WITH WIZARD =================
const MealPlanner = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, label: "Plan Summary", icon: <FaCircleInfo size={16} /> },
    { id: 2, label: "Build Custom Meal", icon: <FaBowlFood size={16} /> },
    { id: 3, label: "My Orders", icon: <FaCalendarDays size={16} /> },

  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFF] font-sans antialiased">
      <Header />
      
      <main className="flex-grow pt-24 pb-12 px-4 max-w-7xl mx-auto w-full space-y-8">
        
        {/* ================= WIZARD / TABS ================= */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 p-3 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black tracking-wide transition-all duration-200 ${
                    isActive 
                      ? "bg-[#D32F2F] text-white shadow-md shadow-red-100" 
                      : "bg-gray-50/50 text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-gray-400"}>
                    {step.icon}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= DYNAMIC CONTENT AREA ================= */}
        <div className="w-full min-h-[400px]">
          {activeStep === 1 && (
            <div className="fade-in">
              <MealPlanSummary />
            </div>
          )}

          {activeStep === 2 && (
            <div className="fade-in">
              <MealSchedule />
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] fade-in">
              <div className="mb-4">
                <h3 className="text-lg font-black text-[#1B254B]">My Active Orders</h3>
                <p className="text-xs text-gray-400">Track and manage your upcoming meal deliveries</p>
              </div>
              <UserHistorydetails /> 
            </div>
          )}

          {activeStep === 4 && (
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] fade-in">
              <div className="mb-4">
                <h3 className="text-lg font-black text-[#1B254B]">Past Orders History</h3>
                <p className="text-xs text-gray-400">View details of your previously delivered meals</p>
              </div>
              <UserHistorydetails />
            </div>
          )}

          {activeStep === 5 && (
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] fade-in">
              <div className="mb-4">
                <h3 className="text-lg font-black text-[#1B254B]">Custom Orders</h3>
                <p className="text-xs text-gray-400">Your specific special requests and tailored meal plans</p>
              </div>
              <UserHistorydetails />
            </div>
          )}
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default MealPlanner;