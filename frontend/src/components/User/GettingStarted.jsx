import React from "react";
import {
  LuPackageCheck,
  LuClipboardList,
  LuTruck,
  LuSmile,
} from "react-icons/lu";
import { FaPlusCircle } from "react-icons/fa"

const steps = [
  {
    icon: LuPackageCheck,
    title: "Choose Package",
    desc: "Select your meals, duration & preferences",
  },
  {
    icon: FaPlusCircle, // New icon for Create Package
    title: "Create Package",
    desc: "Customize and build your perfect meal plan",
  },
  {
    icon: LuClipboardList,
    title: "Place Order",
    desc: "Confirm your package and complete checkout",
  },
  {
    icon: LuTruck,
    title: "We Deliver",
    desc: "Fresh homemade meals delivered daily",
  },
  {
    icon: LuSmile,
    title: "Enjoy Meals",
    desc: "Healthy, delicious meals right at your doorstep",
  },
];

export default function GettingStarted() {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden select-none">
      {/* Decorative Floating Images */}
      <img
        src="/images/tomato.png"
        alt=""
        className="absolute top-4 left-4 w-20 hidden lg:block pointer-events-none"
      />
      <img
        src="/images/chilli.png"
        alt=""
        className="absolute top-6 right-4 w-24 hidden lg:block pointer-events-none"
      />
      <img
        src="/images/leaf.png"
        alt=""
        className="absolute top-5 left-28 w-10 hidden lg:block pointer-events-none"
      />
      <img
        src="/images/food-bowl.png"
        alt=""
        className="absolute bottom-0 right-0 w-64 hidden xl:block pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10 relative">
        <div
          className="
            bg-white
            rounded-[40px]
            border
            border-red-100/70
            shadow-[0_20px_60px_rgba(226,55,71,0.08)]
            p-8
            md:p-12
            lg:p-16
          "
        >
          {/* ================= HEADING HEADER BLOCK ================= */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#E23747] uppercase tracking-tight">
              How It Works
            </h2>

            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-12 h-[2px] bg-red-500/30" />
              <span className="text-red-500 text-lg">🍽️</span>
              <div className="w-12 h-[2px] bg-red-500/30" />
            </div>

            <p className="text-gray-500 mt-4 text-base md:text-lg font-medium">
              Simple steps to enjoy healthy homemade meals
            </p>
          </div>

          {/* ================= TIMELINE DECK STRUCTURE ================= */}
          <div className="relative w-full">
            {/* Horizontal Dashed Connecting Line (Only for large monitors) */}
            <div
              className="
                hidden
                xl:block
                absolute
                top-16
                left-[10%]
                right-[10%]
                border-t-2
                border-dashed
                border-red-200
                pointer-events-none
                z-0
              "
            />

            {/* Responsive structure optimized for 5 items (switched to xl:grid-cols-5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-12 xl:gap-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className="relative z-10 flex flex-col items-center text-center group"
                  >
                    {/* Icon Base Stack Node */}
                    <div className="relative inline-flex items-center justify-center">
                      {/* Smooth Outer Pulsing Ring */}
                      <div className="absolute inset-0 scale-110 rounded-full border-[6px] border-red-50 bg-red-50/20 group-hover:scale-115 transition-transform duration-300 ease-out" />

                      {/* Main Dynamic Graphic Circle */}
                      <div
                        className="
                          relative
                          w-28
                          h-28
                          md:w-32
                          md:h-32
                          rounded-full
                          bg-gradient-to-br
                          from-red-500
                          to-red-600
                          flex
                          items-center
                          justify-center
                          text-white
                          shadow-[0_15px_45px_rgba(226,55,71,0.2)]
                          transition-transform
                          duration-300
                          group-hover:-translate-y-1
                        "
                      >
                        <IconComponent className="w-12 h-12 md:w-14 md:h-14 stroke-[1.8]" />
                      </div>

                      {/* Sequential Step Counter Badge */}
                      <div
                        className="
                          absolute
                          -bottom-2
                          left-1/2
                          -translate-x-1/2
                          w-10
                          h-10
                          rounded-full
                          bg-red-600
                          border-[3px]
                          border-white
                          flex
                          items-center
                          justify-center
                          text-white
                          font-black
                          text-sm
                          shadow-md
                        "
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Meta Card Content Data */}
                    <h3 className="mt-8 text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                      {step.title}
                    </h3>

                    <p className="mt-2.5 text-gray-500 max-w-[220px] mx-auto text-sm md:text-base font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}