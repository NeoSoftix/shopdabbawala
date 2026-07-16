import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Check } from "lucide-react";
import { getAvailableItemsForDate } from "../../../services/weeklyMenu.service";
import { createMeal } from "../../../services/mealSchedule.service";

import PlanSelector from "./PlanSelector";
import CategorySelector from "./CategorySelector";
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
  subscriptions,
  activeSubscription,
  onSubscriptionChange,
  categories,
  selectedCategory,
  onCategoryChange,
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
      {/* LEFT COLUMN: everything in one card */}
      <div className="flex-1 bg-white rounded-[24px] border border-gray-100 p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-5">
        {/* Top Row: Date left, Plan right */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="w-full lg:w-3/4">
            <DayOfWeekPicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              dayStatus={dayStatus}
              availableDates={availableDates}
            />
          </div>
          <div className="w-full lg:w-1/4">
            <PlanSelector
              subscriptions={subscriptions}
              activeSubscription={activeSubscription}
              onChange={onSubscriptionChange}
            />
          </div>
        </div>

        {/* Next Row: Categories */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={onCategoryChange}
        />

        {!isDateAvailable ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <h3 className="text-sm text-gray-900 mb-2">No Menu Available</h3>
            <p className="text-gray-500 text-xs">The kitchen hasn't prepared a menu for this date yet.</p>
          </div>
          
        ) : !isActive ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <h3 className="text-sm text-gray-900 mb-2">Delivery Paused</h3>
            <p className="text-gray-500 text-xs mb-4">You have paused your delivery for this day.</p>
            <button onClick={toggleDayStatus} className="text-[#e61e2d] text-xs hover:underline">
              Resume Delivery
            </button>
          </div>
        ) : loadingData ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#e61e2d] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sections.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <h3 className="text-sm text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-500 text-xs">There are no items configured for this date.</p>
          </div>
        ) : (
          <div>
            <div className="space-y-6">
              {sections.map((section, idx) => {
                const required = section.requiredQuantity || 1;
                const selected = sectionCounts[section._id] || 0;
                const isComplete = selected === required;
                const isSingleSelect = required === 1;

                return (
                  <div key={section._id} className="mb-8">
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex flex-wrap items-center gap-1.5">
                        <span>Step {idx + 2} — Choose {section.label}</span>
                        <span className="text-[10px] text-black font-medium normal-case tracking-normal">
                          (Select {section.label}, you can choose only {required} item{required > 1 ? 's' : ''} from this section.)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {section.items.map((item) => {
                        const isSelected = currentDayItems.some(meal => meal._id === item._id);
                        const isDisabled = !isSelected && selected >= required && !isLocked;

                        return (
                          <button
                            key={item._id}
                            onClick={() => !isLocked && handleItemToggle(item, section._id, required)}
                            disabled={isDisabled || isLocked}
                            className={`
                              flex items-center px-3 py-2 rounded-lg border text-left transition-all duration-200 bg-white w-fit
                              ${isSelected
                                ? "border-green-500 bg-green-50/30"
                                : "border-gray-200 bg-white hover:border-gray-300"}
                              ${isDisabled || isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}
                            `}
                          >
                            {isSingleSelect ? (
                              <span className={`
                                w-4 h-4 flex-shrink-0 rounded-full border-[1.5px] flex items-center justify-center mr-2.5 transition-colors
                                ${isSelected ? "border-green-500 bg-white" : "border-gray-300"}
                              `}>
                                {isSelected && <span className="w-2 h-2 rounded-full bg-green-500" />}
                              </span>
                            ) : (
                              <span className={`
                                w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center mr-2.5 transition-colors
                                ${isSelected ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"}
                              `}>
                                {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                              </span>
                            )}
                            <span className={`text-xs font-semibold ${isSelected ? "text-green-600" : "text-[#1B254B]"}`}>
                              {item.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SAVE BUTTON / SAVED STATE */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center gap-4">
              {isConfirmed ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#22C55E] shrink-0 tracking-wide">
                    <Check size={16} strokeWidth={4} />
                    Saved for {selectedDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}!
                  </span>
                  <span className="text-sm font-medium text-[#22C55E]">Your meal has been confirmed.</span>
                </>
              ) : (
                <button
                  onClick={handleConfirmDay}
                  disabled={submitting || isLocked || sections.length === 0 || !isScheduleValid()}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#E31A1A] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 tracking-wide"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isPast ? "PAST DATE" : "SAVE MEALS"}
                </button>
              )}
            </div>
          </div>
        )}
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
