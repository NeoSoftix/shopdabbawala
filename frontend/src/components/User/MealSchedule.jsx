import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUtensils, 
  FaTableCellsLarge, // LuGrid ka substitute
  FaListCheck,       // LuListTodo ka substitute
  FaCirclePlus,      // LuPlusCircle ka substitute
  FaCalendarDays, 
  FaCircleCheck,     // Sahi standard name for check icon
  FaChevronRight, 
  FaChevronLeft,
  FaClock,
  FaBagShopping      // LuShoppingBag ka substitute
} from "react-icons/fa6";

import {
  mealPlans,
  categories,
  items,
  addons,
} from "../../data/mealData";

const steps = [
  "Select Meals",
  "Select Categories",
  "Select Items",
  "Add Ons",
  "Select Date",
  "Preview & Confirm",
];

const MealSchedule = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleItem = (itemName) => {
    setSelectedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName]
    );
  };

  const toggleAddon = (addon) => {
    const exists = selectedAddons.find((a) => a.id === addon.id);
    if (exists) {
      setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons((prev) => [...prev, { ...addon, qty: 1 }]);
    }
  };

  const updateQty = (id, type) => {
    setSelectedAddons((prev) =>
      prev.map((addon) => {
        if (addon.id !== id) return addon;
        return {
          ...addon,
          qty: type === "plus" ? addon.qty + 1 : Math.max(1, addon.qty - 1),
        };
      })
    );
  };

  const addonTotal = useMemo(() => {
    return selectedAddons.reduce((total, addon) => total + addon.price * addon.qty, 0);
  }, [selectedAddons]);

  const baseMealPrice = selectedMeal ? 120 : 0;
  const calculatedSubtotal = baseMealPrice + addonTotal;

  const nextStep = () => {
    if (currentStep === 0 && !selectedMeal) return;
    if (currentStep === 1 && !selectedCategory) return;
    if (currentStep === 2 && selectedItems.length === 0) return;
    if (currentStep === 4 && (!selectedDate || !selectedTime)) return;

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderPreview = () => (
    <div className="space-y-4 text-sm text-[#2b2b2b]">
      {!selectedMeal ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 bg-slate-50 border border-dashed border-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-300">
            <FaBagShopping size={20} />
          </div>
          <p className="text-xs text-slate-400 font-bold max-w-[170px] uppercase tracking-wider">
            Configure choices to build plan preview
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">Meals</p>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0 shadow-sm">
                <img src={selectedMeal.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-xs text-slate-800 uppercase tracking-wide">{selectedMeal.name}</p>
                <p className="text-[11px] font-bold text-red-600 mt-0.5">₹{baseMealPrice}/meal</p>
              </div>
            </div>
          </div>

          {selectedCategory && (
            <div className="group">
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">Categories</p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/40>">
                <span>🌱</span> {selectedCategory}
              </div>
            </div>
          )}

          {selectedItems.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">
                Items ({selectedItems.length})
              </p>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl space-y-2 shadow-inner">
                {selectedItems.map((item) => (
                  <div key={item} className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>{item}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-white border border-slate-100 rounded-md text-slate-400 tracking-wide uppercase">Included</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedAddons.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">
                Add Ons ({selectedAddons.length})
              </p>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl space-y-2 shadow-inner">
                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>{addon.name} <span className="text-slate-400 font-medium">(x{addon.qty})</span></span>
                    <span className="font-black text-slate-800">₹{addon.price * addon.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(selectedDate || selectedTime) && (
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">Date & Time</p>
              <div className="text-xs bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1 font-bold text-slate-600">
                {selectedDate && <p className="flex items-center gap-2">📅 Start: {selectedDate}</p>}
                {selectedTime && <p className="flex items-center gap-2">⏰ Slot: {selectedTime}</p>}
              </div>
            </div>
          )}

          <div className="border-t border-dashed border-slate-200 mt-5 pt-4 flex justify-between items-center">
            <span className="font-black text-slate-800 text-sm uppercase tracking-wider">Subtotal</span>
            <span className="font-black text-slate-900 text-xl tracking-tight">₹{calculatedSubtotal}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Meals</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Choose the optimal foundational meal bundle you desire to configure.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mealPlans.map((meal) => {
                const isSelected = selectedMeal?.id === meal.id;
                return (
                  <div
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between group
                    ${isSelected ? "border-red-500 bg-red-50/10 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-50 border-2 border-white shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <img src={meal.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-slate-800 uppercase tracking-wide">{meal.name}</h3>
                        <p className="text-xs text-red-600 font-black mt-0.5">₹120 / meal</p>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center font-black text-xs transition-all
                      ${isSelected ? "border-red-600 bg-red-600 text-white" : "border-slate-200 bg-white"}`}>
                      {isSelected && "✓"}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Categories</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Isolate and filter out preferred kitchen category styles.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory(prev => prev === cat ? "" : cat)}
                    className={`cursor-pointer p-4 rounded-2xl border flex items-center justify-between transition-all
                    ${isSelected ? "border-red-500 bg-red-50/10 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="accent-red-600 h-4 w-4 rounded-md border-slate-300 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{cat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Items</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Pick out precise customized culinary elements to bundle together.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item) => {
                const active = selectedItems.includes(item.name);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.name)}
                    className={`cursor-pointer p-4 rounded-2xl border flex justify-between items-center transition-all
                    ${active ? "border-red-500 bg-red-50/10 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={active}
                        readOnly
                        className="accent-red-600 h-4 w-4 rounded-md border-slate-300 cursor-pointer"
                      />
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">{item.name}</h3>
                    </div>
                    <span className="text-xs font-black text-slate-400">₹{item.price || 40}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Add Ons</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Extra snacks, treats and additions to complement your package.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {addons.map((addon) => {
                const selected = selectedAddons.find((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`rounded-2xl border p-4 flex justify-between items-center transition-all
                    ${selected ? "border-red-500 bg-red-50/10 shadow-sm" : "border-slate-100 bg-white"}`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => toggleAddon(addon)}
                        className="accent-red-600 h-4 w-4 rounded-md border-slate-300 cursor-pointer"
                      />
                      <div>
                        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">{addon.name}</h3>
                        <p className="text-xs text-slate-400 font-extrabold mt-0.5">₹{addon.price}</p>
                      </div>
                    </div>

                    {selected && (
                      <div className="flex items-center border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQty(addon.id, "minus"); }}
                          className="w-8 h-8 font-black text-sm text-slate-500 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                        >
                          —
                        </button>
                        <span className="px-3 font-black text-xs text-slate-800 min-w-[28px] text-center">
                          {selected.qty}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQty(addon.id, "plus"); }}
                          className="w-8 h-8 font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Date</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Choose the date from which you want to start your meals.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Select Start Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded-xl p-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-3">Meal Time</label>
                <div className="grid grid-cols-2 gap-4">
                  {["Lunch", "Dinner"].map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <div
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`cursor-pointer p-4 rounded-xl border text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2
                        ${isSelected ? "border-red-500 bg-red-50/20 text-red-600 shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                      >
                        <FaClock size={12} />
                        <span>{slot}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Preview Your Order</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Review your plan details and confirm your order.</p>
            </div>

            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 space-y-3.5 text-xs font-bold text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider">Meals</span>
                <span className="font-bold text-slate-800">{selectedMeal?.name || "None"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider">Categories</span>
                <span className="font-bold text-emerald-600">{selectedCategory || "None"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider">Slot & Date</span>
                <span className="font-bold text-slate-800">{selectedDate} ({selectedTime})</span>
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-800 uppercase tracking-wide">Total Price</span>
                <span className="font-black text-red-600 text-lg">₹{calculatedSubtotal}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 border border-red-100/50 rounded-full flex items-center justify-center mb-2.5 text-red-600">
                <FaCircleCheck size={20} />
              </div>
              <h4 className="font-black text-sm text-slate-800 uppercase tracking-wide">Almost done!</h4>
              <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto mt-1 font-semibold leading-relaxed">
                Please review your order and confirm to schedule your meals.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 sm:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-[1140px] grid grid-cols-1 lg:grid-cols-[250px_1fr_320px] gap-6 lg:gap-8 items-start">
        
        {/* Modern Sidebar Steps Progress Panel */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] space-y-1.5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar gap-2 lg:gap-0">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 shrink-0 lg:w-full
                ${isCurrent ? "bg-red-50/50 text-red-600" : "text-slate-400"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all
                  ${isCompleted ? "bg-red-600 text-white" : isCurrent ? "bg-red-600 text-white shadow-md shadow-red-500/10" : "bg-slate-100 text-slate-400"}`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <span className={`text-[11px] font-black tracking-widest uppercase hidden sm:inline-block ${isCurrent ? "text-red-700" : "text-slate-400"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Central Workspace Card Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] min-h-[480px] flex flex-col justify-between order-3 lg:order-2">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Action Footer Navigation Controllers */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-5 h-[42px] text-xs font-black uppercase tracking-wider text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-0 transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
            >
              <FaChevronLeft size={12} />
              <span>Previous</span>
            </button>

            {currentStep === 5 ? (
              <button
                onClick={() => alert("Meal Scheduled Successfully!")}
                className="px-6 h-[42px] bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-red-500/10 transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none"
              >
                <span>Confirm Order</span>
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 0 && !selectedMeal) ||
                  (currentStep === 1 && !selectedCategory) ||
                  (currentStep === 2 && selectedItems.length === 0) ||
                  (currentStep === 4 && (!selectedDate || !selectedTime))
                }
                className="px-6 h-[42px] bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none"
              >
                <span>Next</span>
                <FaChevronRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Static Right Sticky Preview Panel Block */}
        <aside className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] lg:sticky lg:top-6 order-2 lg:order-3">
          <h3 className="font-black text-[11px] tracking-widest uppercase text-red-600 mb-4 border-b border-slate-50 pb-3 flex items-center gap-2">
            <FaBagShopping size={12} />
            <span>Your Plan Preview</span>
          </h3>
          {renderPreview()}
        </aside>

      </div>
    </div>
  );
};

export default MealSchedule;