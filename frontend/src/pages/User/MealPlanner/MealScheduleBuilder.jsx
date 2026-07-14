import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getActiveCategory } from "../../../services/category.service";
import { getAvailableItemsForDate } from "../../../services/weeklyMenu.service";
import { createMeal } from "../../../services/mealSchedule.service";

import CategoryFilter from "./CategoryFilter";
import ItemGrid from "./ItemGrid";
import DayOfWeekPicker from "./DayOfWeekPicker";
import DayPlanSlots from "./DayPlanSlots";
import WeeklyOverview from "./WeeklyOverview";
import { formatDateKey, isSelectableDate, longDate } from "./constants";

// ================= COMPONENT: CUSTOM MEAL PLAN BUILDER =================
const MealScheduleBuilder = ({
  selectedDate,
  setSelectedDate,
  weeklyPlan,
  setWeeklyPlan,
  mealSize,
  mealCount,
  subscription,
  subscriptionId,
  dayStatus,
  onToggleDayActive,
  onDayConfirmed,
}) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Category the user clicked while the current day already had meals
  // selected from a different category - awaiting Yes/No confirmation
  // before clearing that day and switching.
  const [pendingCategory, setPendingCategory] = useState(null);

  const selectedDateKey = formatDateKey(selectedDate);

  // Load the category list once.
  useEffect(() => {
    getActiveCategory()
      .then((res) => {
        if (res.success) setCategories(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch categories", err))
      .finally(() => setLoadingCategories(false));
  }, []);

  // Switching to a different day: follow whichever category that day's
  // meals already belong to (a single day/order can only ever contain one
  // category's items), or default to the first available category if that
  // day is still empty.
  useEffect(() => {
    const dayItems = weeklyPlan[selectedDateKey] || [];
    if (dayItems.length > 0 && dayItems[0]?.category) {
      const lockedCategoryId = dayItems[0].category?._id || dayItems[0].category;
      setSelectedCategory(lockedCategoryId);
    } else if (categories.length > 0) {
      setSelectedCategory((prev) => prev || categories[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateKey, categories]);

  const dayHasItems = (weeklyPlan[selectedDateKey] || []).length > 0;

  // A day can only ever contain one category's items. Switching category
  // while meals are already picked for this day needs confirmation, since
  // it discards those selections; switching on an empty day is immediate.
  const handleCategorySelect = (categoryId) => {
    if (categoryId === selectedCategory) return;
    if (dayHasItems) {
      setPendingCategory(categoryId);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const confirmCategorySwitch = () => {
    setWeeklyPlan((prev) => ({ ...prev, [selectedDateKey]: [] }));
    setSelectedCategory(pendingCategory);
    setPendingCategory(null);
  };

  const cancelCategorySwitch = () => setPendingCategory(null);

  const pendingCategoryName = categories.find((c) => c._id === pendingCategory)?.name;

  // Items available for the currently selected category *on this specific
  // date* - admin configures this per (category, date) from the Weekly Menu
  // page, so the picker only ever shows what's actually orderable today.
  useEffect(() => {
    if (!selectedCategory || !selectedDateKey) return;

    setLoadingData(true);
    getAvailableItemsForDate(selectedCategory, selectedDateKey)
      .then((res) => {
        if (res.success) setItems(res.data || []);
      })
      .catch((err) => console.error("Failed to fetch available items", err))
      .finally(() => setLoadingData(false));
  }, [selectedCategory, selectedDateKey]);

  const filteredFoodItems = items;

  const toggleItemForDay = (item) => {
    if (!item) return;

    if (editCutoffPassed) {
      toast.error("This order can no longer be edited — changes are only allowed until 12 PM the day before.");
      return;
    }

    setWeeklyPlan((prev) => {
      const currentDayItems = prev[selectedDateKey] || [];

      const exists = currentDayItems.some(
        (meal) => meal?._id === item._id,
      );

      // ✅ Already selected -> remove complete product
      if (exists) {
        return {
          ...prev,
          [selectedDateKey]: currentDayItems.filter(
            (meal) => meal?._id !== item._id,
          ),
        };
      }

      // Count total quantities
      const totalSelected = currentDayItems.reduce(
        (total, meal) =>
          total + (meal.quantity || 1),
        0,
      );

      // Plan limit check
      if (totalSelected >= totalSlots) {
        toast.error(
          `Maximum ${totalSlots} meals allowed in your ${mealSize} plan.`,
        );

        return prev;
      }

      // ✅ First click -> add quantity 1
      return {
        ...prev,

        [selectedDateKey]: [
          ...currentDayItems,
          {
            ...item,
            quantity: 1,
          },
        ],
      };
    });
  };

  const updateItemQuantity = (item, change) => {
    if (editCutoffPassed) {
      toast.error("This order can no longer be edited — changes are only allowed until 12 PM the day before.");
      return;
    }

    setWeeklyPlan((prev) => {
      const currentDayItems =
        prev[selectedDateKey] || [];

      const existingItem = currentDayItems.find(
        (meal) => meal?._id === item._id,
      );

      const totalSelected = currentDayItems.reduce(
        (total, meal) =>
          total + (meal.quantity || 1),
        0,
      );


      // ================= PLUS =================

      if (change === 1) {
        if (totalSelected >= totalSlots) {
          toast.error(
            `Maximum ${totalSlots} meals allowed in your ${mealSize} plan.`,
          );

          return prev;
        }

        // First time adding item
        if (!existingItem) {
          return {
            ...prev,

            [selectedDateKey]: [
              ...currentDayItems,
              {
                ...item,
                quantity: 1,
              },
            ],
          };
        }

        // Increase existing quantity
        return {
          ...prev,

          [selectedDateKey]: currentDayItems.map(
            (meal) =>
              meal._id === item._id
                ? {
                  ...meal,
                  quantity:
                    (meal.quantity || 1) + 1,
                }
                : meal,
          ),
        };
      }


      // ================= MINUS =================

      if (!existingItem) {
        return prev;
      }

      const currentQuantity =
        existingItem.quantity || 1;

      // Quantity 1 → remove item
      if (currentQuantity <= 1) {
        return {
          ...prev,

          [selectedDateKey]: currentDayItems.filter(
            (meal) => meal._id !== item._id,
          ),
        };
      }

      // Quantity decrease
      return {
        ...prev,

        [selectedDateKey]: currentDayItems.map(
          (meal) =>
            meal._id === item._id
              ? {
                ...meal,
                quantity: currentQuantity - 1,
              }
              : meal,
        ),
      };
    });
  };

  const removeOneItemFromDay = (dateKey, itemId) => {
    setWeeklyPlan((prev) => {
      const dayItems = prev[dateKey] || [];

      return {
        ...prev,

        [dateKey]: dayItems
          .map((item) => {
            if (item._id !== itemId) {
              return item;
            }

            const quantity = item.quantity || 1;

            if (quantity <= 1) {
              return null;
            }

            return {
              ...item,
              quantity: quantity - 1,
            };
          })
          .filter(Boolean),
      };
    });
  };

  const totalSlots =
    mealCount || 0;

  const currentDayMeals = weeklyPlan[selectedDateKey] || [];

  // Once an order has actually been placed for this date (dayStatus has an
  // entry for it), editing is only allowed up to 12 PM (noon) the day
  // before - mirrors the backend cutoff in createMealSchedule. A day with no
  // placed order yet is unaffected (first-time scheduling, any time within
  // the active week).
  const hasPlacedOrder = Boolean(dayStatus?.[selectedDateKey]);
  const editCutoffPassed = (() => {
    if (!hasPlacedOrder) return false;
    const cutoff = new Date(selectedDate);
    cutoff.setUTCHours(0, 0, 0, 0);
    cutoff.setUTCDate(cutoff.getUTCDate() - 1);
    cutoff.setUTCHours(12, 0, 0, 0);
    return new Date() > cutoff;
  })();

  const expandedDayMeals = currentDayMeals.flatMap((meal) =>
    Array.from(
      { length: meal.quantity || 1 },
      () => meal,
    ),
  );

  const totalSelectedMeals = expandedDayMeals.length;

  const handleSubmitDay = async () => {
    if (!subscriptionId) {
      toast.error("Subscription ID missing");
      return;
    }

    if (totalSelectedMeals === 0) {
      toast.error("Please select at least one meal before confirming.");
      return;
    }

    if (!isSelectableDate(selectedDate, subscription)) {
      toast.error("This date can't be scheduled — it's either in the past or outside your plan's validity.");
      return;
    }

    if (editCutoffPassed) {
      toast.error("This order can no longer be edited — changes are only allowed until 12 PM the day before.");
      return;
    }

    const selectedItems = currentDayMeals.map((meal) => ({
      item: meal._id,
      quantity: meal.quantity || 1,
    }));

    const payload = {
      subscriptionId,
      date: selectedDateKey,
      items: selectedItems,
    };

    setSubmitting(true);

    try {
      const res = await createMeal(payload);

      if (res?.success) {
        toast.success(`${longDate(selectedDate)}'s meal plan confirmed!`);
        if (onDayConfirmed) onDayConfirmed();
      } else {
        toast.error(res?.message || "Failed to confirm meal plan.");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to confirm meal plan."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white rounded-[32px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.015)] border border-gray-50">
      <div className="text-center py-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1B254B]">
          Build Your Custom Meal Plan in{" "}
          <span className="text-[#E31A1A]">2 Easy Steps</span>
        </h2>
        <p className="text-sm font-medium text-[#A3AED0] mt-1">
          Healthy meals, your way!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SECTION */}
        <div className="lg:col-span-7 space-y-5 min-w-0">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-white border-2 border-[#E31A1A] text-[#E31A1A] rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              1
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1B254B] tracking-wider uppercase">
                CHOOSE YOUR MEALS
              </h3>
              <p className="text-xs font-medium text-[#A3AED0] mt-0.5">
                Select your favorite meals and diet preference
              </p>
            </div>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategorySelect}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-130 overflow-y-auto no-scrollbar pr-1">
            <ItemGrid
              loadingData={loadingData}
              filteredFoodItems={filteredFoodItems}
              currentDayMeals={currentDayMeals}
              onToggleItem={toggleItemForDay}
              onUpdateQuantity={updateItemQuantity}
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 bg-white border-2 border-[#E31A1A] text-[#E31A1A] rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              2
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1B254B] tracking-wider uppercase">
                PICK DELIVERY DATE
              </h3>
              <p className="text-xs font-medium text-[#A3AED0] mt-0.5">
                Choose any date within your plan's validity
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-5 space-y-5 shadow-sm">
            <span className="text-xs font-bold text-[#1B254B] uppercase block tracking-wider">
              Select Delivery Date
            </span>

            <DayOfWeekPicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              subscription={subscription}
            />

            <DayPlanSlots
              selectedDay={longDate(selectedDate)}
              totalSlots={totalSlots}
              totalSelectedMeals={totalSelectedMeals}
              expandedDayMeals={expandedDayMeals}
              onRemoveOne={(_, itemId) => removeOneItemFromDay(selectedDateKey, itemId)}
              onSubmit={handleSubmitDay}
              submitting={submitting}
              editLocked={editCutoffPassed}
            />
          </div>
        </div>
      </div>

      {/* MATRIX WEEKLY VIEW */}
      <WeeklyOverview
        weeklyPlan={weeklyPlan}
        dayStatus={dayStatus}
        subscription={subscription}
        onToggleDayActive={onToggleDayActive}
        setSelectedDate={setSelectedDate}
      />

      {/* CATEGORY SWITCH CONFIRMATION */}
      {pendingCategory && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#1B254B]">Switch category?</h3>
            <p className="mt-2 text-sm text-[#5B6478]">
              Switching to <span className="font-semibold">{pendingCategoryName}</span> will remove
              the meals you've already selected for {longDate(selectedDate)}. Continue?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelCategorySwitch}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-[#1B254B] hover:bg-gray-50"
              >
                No, keep my meals
              </button>
              <button
                type="button"
                onClick={confirmCategorySwitch}
                className="rounded-xl bg-[#E31A1A] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, switch category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealScheduleBuilder;
