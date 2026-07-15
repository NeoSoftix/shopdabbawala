import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMySubscriptions } from "../../services/subscription.service";
import { getMealSchedule, getDayStatuses, updateDayStatus, getDayAddonsSummary } from "../../services/mealSchedule.service";
import { saveCheckoutDetails } from "../../services/payment.service";
import { getAvailableMenuDates } from "../../services/weeklyMenu.service";
import { getActiveCategory } from "../../services/category.service";
import { formatDateKey, isBeyondSubscription } from "./MealPlanner/constants";

import Header from "../../components/User/HeroHeader";
import Footer from "../../components/shared/Footer";
import UserHistorydetails from "../../components/User/UserHistoryDetails";

import Sidebar from "./MealPlanner/Sidebar";
import MealScheduleBuilder from "./MealPlanner/MealScheduleBuilder";
import MySchedule from "./MealPlanner/MySchedule";
import PlanSelector from "./MealPlanner/PlanSelector";
import CategorySelector from "./MealPlanner/CategorySelector";
import NoActivePlan from "./MealPlanner/NoActivePlan";

// Default selection: today if it falls within the plan's window, otherwise
// the nearest valid date (the plan's start if it hasn't started yet, or its
// last day if it already ended).
const getDefaultSelectedDate = (subscription) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!subscription?.startDate || !subscription?.endDate) return today;

  const start = new Date(subscription.startDate);
  start.setHours(0, 0, 0, 0);

  if (today < start) return start;
  if (isBeyondSubscription(today, subscription)) return new Date(subscription.endDate);
  return today;
};

// ================= MAIN PARENT COMPONENT WITH WIZARD AS SIDEBAR =================
const MealPlanner = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [activeStep, setActiveStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(() => getDefaultSelectedDate(null));
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [dayStatus, setDayStatus] = useState({});
  const [dayAddOns, setDayAddOns] = useState({});
  const [availableDates, setAvailableDates] = useState([]);

  const refreshDayStatuses = async (subscriptionId) => {
    if (!subscriptionId) return;
    try {
      const res = await getDayStatuses(subscriptionId);
      if (res.success) setDayStatus(res.statusByDay || {});
    } catch (error) {
      console.error("Failed to load day statuses:", error?.response?.data || error);
    }
  };

  const refreshDayAddOns = async (subscriptionId) => {
    if (!subscriptionId) return;
    try {
      const res = await getDayAddonsSummary(subscriptionId);
      if (res.success) setDayAddOns(res.addonsByDay || {});
    } catch (error) {
      console.error("Failed to load day add-ons:", error?.response?.data || error);
    }
  };

  const handleToggleDayActive = async (dateKey, active) => {
    if (!activeSubscription?._id) return;

    setDayStatus((prev) => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], active },
    }));

    try {
      await updateDayStatus({ subscriptionId: activeSubscription._id, date: dateKey, active });
    } catch (error) {
      console.error("Failed to update day status:", error?.response?.data || error);
      // revert optimistic update on failure
      setDayStatus((prev) => ({
        ...prev,
        [dateKey]: { ...prev[dateKey], active: !active },
      }));
    }
  };

  // Every active category is available to every plan (packages don't
  // restrict which categories a subscriber can order from) - fetched once
  // and offered via the category selector regardless of the active plan.
  useEffect(() => {
    getActiveCategory()
      .then((res) => {
        if (res?.success) setCategories(res.data || []);
      })
      .catch((error) => console.error("Failed to load categories:", error));
  }, []);

  useEffect(() => {
    setSelectedDate(getDefaultSelectedDate(activeSubscription));
  }, [activeSubscription?._id]);

  // Default to the first category whenever the list loads (and none is
  // selected yet) - the subscriber can then pick a different one.
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    const fetchSavedMealPlan = async () => {
      if (!activeSubscription?._id) return;
      try {
        const res = await getMealSchedule(activeSubscription._id);
        if (!res.success || !res.data) return;

        const initialPlan = {};
        (res.data.schedule || []).forEach((daySchedule) => {
          if (!daySchedule.date) return;

          initialPlan[formatDateKey(daySchedule.date)] =
            (daySchedule.items || [])
              .filter((meal) => meal?.item)
              .map((meal) => ({
                ...meal.item,
                quantity: meal.quantity || 1,
              }));
        });

        setWeeklyPlan(initialPlan);
      } catch (error) {
        console.error("Failed to load saved meal plan:", error?.response?.data || error);
      }
    };

    const fetchDayStatuses = async () => {
      if (!activeSubscription?._id) return;
      try {
        const res = await getDayStatuses(activeSubscription._id);
        if (res.success) setDayStatus(res.statusByDay || {});
      } catch (error) {
        console.error("Failed to load day statuses:", error?.response?.data || error);
      }
    };

    const fetchAvailableDates = async () => {
      const categoryId = selectedCategory?._id || selectedCategory;
      if (!categoryId) return;
      try {
        // Every date the admin has published a menu for, across all weeks
        // (not just the current one) and including past/confirmed dates -
        // filtering to what's actually selectable happens in the UI.
        const res = await getAvailableMenuDates(categoryId);
        if (res.success) {
          const formattedDates = (res.availableDates || [])
            .map((d) => d.split("T")[0])
            .filter((d) => {
              const [y, m, dayNum] = d.split("-").map(Number);
              const dateObj = new Date(y, m - 1, dayNum);
              return !isBeyondSubscription(dateObj, activeSubscription);
            });
          setAvailableDates(formattedDates);
        }
      } catch (error) {
        console.error("Failed to load available dates:", error);
      }
    };

    fetchSavedMealPlan();
    fetchDayStatuses();
    fetchAvailableDates();
    refreshDayAddOns(activeSubscription?._id);
  }, [activeSubscription?._id, selectedCategory]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Returning from a day-addon Stripe checkout - finalize the purchase
  // (fallback in case the webhook hasn't landed yet, same pattern used for
  // package/subscription checkouts), refresh the add-ons for the day it was
  // bought for, and strip the query params so a page refresh doesn't
  // re-trigger this.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const addonPayment = params.get("addon_payment");
    const sessionId = params.get("session_id");

    if (addonPayment === "success" && sessionId && user) {
      saveCheckoutDetails({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        sessionId,
      })
        .then(() => {
          toast.success("Add-ons purchased successfully!");
          refreshDayAddOns(activeSubscription?._id);
        })
        .catch((error) => {
          console.error("Failed to finalize add-on payment:", error?.response?.data || error);
          toast.error("Payment succeeded, but we couldn't confirm your add-ons. They'll appear shortly.");
        })
        .finally(() => {
          navigate(location.pathname, { replace: true });
        });
    } else if (addonPayment === "cancelled") {
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, user, activeSubscription?._id]);

  useEffect(() => {
    if (user) {
      getMySubscriptions()
        .then((res) => {
          if (res.success && res.subscriptions?.length > 0) {
            setSubscriptions(res.subscriptions);
            // Find active subscription or use the latest one
            const active = res.subscriptions.find(sub => sub.status === "active") || res.subscriptions[0];
            setActiveSubscription(active);
          }
        })
        .catch((err) => console.error("Failed to fetch subscriptions:", err))
        .finally(() => setLoadingPlan(false));
    } else if (!loading) {
      setLoadingPlan(false);
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans antialiased flex flex-col">
      <Header />

      {/* ================= MAIN CONTENT LAYOUT ================= */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start pt-24 md:pt-28 pb-12">
        {/* ================= LEFT SIDEBAR ================= */}
        <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} />

        {/* ================= RIGHT MAIN AREA (DYNAMIC CONTENT) ================= */}
        <section className="lg:col-span-9 w-full">
          {activeStep === 1 && (
            <div className="fade-in">
              {subscriptions.length === 0 && !loadingPlan ? (
                <NoActivePlan
                  description="You need an active meal subscription to build a custom schedule. Please purchase a plan to unlock this feature."
                  noteText="Meal scheduling and customization are locked until you activate a plan."
                />
              ) : (
              <>
                <PlanSelector
                  subscriptions={subscriptions}
                  activeSubscription={activeSubscription}
                  onChange={setActiveSubscription}
                />
                <CategorySelector
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onChange={setSelectedCategory}
                />
                <MealScheduleBuilder
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  weeklyPlan={weeklyPlan}
                  setWeeklyPlan={setWeeklyPlan}
                  category={selectedCategory}
                  availableDates={availableDates}
                  subscriptionId={activeSubscription?._id}
                  dayStatus={dayStatus}
                  onToggleDayActive={handleToggleDayActive}
                  onDayConfirmed={() => refreshDayStatuses(activeSubscription?._id)}
                  dayAddOns={dayAddOns}
                />
              </>
              )}
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] fade-in">
              {subscriptions.length === 0 && !loadingPlan ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Delivery History</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Purchase a plan to start receiving deliveries and track your history here.
                  </p>
                </div>
              ) : (
                <UserHistorydetails subscriptions={subscriptions} />
              )}
            </div>
          )}

          {activeStep === 3 && (
            <div className="fade-in">
              {subscriptions.length === 0 && !loadingPlan ? (
                <NoActivePlan
                  description="You need an active meal subscription to have a meal schedule."
                  noteText="Your scheduled meals and their delivery status will appear here once you have an active plan."
                />
              ) : (
                <MySchedule
                  weeklyPlan={weeklyPlan}
                  dayStatus={dayStatus}
                  subscription={activeSubscription}
                />
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanner;
