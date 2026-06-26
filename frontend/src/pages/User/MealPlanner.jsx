import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { 
  FaChevronRight, 
  FaChevronLeft,
  FaCheck,
  FaHeadset
} from "react-icons/fa6";
// To this:
import {
  FiCoffee,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi"; // <-- Changed to react-icons/fi

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
const steps = [
  { id: "01", title: "SELECT MEALS", desc: "Choose your meal" },
  { id: "02", title: "SELECT CATEGORIES", desc: "Pick your categories" },
  { id: "03", title: "SELECT ITEMS", desc: "Choose your items" },
  { id: "04", title: "ADD ONS", desc: "Extras & add ons" },
  { id: "05", title: "SELECT DATE", desc: "Pick your date" },
  { id: "06", title: "PREVIEW & CONFIRM", desc: "Review your plan" },
];

const mealPlans = [
  { id: "breakfast", name: "BREAKFAST", price: 80, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&auto=format&fit=crop&q=80" },
  { id: "lunch", name: "LUNCH", price: 120, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80" },
  { id: "dinner", name: "DINNER", price: 150, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop&q=80" }
];

const categoriesData = [
  { id: "high-protein", name: "High Protein", icon: "💪" },
  { id: "low-carb", name: "Low Carb", icon: "🥗" },
  { id: "keto", name: "Keto Diet", icon: "🥑" },
  { id: "vegan", name: "Vegan", icon: "🌱" }
];

const foodItems = [
  { id: "dal", name: "DAL", price: 40 },
  { id: "paneer", name: "PANEER SABZI", price: 40 },
  { id: "mixveg", name: "MIX VEG", price: 40 },
  { id: "rice", name: "JEERA RICE", price: 40 },
  { id: "roti", name: "ROTI", price: 40 },
  { id: "salad", name: "SALAD", price: 40 },
];

const addonsData = [
  { id: "sweet", name: "Gulab Jamun", price: 30 },
  { id: "curd", name: "Fresh Curd", price: 20 },
  { id: "butter", name: "Extra Butter", price: 15 },
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
  const [currentStep, setCurrentStep] = useState(0); // App starts at step 0 now to see full flow
  const [selectedMeal, setSelectedMeal] = useState(mealPlans[1]); // Default Lunch
  const [selectedCategory, setSelectedCategory] = useState("High Protein");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some(i => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.some(a => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const calculatedSubtotal = useMemo(() => {
    const baseMealPrice = selectedMeal ? selectedMeal.price : 120;
    const itemTotal = selectedItems.reduce((acc, current) => acc + current.price, 0);
    const addonTotal = selectedAddons.reduce((acc, current) => acc + current.price, 0);
    return baseMealPrice + itemTotal + addonTotal;
  }, [selectedItems, selectedMeal, selectedAddons]);

  const nextStep = () => { if (currentStep < 5) setCurrentStep((prev) => prev + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep((prev) => prev - 1); };

  // Dynamic Content Renderer for all steps with Dummy Data
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mealPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedMeal(plan)}
                className={`cursor-pointer rounded-[20px] p-5 border-2 flex flex-col items-center text-center bg-white transition-all duration-200 hover:shadow-sm ${
                  selectedMeal?.id === plan.id ? "border-[#FF4D4F] bg-[#FFF1F2]/20" : "border-[#E0E5F2]/70"
                }`}
              >
                <img src={plan.image} alt={plan.name} className="w-16 h-16 rounded-full object-cover mb-3" />
                <span className="text-xs font-black text-[#2B3674]">{plan.name}</span>
                <span className="text-xs font-black text-[#FF4D4F] mt-1">₹{plan.price}</span>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categoriesData.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`cursor-pointer rounded-[20px] p-5 border-2 text-center bg-white transition-all duration-200 ${
                  selectedCategory === cat.name ? "border-[#FF4D4F] bg-[#FFF1F2]/20" : "border-[#E0E5F2]/70"
                }`}
              >
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <span className="text-xs font-bold text-[#2B3674]">{cat.name}</span>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foodItems.map((item) => {
                const isChecked = selectedItems.some(i => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`cursor-pointer rounded-[20px] p-5 border-2 flex items-center justify-between bg-white transition-all duration-200 ${
                      isChecked ? "border-[#FF4D4F]" : "border-[#E0E5F2]/70"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input type="checkbox" checked={isChecked} readOnly className="accent-[#FF4D4F] h-4 w-4 cursor-pointer" />
                      <span className="text-xs font-black text-[#2B3674]">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#FF4D4F]">₹{item.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {addonsData.map((addon) => {
              const isChecked = selectedAddons.some(a => a.id === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon)}
                  className={`cursor-pointer rounded-[20px] p-5 border-2 flex flex-col justify-between bg-white transition-all duration-200 ${
                    isChecked ? "border-[#FF4D4F] bg-[#FFF1F2]/10" : "border-[#E0E5F2]/70"
                  }`}
                >
                  <span className="text-xs font-black text-[#2B3674]">{addon.name}</span>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-black text-[#FF4D4F]">₹{addon.price}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isChecked ? 'bg-[#FF4D4F] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {isChecked ? "Added" : "Add"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 4:
        return (
          <div className="max-w-xs mx-auto space-y-3 text-center">
            <p className="text-xs font-bold text-[#2B3674] mb-2">Select Delivery Date</p>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border-2 border-[#E0E5F2] p-3 rounded-xl text-xs font-bold text-[#2B3674] focus:outline-none focus:border-[#FF4D4F]"
            />
          </div>
        );
      case 5:
        return (
          <div className="bg-[#FAFBFE] rounded-2xl p-6 border border-[#E0E5F2] space-y-4">
            <h4 className="text-sm font-black text-[#2B3674] border-b pb-2">Order Summary</h4>
            <div className="space-y-2 text-xs font-bold text-[#2B3674] flex flex-col gap-1">
              <div className="flex justify-between"><span>Plan Type:</span> <span className="text-[#FF4D4F]">{selectedMeal?.name || "Not Selected"}</span></div>
              <div className="flex justify-between"><span>Category:</span> <span className="text-emerald-600">{selectedCategory}</span></div>
              <div className="flex justify-between"><span>Selected Items:</span> <span>{selectedItems.length} Items</span></div>
              <div className="flex justify-between"><span>Addons:</span> <span>{selectedAddons.length} Added</span></div>
              <div className="flex justify-between"><span>Delivery Date:</span> <span className="text-blue-600">{selectedDate || "Tomorrow"}</span></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr_290px] gap-4 items-stretch">
      
      {/* COLUMN 1: PROGRESS BAR LAYOUT */}
      <div className="flex flex-col justify-between h-full space-y-6">
        <div className="bg-white rounded-[24px] p-6 border border-[#E0E5F2]/60 shadow-[0_12px_40px_rgba(112,144,176,0.04)] relative flex flex-col gap-1">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="relative flex flex-col group">
                
                {/* Vertical Progress Line UI Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[19px] top-10 w-[1px] h-[calc(100%-12px)] z-0">
                    <div className={`w-full h-full ${isCompleted ? "bg-[#FF4D4F]" : "bg-[#E0E5F2]"}`} />
                  </div>
                )}

                {/* Active highlight background patch */}
                {isCurrent && (
                  <div className="absolute inset-0 -mx-3 bg-[#FFF1F2] border border-[#FFCCC7]/40 rounded-[16px] -z-0 pointer-events-none" />
                )}

                <div className="flex items-center gap-4 py-3 px-1 z-10 w-full transition-all duration-300">
                  {/* Circle Indicator Style (Updated Fix to keep numbers always visible) */}
                  <div
                    className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center text-[20px] font-black transition-all duration-300 bg-white shadow-sm shrink-0 relative
                    ${isCompleted ? "border-[#FF4D4F] text-[#FF4D4F]" : isCurrent ? "border-[#FF4D4F] bg-white text-[#FF4D4F] ring-4 ring-[#FF4D4F]/10" : "border-[#E0E5F2] text-[#A3AED0]"}`}
                  >
                    <span>{step.id}</span>
                    {isCompleted && (
                      <span className="absolute -top-1 -right-1 bg-[#FF4D4F] text-white rounded-full p-0.5 border border-white">
                        <FaCheck size={6} />
                      </span>
                    )}
                  </div>

                  {/* Step Content Labels */}
                  <div className="flex flex-col">
                    <span className={`text-[18px] font-extrabold tracking-wider ${isCurrent ? "text-[#FF4D4F]" : isCompleted ? "text-[#2B3674]" : "text-[#A3AED0]"}`}>
                      {step.title}
                    </span>
                    <span className="text-[14px] font-medium text-[#A3AED0] mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Need Help Sidebar Footer Widget */}
        <div className="bg-[#FFF1F2]/60 border border-[#FFCCC7]/40 rounded-[20px] p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF4D4F] border border-[#FFCCC7]/50 shadow-sm">
              <FaHeadset size={13} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2B3674]">Need Help?</h4>
              <p className="text-[10px] font-medium text-[#A3AED0]">We're here to help you</p>
            </div>
          </div>
          <button className="text-[11px] font-bold text-[#FF4D4F] hover:underline self-start mt-1 flex items-center gap-1">
            Chat with us →
          </button>
        </div>
      </div>

      {/* COLUMN 2: MAIN CENTRAL WORKSPACE MODULE */}
      <div className="bg-white rounded-[32px] border border-[#E0E5F2]/50 shadow-[0_15px_50px_rgba(112,144,176,0.05)] flex flex-col justify-between overflow-hidden relative">
        
        {/* Header section styling with layout banner element */}
        <div className="p-6 sm:p-10 pb-4 flex justify-between items-start relative min-h-[170px]">
          <div className="space-y-1 max-w-[60%] z-10">
            <span className="text-[11px] font-extrabold text-[#FF4D4F] tracking-widest uppercase">STEP {steps[currentStep].id}</span>
            <h2 className="text-3xl font-black text-[#2B3674] tracking-tight mt-1">{steps[currentStep].title}</h2>
            <p className="text-xs font-medium text-[#A3AED0] leading-relaxed mt-1">
              {steps[currentStep].desc} dashboard integration interface view.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-[45%] pointer-events-none flex items-center justify-end overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80" 
              alt="culinary setup illustration" 
              className="object-cover rounded-bl-full w-[200px] h-[170px] border-l-4 border-b-4 border-white shadow-md translate-x-5"
            />
          </div>
        </div>

        {/* Subtitle bar widget */}
        <div className="px-6 sm:px-10 py-3 flex justify-between items-center bg-transparent border-t border-b border-dashed border-[#E0E5F2]/60">
          <span className="text-[11px] font-black text-[#2B3674] tracking-wider uppercase">CONFIGURE YOUR SELECTION</span>
          <div className="bg-[#FFF1F2] px-2.5 py-1 rounded-full border border-[#FFCCC7]/50 flex items-center gap-1.5">
            <span className="text-[10px] font-black text-[#FF4D4F] tracking-wide">
              ✨ Dynamic Configuration Mode
            </span>
          </div>
        </div>

        {/* Dynamic Step Content Rendering */}
        <div className="p-6 sm:p-10 flex-1 bg-[#FAFBFE]/40">
          {renderStepContent()}
        </div>

        {/* Action Footer Button Controllers Module */}
        <div className="px-6 sm:px-10 py-6 border-t border-[#E0E5F2]/60 flex justify-between items-center bg-white">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 h-[44px] text-xs font-black uppercase tracking-wider text-[#2B3674] border-2 border-[#E0E5F2] rounded-xl hover:bg-[#FAFBFE] disabled:opacity-0 transition-all cursor-pointer flex items-center gap-2 focus:outline-none"
          >
            <FaChevronLeft size={10} />
            <span>PREVIOUS</span>
          </button>

          <button
            onClick={nextStep}
            disabled={currentStep === 5}
            className="px-8 h-[44px] bg-[#FF4D4F] hover:bg-[#E03B3D] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#FF4D4F]/20 transition-all flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <span>{currentStep === 5 ? "CONFIRM" : "NEXT"}</span>
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* COLUMN 3: RIGHT STICKY PREVIEW MODULE PANEL */}
      <aside className="bg-white rounded-[28px] p-5 border border-[#E0E5F2]/60 shadow-[0_12px_40px_rgba(112,144,176,0.03)] lg:sticky lg:top-28 flex flex-col justify-between h-full space-y-6">
        <div className="space-y-6">
          <h3 className="font-black text-me tracking-widest uppercase text-[#FF4D4F] pb-4 border-b border-[#E0E5F2]/50 flex items-center gap-2">
            🔒 <span>YOUR PLAN PREVIEW</span>
          </h3>

          <div className="space-y-2">
            <span className="text-[20px] font-extrabold text-[#A3AED0] tracking-wider uppercase block">MEAL</span>
            <div className="flex items-center gap-3.5 bg-[#FAFBFE] border border-[#E0E5F2]/70 p-3 rounded-[20px]">
              <div className="w-10 h-10 rounded-full border border-[#E0E5F2] overflow-hidden flex-shrink-0 shadow-inner">
                <img src={selectedMeal?.image} alt="selected platter" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-xs text-[#2B3674] tracking-wide uppercase">{selectedMeal?.name || "NONE"}</p>
                <p className="text-[18px] font-black text-[#FF4D4F] mt-0.5">₹{selectedMeal?.price || 0}/meal</p>
              </div>
            </div>
          </div>

          {selectedCategory && (
            <div className="space-y-2">
              <span className="text-[20px] font-extrabold text-[#A3AED0] tracking-wider uppercase block">CATEGORIES</span>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[18px] font-extrabold text-emerald-700 bg-[#E3FBE3] px-3 py-1.5 rounded-full border border-[#B7EB8F]/30">
                  <span>🌱</span> {selectedCategory}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-extrabold text-[#A3AED0] tracking-wider uppercase">ITEMS SELECTED</span>
              <span className="text-[14px] font-bold text-[#FF4D4F]">{selectedItems.length} items</span>
            </div>
            {selectedItems.length > 0 ? (
              <div className="bg-[#FAFBFE] border border-[#E0E5F2]/70 p-3.5 rounded-[20px] space-y-2 max-h-[140px] overflow-y-auto">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs font-bold text-[#2B3674]">
                    <span>{item.name}</span>
                    <span className="text-[18px] font-extrabold px-1.5 bg-white border border-[#E0E5F2] rounded-md text-[#A3AED0]">Included</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FFF1F2]/40 border border-dashed border-[#FFCCC7]/60 rounded-[20px] p-5 text-center">
                <p className="text-[18px] font-medium text-[#A3AED0]">No items selected yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-dashed border-[#E0E5F2]">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-[#2B3674] text-xs uppercase tracking-wider">SUBTOTAL</span>
            <span className="font-black text-[#2B3674] text-2xl tracking-tight">₹{calculatedSubtotal}</span>
          </div>
        </div>
      </aside>

    </div>
  );
};

// ================= MAIN PARENT COMPONENT: MEAL PLANNER =================
const MealPlanner = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans antialiased">
      <Header />
      <main className="flex-grow pt-28 pb-12 px-4 max-w-7xl mx-auto w-full space-y-10">
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