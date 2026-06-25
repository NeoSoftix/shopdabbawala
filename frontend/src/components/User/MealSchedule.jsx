import React, { useMemo, useState } from "react";
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

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
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

  // Image layout calculation standard logic helper
  const baseMealPrice = selectedMeal ? 120 : 0; // standard sample static base indicator
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
      {/* Dynamic Graphic Banner Block based on Selection state */}
      {!selectedMeal ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl text-gray-300">🍽️</span>
          </div>
          <p className="text-xs text-gray-400 font-medium max-w-[160px]">
            Continue selecting to see your full plan preview
          </p>
        </div>
      ) : (
        <>
          <div>
            <p className="text-xs font-bold text-red-700 tracking-wide uppercase mb-1">Meals</p>
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-pink-100/60 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden flex-shrink-0">
                <img src={selectedMeal.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-xs text-gray-800">{selectedMeal.name}</p>
                <p className="text-[11px] text-gray-500">₹{baseMealPrice}/meal</p>
              </div>
            </div>
          </div>

          {selectedCategory && (
            <div>
              <p className="text-xs font-bold text-red-700 tracking-wide uppercase mb-1">Categories</p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/60 px-2.5 py-1.5 rounded-lg w-fit">
                <span>🌱</span> {selectedCategory}
              </div>
            </div>
          )}

          {selectedItems.length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-700 tracking-wide uppercase mb-1">
                Items ({selectedItems.length})
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-pink-100/60 space-y-1.5 shadow-sm">
                {selectedItems.map((item) => (
                  <div key={item} className="flex justify-between text-[11px] font-medium text-gray-600">
                    <span>{item}</span>
                    <span className="text-gray-400">Included</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedAddons.length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-700 tracking-wide uppercase mb-1">
                Add Ons ({selectedAddons.length})
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-pink-100/60 space-y-1.5 shadow-sm">
                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-[11px] font-medium text-gray-600">
                    <span>{addon.name} <span className="text-gray-400">({addon.qty})</span></span>
                    <span className="font-semibold text-gray-700">₹{addon.price * addon.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(selectedDate || selectedTime) && (
            <div>
              <p className="text-xs font-bold text-red-700 tracking-wide uppercase mb-1">Date & Time</p>
              <div className="text-[11px] bg-gray-50/80 rounded-xl p-2.5 space-y-0.5 font-medium border text-gray-600">
                {selectedDate && <p className="flex items-center gap-1">📅 From {selectedDate}</p>}
                {selectedTime && <p className="flex items-center gap-1">⏰ Slot: {selectedTime}</p>}
              </div>
            </div>
          )}

          <div className="border-t border-dashed border-pink-200 mt-4 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-800 text-sm">Subtotal</span>
            <span className="font-black text-gray-900 text-base">₹{calculatedSubtotal}</span>
          </div>
        </>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Select Meals</h2>
            <p className="text-xs text-gray-500 mb-6">Choose the meals you want to include in your plan.</p>

            <div className="space-y-3">
              {mealPlans.map((meal) => {
                const isSelected = selectedMeal?.id === meal.id;
                return (
                  <div
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal)}
                    className={`cursor-pointer rounded-2xl p-3.5 border transition-all flex items-center justify-between
                    ${isSelected ? "border-red-500 bg-red-50/20 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img src={meal.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">{meal.name}</h3>
                        <p className="text-xs text-red-600 font-semibold mt-0.5">₹120 / meal</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                      ${isSelected ? "border-red-600 bg-red-600 text-white text-[10px]" : "border-gray-300 bg-white"}`}>
                      {isSelected && "✓"}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );

      case 1:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Select Categories</h2>
            <p className="text-xs text-gray-500 mb-6">Choose your preferred food categories.</p>

            <div className="space-y-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all
                    ${isSelected ? "border-red-500 bg-red-50/20" : "border-gray-100 bg-white hover:border-gray-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="accent-red-600 h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-xs font-bold text-gray-700">{cat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Select Items</h2>
            <p className="text-xs text-gray-500 mb-6">Choose the items you want in your meal.</p>

            <div className="space-y-2.5">
              {items.map((item) => {
                const active = selectedItems.includes(item.name);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.name)}
                    className={`cursor-pointer p-3.5 rounded-xl border flex justify-between items-center transition-all
                    ${active ? "border-red-500 bg-red-50/20" : "border-gray-100 bg-white"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={active}
                        readOnly
                        className="accent-red-600 h-4 w-4 rounded border-gray-300"
                      />
                      <h3 className="font-semibold text-xs text-gray-700">{item.name}</h3>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">₹{item.price || 40}</span>
                  </div>
                );
              })}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Add Ons</h2>
            <p className="text-xs text-gray-500 mb-6">Add-ons to make your meals even better!</p>

            <div className="space-y-3">
              {addons.map((addon) => {
                const selected = selectedAddons.find((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    className={`rounded-xl border p-3 flex justify-between items-center transition-all
                    ${selected ? "border-red-500 bg-red-50/10" : "border-gray-100 bg-white"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => toggleAddon(addon)}
                        className="accent-red-600 h-4 w-4 rounded border-gray-300"
                      />
                      <div>
                        <h3 className="font-semibold text-xs text-gray-700">{addon.name}</h3>
                        <p className="text-[11px] text-gray-400 font-medium">₹{addon.price}</p>
                      </div>
                    </div>

                    {selected && (
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-inner">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQty(addon.id, "minus"); }}
                          className="px-2 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-700 min-w-[24px] text-center">
                          {selected.qty}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQty(addon.id, "plus"); }}
                          className="px-2 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Select Date</h2>
            <p className="text-xs text-gray-500 mb-6">Choose the date from which you want to start your meals.</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-2">Select Start Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-2.5">Meal Time</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Lunch", "Dinner"].map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <div
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`cursor-pointer p-3 rounded-xl border text-center text-xs font-bold transition-all
                        ${isSelected ? "border-red-500 bg-red-50/30 text-red-600" : "border-gray-200 bg-white text-gray-600"}`}
                      >
                        {slot}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Preview Your Order</h2>
            <p className="text-xs text-gray-500 mb-6">Review your plan details and confirm your order.</p>

            <div className="bg-gray-50/60 rounded-2xl p-4 border border-gray-100 space-y-4 text-xs font-medium text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Meals</span>
                <span className="font-bold text-gray-800">{selectedMeal?.name || "None"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Categories</span>
                <span className="font-bold text-emerald-600">{selectedCategory || "None"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Slot & Date</span>
                <span className="font-bold text-gray-800">{selectedDate} ({selectedTime})</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-800 font-bold">Total Price</span>
                <span className="font-black text-red-600 text-sm">₹{calculatedSubtotal}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">📋</span>
              </div>
              <h4 className="font-bold text-sm text-gray-800">Almost done!</h4>
              <p className="text-[11px] text-gray-400 max-w-[20px] mx-auto mt-0.5">
                Please review your order and confirm to schedule your meals.
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcfc] p-4 sm:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-[1140px] grid lg:grid-cols-[240px_1fr_310px] gap-6 items-start">
        
        {/* Modern Sidebar Steps Selection Dashboard Lineage */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-pink-100/40 space-y-2">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300
                ${isCurrent ? "bg-red-50/40 text-red-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                  ${isCompleted ? "bg-red-600 text-white" : isCurrent ? "bg-red-600 text-white shadow-sm" : "bg-gray-100 text-gray-400"}`}
                >
                  {index + 1}
                </div>
                <span className={`text-[11px] font-bold tracking-wide uppercase ${isCurrent ? "text-red-700" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Central Workspace Container Card */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100/40 shadow-sm min-h-[460px] flex flex-col justify-between">
          <div>{renderStepContent()}</div>

          {/* Action Footer Navigation Controllers */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-5 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-0 transition-all"
            >
              ← Previous
            </button>

            {currentStep === 5 ? (
              <button
                onClick={() => alert("Meal Scheduled Successfully!")}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                ✓ Confirm Order
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
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Static Right Stick Preview Widget Module */}
        <aside className="bg-white rounded-2xl p-5 border border-pink-100/40 shadow-sm sticky top-6">
          <h3 className="font-bold text-xs tracking-wider uppercase text-red-700 mb-4 border-b border-pink-50 pb-2">
            Your Plan Preview
          </h3>
          {renderPreview()}
        </aside>

      </div>
    </div>
  );
};

export default MealSchedule;