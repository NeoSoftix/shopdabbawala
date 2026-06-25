import React from "react";
import MealSchedule from "../../components/User/MealSchedule";
import Header from "../../components/HeroHeader";
import StatCard from "../../components/Admin/StatsCards";
import Footer from "../../components/Footer";
import {
  FiCoffee,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
const stats = [
  {
    title: "Total Meals",
    value: "60",
    growth: "100%",
    Icon: FiCoffee,
  },
  {
    title: "Consumed",
    value: "24",
    growth: "40%",
    Icon: FiCheckCircle,
  },
  {
    title: "Remaining",
    value: "36",
    growth: "60%",
    Icon: FiClock,
  },
  {
    title: "Valid Till",
    value: "25 Jun",
    growth: "2026",
    Icon: FiCalendar,
  },
  {
    title: "Expires In",
    value: "91",
    growth: "Days",
    Icon: FiAlertCircle,
  },
];
const MealPlanner = () => {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Page */}
      <main className="min-h-screen  py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">


          {/* Plan Overview */}
          <div className="bg-white rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-gray-100 p-6 md:p-8 mb-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Subscription Plan
                </h2>

                <p className="text-gray-500 mt-2">
                  Track your meal usage and plan validity.
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4">
                <p className="text-sm text-gray-500">
                  Plan Status
                </p>

                <h3 className="text-xl font-bold text-green-600">
                  Active
                </h3>
              </div>
            </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
  {stats.map((stat, index) => (
    <StatCard
      key={index}
      title={stat.title}
      value={stat.value}
      growth={stat.growth}
      Icon={stat.Icon}
    />
  ))}
</div>
          </div>

          {/* Meal Scheduler */}
          <MealSchedule />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MealPlanner;