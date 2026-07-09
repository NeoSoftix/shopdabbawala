import { useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getActiveCategory } from "../../../services/category.service";
import { getAllItems } from "../../../services/items.service";
import { createMeal } from "../../../services/mealSchedule.service";

import CategoryFilter from "./CategoryFilter";
import ItemGrid from "./ItemGrid";
import DayOfWeekPicker from "./DayOfWeekPicker";
import DayPlanSlots from "./DayPlanSlots";
import WeeklyOverview from "./WeeklyOverview";

// ================= COMPONENT: CUSTOM MEAL PLAN BUILDER =================
const MealScheduleBuilder = ({
  selectedDay,
  setSelectedDay,
  weeklyPlan,
  setWeeklyPlan,
  mealSize,
  mealCount,
  subscriptionId,
  dayStatus,
  onToggleDayActive,
  onDayConfirmed,
}) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getActiveCategory(), getAllItems()])
      .then(([catsRes, itemsRes]) => {
        if (catsRes.success) {
          const cats = catsRes.data || [];
          setCategories(cats);
          if (cats.length > 0) setSelectedCategory(cats[0].name);
        }
        if (itemsRes.success) {
          setItems(itemsRes.data || []);
        }
      })
      .catch((err) => console.error("Failed to fetch custom meal data", err))
      .finally(() => setLoadingData(false));
  }, []);

  const filteredFoodItems = useMemo(() => {
    return items.filter(
      (item) => item && item.category?.name === selectedCategory,
    );
  }, [selectedCategory, items]);

  const toggleItemForDay = (item) => {
    if (!item) return;

    setWeeklyPlan((prev) => {
      const currentDayItems = prev[selectedDay] || [];

      const exists = currentDayItems.some(
        (meal) => meal?._id === item._id,
      );

      // ✅ Already selected -> remove complete product
      if (exists) {
        return {
          ...prev,
          [selectedDay]: currentDayItems.filter(
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

        [selectedDay]: [
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
    setWeeklyPlan((prev) => {
      const currentDayItems =
        prev[selectedDay] || [];

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

            [selectedDay]: [
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

          [selectedDay]: currentDayItems.map(
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

          [selectedDay]: currentDayItems.filter(
            (meal) => meal._id !== item._id,
          ),
        };
      }

      // Quantity decrease
      return {
        ...prev,

        [selectedDay]: currentDayItems.map(
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

  const removeOneItemFromDay = (day, itemId) => {
    setWeeklyPlan((prev) => {
      const dayItems = prev[day] || [];

      return {
        ...prev,

        [day]: dayItems
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

  // eslint-disable-next-line no-unused-vars
  const removeItemFromDay = (day, itemId) => {
    setWeeklyPlan((prev) => ({
      ...prev,

      [day]: (prev[day] || []).filter(
        (item) => item?._id !== itemId,
      ),
    }));
  };

  const planItems = {
    basic: 3,
    medium: 4,
    premium: 6,
  };
  console.log(mealSize)

  const totalSlots =
    mealCount || 0;
console.log(totalSlots);

  const currentDayMeals = weeklyPlan[selectedDay] || [];

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
      console.log("subscriptionId:", subscriptionId);
      return;
    }

    if (totalSelectedMeals === 0) {
      toast.error("Please select at least one meal before confirming.");
      return;
    }

    const selectedItems = currentDayMeals.map((meal) => ({
      item: meal._id,
      quantity: meal.quantity || 1,
    }));

    const payload = {
      subscriptionId,
      day: selectedDay,
      items: selectedItems,
    };

    console.log("Meal Payload:", payload);

    setSubmitting(true);

    try {
      const res = await createMeal(payload);

      console.log("Create Meal Response:", res);

      if (res?.success) {
        toast.success(`${selectedDay}'s meal plan confirmed!`);
        if (onDayConfirmed) onDayConfirmed();
      } else {
        toast.error(res?.message || "Failed to confirm meal plan.");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);
      console.error("ERROR RESPONSE:", error?.response);
      console.error("ERROR DATA:", error?.response?.data);

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
            setSelectedCategory={setSelectedCategory}
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
                PICK DELIVERY DAY
              </h3>
              <p className="text-xs font-medium text-[#A3AED0] mt-0.5">
                Choose your target day to get started
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-5 space-y-5 shadow-sm">
            <span className="text-xs font-bold text-[#1B254B] uppercase block tracking-wider">
              Select Delivery Day
            </span>

            <DayOfWeekPicker selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

            <DayPlanSlots
              selectedDay={selectedDay}
              totalSlots={totalSlots}
              totalSelectedMeals={totalSelectedMeals}
              expandedDayMeals={expandedDayMeals}
              onRemoveOne={removeOneItemFromDay}
              onSubmit={handleSubmitDay}
              submitting={submitting}
            />
          </div>
        </div>
      </div>

      {/* MATRIX WEEKLY VIEW */}
      <WeeklyOverview
        weeklyPlan={weeklyPlan}
        dayStatus={dayStatus}
        onToggleDayActive={onToggleDayActive}
        setSelectedDay={setSelectedDay}
      />
    </div>
  );
};

export default MealScheduleBuilder;
