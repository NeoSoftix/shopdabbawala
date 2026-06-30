import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { 
  FaCheck,
  FaTrashCan,
  FaCalendarDays
} from "react-icons/fa6";

import {
  FiCoffee,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiAlertCircle,
  FiLayers
} from "react-icons/fi"; 

import Header from "../../components/HeroHeader";
import Footer from "../../components/Footer";

const StatCard = ({ title, value, growth, Icon }) => (
  <div className="bg-white p-5 rounded-[20px] border border-[#E0E5F2]/60 shadow-[0_12px_40px_rgba(112,144,176,0.03)] flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-[11px] font-extrabold text-[#A3AED0] tracking-wider uppercase">{title}</p>
      <h3 className="text-2xl font-black text-[#2B3674]">{value}</h3>
      <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">{growth}</p>
    </div>
    <div className="w-12 h-12 rounded-full bg-[#FAFBFE] flex items-center justify-center text-[#FF4D4F] border border-[#E0E5F2]/50 shadow-inner">
      <Icon size={20} />
    </div>
  </div>
);

// Configuration Data
const daysOfWeek = [
  { id: "mon", name: "Monday" },
  { id: "tue", name: "Tuesday" },
  { id: "wed", name: "Wednesday" },
  { id: "thu", name: "Thursday" },
  { id: "fri", name: "Friday" },
  { id: "sat", name: "Saturday" },
  { id: "sun", name: "Sunday" },
];

const categoriesData = [
  { id: "high-protein", name: "High Protein", icon: "💪" },
  { id: "low-carb", name: "Low Carb", icon: "🥗" },
  { id: "keto", name: "Keto Diet", icon: "🥑" },
  { id: "vegan", name: "Vegan", icon: "🌱" }
];

const foodItems = [
  { id: "dal", name: "Makhani Dal", price: 40, category: "High Protein", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150&auto=format&fit=crop&q=80" },
  { id: "paneer", name: "Paneer Tikka Masala", price: 50, category: "High Protein", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=150&auto=format&fit=crop&q=80" },
  { id: "chicken", name: "Grilled Herb Chicken", price: 90, category: "High Protein", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=150&auto=format&fit=crop&q=80" },
  { id: "mixveg", name: "Sautéed Mix Veggies", price: 40, category: "Low Carb", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop&q=80" },
  { id: "salad", name: "Avocado Green Salad", price: 30, category: "Low Carb", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=80" },
  { id: "keto-bowl", name: "Keto Paneer Bowl", price: 70, category: "Keto Diet", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=150&auto=format&fit=crop&q=80" },
  { id: "roti", name: "Multigrain Roti (2 pcs)", price: 15, category: "Vegan", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=150&auto=format&fit=crop&q=80" },
  { id: "rice", name: "Organic Brown Rice", price: 40, category: "Vegan", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=150&auto=format&fit=crop&q=80" },
];

const statsData = [
  { title: "Total Meals", value: "60", growth: "100%", Icon: FiCoffee },
  { title: "Consumed", value: "24", growth: "40%", Icon: FiCheckCircle },
  { title: "Remaining", value: "36", growth: "60%", Icon: FiClock },
  { title: "Valid Till", value: "25 Jun", growth: "2026", Icon: FiCalendar },
  { title: "Expires In", value: "91", growth: "Days", Icon: FiAlertCircle },
];

// ================= COMPONENT: MEAL SCHEDULE =================
const MealSchedule = () => {
  const [selectedCategory, setSelectedCategory] = useState("High Protein"); 
  const [selectedDay, setSelectedDay] = useState("Monday"); 
  
  // Weekly Plan State Structure: { "Monday": [items], "Tuesday": [], ... }
  const [weeklyPlan, setWeeklyPlan] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  // Filter food items based on selected category
  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  // Toggle item dynamic insertion based on Selected Day
  const toggleItemForDay = (item) => {
    setWeeklyPlan((prev) => {
      const currentDayItems = prev[selectedDay];
      const exists = currentDayItems.some((i) => i.id === item.id);
      
      return {
        ...prev,
        [selectedDay]: exists
          ? currentDayItems.filter((i) => i.id !== item.id)
          : [...currentDayItems, item]
      };
    });
  };

  // Remove single item from a specific day
  const removeItemFromDay = (day, itemId) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: prev[day].filter((item) => item.id !== itemId)
    }));
  };

  // Calculate Total Weekly Price
  const totalWeeklyPrice = useMemo(() => {
    return Object.values(weeklyPlan)
      .flatMap(items => items)
      .reduce((sum, item) => sum + item.price, 0);
  }, [weeklyPlan]);

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-8">
      
      {/* 2 COLUMN MAIN WORKSPACE INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT SECTION: CATEGORIES & ITEMS MODULE */}
        <div className="bg-white rounded-[32px] border border-[#E0E5F2]/50 shadow-[0_15px_50px_rgba(112,144,176,0.05)] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-[#E0E5F2]/60">
            <span className="text-[11px] font-extrabold text-[#FF4D4F] tracking-widest uppercase">STEP 01</span>
            <h2 className="text-2xl font-black text-[#2B3674] tracking-tight mt-0.5">SELECT MEAL ITEMS</h2>
            <p className="text-xs font-medium text-[#A3AED0] mt-1">Choose a category and select items to add to your active day.</p>
            
            {/* Category Wizard Tabs */}
            <div className="flex flex-wrap gap-2 pt-4">
              {categoriesData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                    selectedCategory === cat.name
                      ? "bg-[#FF4D4F] text-white border-[#FF4D4F] shadow-md shadow-[#FF4D4F]/20"
                      : "bg-white text-[#2B3674] border-[#E0E5F2] hover:bg-[#FAFBFE]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Render Items by Category */}
          <div className="p-6 bg-[#FAFBFE]/40 flex-1 overflow-y-auto max-h-[420px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFoodItems.map((item) => {
                const isChecked = weeklyPlan[selectedDay]?.some(i => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItemForDay(item)}
                    className={`cursor-pointer rounded-[20px] p-3 border-2 flex items-center gap-4 bg-white transition-all duration-200 hover:shadow-sm ${
                      isChecked ? "border-[#FF4D4F] bg-[#FFF1F2]/10" : "border-[#E0E5F2]/70"
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#2B3674] truncate">{item.name}</p>
                      <p className="text-xs font-bold text-[#FF4D4F] mt-0.5">₹{item.price}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={isChecked || false} 
                      readOnly 
                      className="accent-[#FF4D4F] h-4 w-4 cursor-pointer mr-2 shrink-0" 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: 7 DAYS PLANNER MODULE */}
        <div className="bg-white rounded-[32px] border border-[#E0E5F2]/50 shadow-[0_15px_50px_rgba(112,144,176,0.05)] flex flex-col justify-between overflow-hidden">
          <div className="p-6 border-b border-[#E0E5F2]/60">
            <span className="text-[11px] font-extrabold text-[#FF4D4F] tracking-widest uppercase">STEP 02</span>
            <h2 className="text-2xl font-black text-[#2B3674] tracking-tight mt-0.5">CHOOSE DELIVERY DAY</h2>
            <p className="text-xs font-medium text-[#A3AED0] mt-1">Select a target day wizard from the tier list to map items.</p>
            
            {/* 7 Days Grid Wizard */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-4">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day.name;
                const itemsCount = weeklyPlan[day.name]?.length || 0;
                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.name)}
                    className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-[#2B3674] text-white border-[#2B3674] shadow-md"
                        : "bg-white text-[#2B3674] border-[#E0E5F2] hover:border-[#2B3674]/40"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">{day.name.substring(0, 3)}</span>
                    {itemsCount > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.2 mt-1 rounded-full font-bold ${isSelected ? 'bg-[#FF4D4F] text-white' : 'bg-red-50 text-[#FF4D4F]'}`}>
                        {itemsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day's Real-time Added Items List */}
          <div className="p-6 bg-[#FAFBFE]/40 flex-1 overflow-y-auto max-h-[300px]">
            <h4 className="text-xs font-extrabold text-[#2B3674] mb-3 uppercase flex items-center gap-1.5">
              <FaCalendarDays className="text-[#FF4D4F]" /> Items mapped for {selectedDay}
            </h4>
            {weeklyPlan[selectedDay]?.length > 0 ? (
              <div className="space-y-2">
                {weeklyPlan[selectedDay].map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-[#E0E5F2]/60 shadow-2xs">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#2B3674]">{item.name}</p>
                      <p className="text-[10px] text-[#A3AED0] font-bold uppercase">{item.category}</p>
                    </div>
                    <span className="text-xs font-black text-[#FF4D4F] mr-2">₹{item.price}</span>
                    <button 
                      onClick={() => removeItemFromDay(selectedDay, item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <FaTrashCan size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-[#E0E5F2] rounded-2xl bg-white/50">
                <p className="text-xs font-medium text-[#A3AED0]">No items added to {selectedDay} yet.</p>
                <p className="text-[10px] text-[#A3AED0]/70 mt-0.5">Select items from left panel to map them here.</p>
              </div>
            )}
          </div>

          {/* Action Trigger Box */}
          <div className="p-4 border-t border-[#E0E5F2]/60 bg-white flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold text-[#A3AED0] uppercase block">Weekly Total</span>
              <span className="text-xl font-black text-[#2B3674]">₹{totalWeeklyPrice}</span>
            </div>
            <button
              onClick={() => alert("Order Confirmed! Checkout logic here.")}
              className="px-6 h-[40px] bg-[#FF4D4F] hover:bg-[#E03B3D] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-[#FF4D4F]/20 transition-all flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <span>PREVIEW & CONFIRM</span>
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: GRANULAR WEEKLY PREVIEW & METRICS PANEL */}
      <div className="bg-white rounded-3xl border border-[#E0E5F2] p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E0E5F2]">
          <div className="w-7 h-7 rounded-full bg-red-50 text-[#FF4D4F] flex items-center justify-center font-bold text-xs">✓</div>
          <div>
            <h4 className="text-sm font-black text-[#2B3674]">Grand Custom Subscription Preview Matrix</h4>
            <p className="text-[11px] text-[#A3AED0]">Review your fully customized 7-day culinary configuration breakdown items tier mapping.</p>
          </div>
        </div>

        {/* 7-Day Matrix Output Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {daysOfWeek.map((day) => {
            const hasItems = weeklyPlan[day.name]?.length > 0;
            return (
              <div 
                key={day.id} 
                className={`rounded-2xl border p-3.5 flex flex-col justify-between min-h-[160px] transition-all ${
                  hasItems ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-100 bg-[#FAFBFE]/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center border-b pb-1.5 mb-2 border-gray-100">
                    <span className="text-xs font-black text-[#2B3674]">{day.name}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${hasItems ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                      {hasItems ? `${weeklyPlan[day.name].length} Meals` : 'Empty'}
                    </span>
                  </div>

                  {hasItems ? (
                    <div className="space-y-1 max-h-[110px] overflow-y-auto pr-0.5">
                      {weeklyPlan[day.name].map((item) => (
                        <div key={item.id} className="text-[10px] bg-white p-1 rounded-md border border-gray-100 flex justify-between items-center font-bold text-[#2B3674]">
                          <span className="truncate max-w-[70%]">{item.name}</span>
                          <span className="text-[#FF4D4F] shrink-0">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] italic text-[#A3AED0] text-center mt-6">No active plans</p>
                  )}
                </div>

                {hasItems && (
                  <div className="pt-2 mt-2 border-t border-dashed border-gray-100 flex justify-between items-center text-[10px] font-black text-[#2B3674]">
                    <span>SUBTOTAL:</span>
                    <span className="text-emerald-700">₹{weeklyPlan[day.name].reduce((s, i) => s + i.price, 0)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

// ================= MAIN PARENT COMPONENT: MEAL PLANNER =================
const MealPlanner = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans antialiased">
      <Header />
      <main className="flex-grow pt-28 pb-12 px-4 max-w-7xl mx-auto w-full space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {statsData.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} growth={stat.growth} Icon={stat.Icon} />
          ))}
        </section>
        <section className="w-full">
          <MealSchedule />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MealPlanner;