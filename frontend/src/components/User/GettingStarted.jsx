import React from "react";
import {
  LuPackageCheck,
  LuClipboardList,
  LuTruck,
  LuSmile,
} from "react-icons/lu";
import { FaPlusCircle } from "react-icons/fa";

const steps = [
  {
    icon: LuPackageCheck,
    title: "Choose Package",
    desc: "Select the perfect meal package that suits your needs and preferences.",
  },
   {
    icon: LuClipboardList,
    title: "Place Order",
    desc: "Review your selection and place your order securely with just a few clicks.",
  },
   {
    icon: FaPlusCircle,
    title: "Customize Meal",
    desc: "Personalize your meal by choosing your preferred dishes, ingredients and add-ons.",
  },
  {
    icon: LuTruck,
    title: "We Deliver",
    desc: "Our team prepares your meal fresh and delivers it to your doorstep on time.",
  },
  {
    icon: LuSmile,
    title: "Enjoy Meal",
    desc: "Savor your delicious, healthy and hygienic meal and enjoy!",
  },
];

export default function GettingStarted() {
  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 bg-[#FAFAFA] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ================= HEADING HEADER BLOCK ================= */}
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 text-red-600 text-xl font-bold mb-1">
            <span className="text-slate-300">─</span> 
            <span className="text-xl">🍳</span> 
            <span className="text-slate-300">─</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How It <span className="text-[#E23747]">Works</span>
          </h2>

          <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">
            Simple steps to your delicious meals
          </p>

          <div className="flex items-center gap-1 mt-4">
            <div className="w-8 h-[2px] bg-red-500 rounded-full" />
            <div className="w-1.5 h-[2px] bg-red-500 rounded-full" />
            <div className="w-8 h-[2px] bg-red-500 rounded-full" />
          </div>
        </div>

        {/* ================= TIMELINE GRID STRUCTURE ================= */}
        <div className="w-full relative mt-16">
          
          {/* EXACT IMAGE STYLE CONNECTING LINE:
            यह पूरी रो (Row) के आर-पार जाएगी और नंबर बैज (Top-5) के ठीक बीच से होकर गुजरेगी।
          */}
          <div className="hidden xl:block absolute top-[18px] left-[10%] right-[10%] pointer-events-none z-0">
            <div className="flex justify-between items-center w-full">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center flex-1 justify-center relative">
                  <div className="w-full border-t-[2px] border-dashed border-red-200 mx-4" />
                  <span className="absolute right-0 text-red-400 text-[10px] -translate-y-[1px]">▶</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Layout containing the cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-16 gap-x-6 xl:gap-x-5 w-full relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col items-center w-full">
                  
                  {/* CARD HOLDER WITH PADDING TOP FOR NUMBER FLOATER */}
                  <div className="relative flex flex-col items-center w-full pt-5">
                    
                    {/* Sequential Step Counter Badge (Sits perfectly on the line) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#BA0A1B] text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white z-20">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Main Elegant White Card Structure */}
                    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.015)] flex flex-col items-center text-center w-full min-h-[330px] justify-between transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
                      
                      {/* Circle Graphic Wrapper */}
                      <div className="w-24 h-24 rounded-full bg-[#FFF2F3] flex items-center justify-center text-red-500 mt-2">
                        <div className="w-[84px] h-[84px] rounded-full bg-white shadow-sm flex items-center justify-center">
                          <IconComponent className="w-9 h-9 text-[#E23747]" />
                        </div>
                      </div>

                      {/* Content Info Elements */}
                      <div className="flex-1 flex flex-col justify-center my-4">
                        <h3 className="text-[17px] font-bold text-[#E23747] tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-slate-500 text-xs md:text-[12.5px] font-medium leading-relaxed max-w-[190px] mx-auto">
                          {step.desc}
                        </p>
                      </div>

                      {/* Bottom Accent Rectangle Dash */}
                      <div className="w-7 h-[3px] bg-red-500 rounded-full mt-1" />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Decorative Red Wave SVG Wave */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none translate-y-2">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,60 C320,100 640,100 960,60 C1120,40 1280,20 1440,45 L1440,100 L0,100 Z" fill="#E23747"/>
        </svg>
      </div>
    </section>
  );
}