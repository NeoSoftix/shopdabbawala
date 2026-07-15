import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAvailableItemsForDate } from "../../../services/weeklyMenu.service";
import { createMeal } from "../../../services/mealSchedule.service";

import DayOfWeekPicker from "./DayOfWeekPicker";
import DayAddOns from "./DayAddOns";
import { formatDateKey, isPastDate } from "./constants";

// ================= COMPONENT: CUSTOM MEAL PLAN BUILDER =================
const MealScheduleBuilder = ({
  selectedDate,
  setSelectedDate,
  weeklyPlan,
  setWeeklyPlan,
  subscriptionId,
  category,
  dayStatus,
  onToggleDayActive,
  onDayConfirmed,
  dayAddOns,
  availableDates,
}) => {
  const [sections, setSections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const categoryId = category?._id || category;
  const selectedDateKey = formatDateKey(selectedDate);
  const isDateAvailable = availableDates.includes(selectedDateKey);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      if (!categoryId || !selectedDateKey || !isDateAvailable) {
        setSections([]);
        setLoadingData(false);
        return;
      }
      try {
        const res = await getAvailableItemsForDate(categoryId, selectedDateKey);
        if (res.success) {
          setSections(res.data || []);
        } else {
          setSections([]);
        }
      } catch (err) {
        console.error("Failed to fetch available items:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [categoryId, selectedDateKey, isDateAvailable]);

  const currentDayItems = weeklyPlan[selectedDateKey] || [];
  
  // Calculate selection counts per section
  const sectionCounts = sections.reduce((acc, section) => {
    const sectionItemIds = section.items.map(i => i._id);
    const count = currentDayItems.reduce((total, meal) => {
      if (sectionItemIds.includes(meal._id)) {
        return total + (meal.quantity || 1);
      }
      return total;
    }, 0);
    acc[section._id] = count;
    return acc;
  }, {});

  const handleItemToggle = (item, sectionId, requiredQuantity) => {
    const currentCount = sectionCounts[sectionId] || 0;
    const isSelected = currentDayItems.some((meal) => meal._id === item._id);

    setWeeklyPlan((prev) => {
      const prevItems = prev[selectedDateKey] || [];
      if (isSelected) {
        // Remove item completely
        return {
          ...prev,
          [selectedDateKey]: prevItems.filter((meal) => meal._id !== item._id)
        };
      } else {
        // Add item (if limit not reached)
        if (currentCount >= requiredQuantity) {
          toast.error(`You can only select exactly ${requiredQuantity} items from this section.`);
          return prev;
        }
        return {
          ...prev,
          [selectedDateKey]: [...prevItems, { ...item, quantity: 1 }]
        };
      }
    });
  };

  const currentDayStatus = dayStatus[selectedDateKey]?.status || "unknown";
  const isConfirmed = currentDayStatus === "confirmed" || currentDayStatus === "delivered";
  const isActive = dayStatus[selectedDateKey]?.active ?? true;
  const isPast = isPastDate(selectedDate);
  // Past days are read-only history - no editing, regardless of status.
  const isLocked = isConfirmed || isPast;

  const isScheduleValid = () => {
    for (const section of sections) {
      if ((sectionCounts[section._id] || 0) !== section.requiredQuantity) {
        return false;
      }
    }
    return sections.length > 0;
  };

  const handleConfirmDay = async () => {
    if (!subscriptionId || !categoryId) return;

    if (!isScheduleValid()) {
      toast.error("Please complete your selections for all sections.");
      return;
    }

    setSubmitting(true);
    try {
      const formattedItems = currentDayItems.map((meal) => ({
        item: meal._id,
        quantity: meal.quantity || 1,
      }));

      const res = await createMeal({
        subscriptionId,
        date: selectedDateKey,
        category: categoryId,
        items: formattedItems,
      });

      if (res.success) {
        toast.success(`Meals saved for ${selectedDate.toDateString()}`);
        if (onDayConfirmed) onDayConfirmed();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save meals");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDayStatus = () => {
    if (onToggleDayActive) {
      onToggleDayActive(selectedDateKey, !isActive);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 mt-6">
      {/* LEFT COLUMN: Date Picker & Builder */}
      <div className="flex-1 space-y-6">
        
        {/* DAY SELECTOR */}
        <DayOfWeekPicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          dayStatus={dayStatus}
          availableDates={availableDates}
        />

        <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Menu for {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h2>
              {isConfirmed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Confirmed & Locked
                </span>
              ) : isPast ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold mt-2">
                  Past date — read only
                </span>
              ) : (
                <p className="text-gray-500 text-sm mt-1">
                  Select your preferred items for this day.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
              <span className="text-sm font-bold text-gray-700 pl-2">Delivery Status:</span>
              <button
                onClick={toggleDayStatus}
                disabled={isLocked}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={`text-sm font-bold pr-2 ${isActive ? "text-green-600" : "text-gray-500"}`}>
                {isActive ? "Active" : "Paused"}
              </span>
            </div>
          </div>

          {!isDateAvailable ? (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Menu Available</h3>
              <p className="text-gray-500 text-sm">The kitchen hasn't prepared a menu for this date yet.</p>
            </div>
          ) : !isActive ? (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delivery Paused</h3>
              <p className="text-gray-500 text-sm mb-4">You have paused your delivery for this day.</p>
              <button onClick={toggleDayStatus} className="text-[#e61e2d] font-bold text-sm hover:underline">
                Resume Delivery
              </button>
            </div>
          ) : loadingData ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#e61e2d] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.length === 0 ? (
                 <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <h3 className="text-lg font-bold text-gray-900 mb-2">No Items Found</h3>
                   <p className="text-gray-500 text-sm">There are no items configured for this date.</p>
                 </div>
              ) : (
                sections.map((section, idx) => {
                  const required = section.requiredQuantity || 1;
                  const selected = sectionCounts[section._id] || 0;
                  const isComplete = selected === required;

                  return (
                    <div key={section._id} className="relative">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-[#e61e2d]">
                              {idx + 1}
                            </span>
                            {section.label}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Select exactly <span className="font-bold text-gray-700">{required}</span> items from this section.
                          </p>
                        </div>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${isComplete ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {selected} / {required} Selected
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.items.map((item) => {
                          const isSelected = currentDayItems.some(meal => meal._id === item._id);
                          const isDisabled = !isSelected && selected >= required && !isLocked;

                          return (
                            <button
                              key={item._id}
                              onClick={() => !isLocked && handleItemToggle(item, section._id, required)}
                              disabled={isDisabled || isLocked}
                              className={`
                                flex items-center p-3 rounded-xl border text-left transition-all duration-200
                                ${isSelected
                                  ? "border-[#e61e2d] bg-red-50 ring-1 ring-[#e61e2d] ring-opacity-50"
                                  : "border-gray-200 bg-white hover:border-gray-300"}
                                ${isDisabled || isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}
                              `}
                            >
                              <div className={`
                                w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-colors
                                ${isSelected ? "bg-[#e61e2d] border-[#e61e2d]" : "border-gray-300 bg-white"}
                              `}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={`font-semibold text-sm ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                                {item.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}

              {/* SAVE BUTTON */}
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleConfirmDay}
                  disabled={submitting || isLocked || sections.length === 0 || !isScheduleValid()}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-[#e61e2d] hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isConfirmed ? "Confirmed" : isPast ? "Past Date" : "Confirm Day"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Add Ons */}
      <div className="w-full xl:w-96 flex-shrink-0">
        <DayAddOns
          selectedDate={selectedDate}
          selectedDateKey={selectedDateKey}
          subscriptionId={subscriptionId}
          hasScheduledMeal={currentDayItems.length > 0}
          savedDayAddons={dayAddOns[selectedDateKey]}
        />
      </div>
    </div>
  );
};

export default MealScheduleBuilder;
