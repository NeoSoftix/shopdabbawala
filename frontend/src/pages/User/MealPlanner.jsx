import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMySubscriptions } from "../../services/subscription.service";
import { getMealSchedule, getDayStatuses, updateDayStatus } from "../../services/mealSchedule.service";

import Header from "../../components/User/HeroHeader";
import Footer from "../../components/shared/Footer";
import UserHistorydetails from "../../components/User/UserHistoryDetails";

import Sidebar from "./MealPlanner/Sidebar";
import PlanSummary from "./MealPlanner/PlanSummary";
import MealScheduleBuilder from "./MealPlanner/MealScheduleBuilder";
import PlanSelector from "./MealPlanner/PlanSelector";
import NoActivePlan from "./MealPlanner/NoActivePlan";

// ================= MAIN PARENT COMPONENT WITH WIZARD AS SIDEBAR =================
const MealPlanner = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const [activeStep, setActiveStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState("Tuesday");
  const [weeklyPlan, setWeeklyPlan] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [dayStatus, setDayStatus] = useState({});

  const refreshDayStatuses = async (subscriptionId) => {
    if (!subscriptionId) return;
    try {
      const res = await getDayStatuses(subscriptionId);
      if (res.success) setDayStatus(res.statusByDay || {});
    } catch (error) {
      console.error("Failed to load day statuses:", error?.response?.data || error);
    }
  };

  const handleToggleDayActive = async (day, active) => {
    if (!activeSubscription?._id) return;

    setDayStatus((prev) => ({
      ...prev,
      [day]: { ...prev[day], active },
    }));

    try {
      await updateDayStatus({ subscriptionId: activeSubscription._id, day, active });
    } catch (error) {
      console.error("Failed to update day status:", error?.response?.data || error);
      // revert optimistic update on failure
      setDayStatus((prev) => ({
        ...prev,
        [day]: { ...prev[day], active: !active },
      }));
    }
  };

  useEffect(() => {
    const fetchSavedMealPlan = async () => {
      if (!activeSubscription?._id) {
        return;
      }

      try {
        const res = await getMealSchedule(
          activeSubscription._id
        );

        console.log(
          "Saved Meal Schedule:",
          res
        );

        if (!res.success || !res.data) {
          return;
        }

        const initialPlan = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };

        res.data.schedule.forEach((daySchedule) => {
          if (!daySchedule?.day) {
            return;
          }

          initialPlan[daySchedule.day] =
            (daySchedule.items || [])
              .filter((meal) => meal?.item)
              .map((meal) => ({
                ...meal.item,
                quantity: meal.quantity || 1,
              }));
        });

        console.log(
          "Formatted Weekly Plan:",
          initialPlan
        );

        setWeeklyPlan(initialPlan);
      } catch (error) {
        console.error(
          "Failed to load saved meal plan:",
          error?.response?.data || error
        );
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

    fetchSavedMealPlan();
    fetchDayStatuses();
  }, [activeSubscription?._id]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

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
console.log(activeSubscription?.maxItemsPerMeal);

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
              <PlanSummary subscriptions={subscriptions} loading={loadingPlan} />
            </div>
          )}

          {activeStep === 2 && (
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

                <MealScheduleBuilder
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  weeklyPlan={weeklyPlan}
                  setWeeklyPlan={setWeeklyPlan}
                  mealSize={activeSubscription?.mealSize}
                  mealCount={activeSubscription?.maxItemsPerMeal}
                  subscriptionId={activeSubscription?._id}
                  dayStatus={dayStatus}
                  onToggleDayActive={handleToggleDayActive}
                  onDayConfirmed={() => refreshDayStatuses(activeSubscription?._id)}
                />
              </>
              )}
            </div>
          )}

          {activeStep === 3 && (
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] fade-in">
              {subscriptions.length === 0 && !loadingPlan ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    📦
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanner;
