import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroHeader from "../HeroHeader";

const menuItems = [
  {
    id: "thali1",
    name: "Protein Meal",
    description:
      "A high-protein meal packed with lean proteins, wholesome ingredients, and balanced nutrition, crafted to fuel your body while delivering great taste in every bite.",
    bg: "bg-[#9A3B54]",
    waveColor: "#802E44",
    textColor: "text-white",
    mainImage: "/TifinSlider/1.png",
    thumbImage: "/TifinSlider/1.png",
  },
  {
    id: "thali2",
    name: "SPECIAL TIFFIN",
    description:
      "Fresh and healthy home-style tiffin with a variety of delicious curries, breads, and perfect flavors crafted for your daily cravings.",
    bg: "bg-[#D28C28]",
    waveColor: "#B87820",
    textColor: "text-white",
    mainImage: "/TifinSlider/2.png",
    thumbImage: "/TifinSlider/2.png",
  },
  {
    id: "thali3",
    name: "Snack Meal",
    description:
      "Delicious bite-sized treats crafted with fresh ingredients and bold flavors, perfect for a quick snack, light craving, or anytime enjoyment.",
    bg: "bg-[#5D4037]",
    waveColor: "#4A332C",
    textColor: "text-[#F5F5DC]",
    mainImage: "/TifinSlider/3.png",
    thumbImage: "/TifinSlider/3.png",
  },
];

export default function TiffinRender() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = menuItems[activeIndex];
  const timerRef = useRef(null);

  const startSlider = () => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % menuItems.length);
    }, 3500); // Increased slightly for better reading pacing
  };

  useEffect(() => {
    startSlider();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleManualClick = (index) => {
    clearInterval(timerRef.current);
    setActiveIndex(index);
    startSlider();
  };

  return (
    <>
      <style>
        {`
          @keyframes float-effect {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(4deg); }
          }
          .animate-float {
            animation: float-effect 6s ease-in-out infinite;
          }
        `}
      </style>
      <HeroHeader />

      <div
        className={`relative min-h-screen w-full overflow-hidden transition-colors duration-700 ease-in-out ${activeItem.bg} font-sans select-none flex flex-col justify-between`}
      >
        {/* Background Wave - Morphs behavior depending on mobile vs desktop */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            className="w-full h-full object-cover opacity-40 md:opacity-100"
          >
            <path
              d="M0,0 L1000,0 L1000,250 C800,350 400,200 0,350 Z md:M0,0 L450,0 C500,100 550,200 500,300 C450,400 550,500 550,600 L0,600 Z"
              className="hidden md:block transition-colors duration-700 ease-in-out"
              fill={activeItem.waveColor}
            />
            <path
              d="M0,0 L1000,0 L1000,420 Q500,320 0,420 Z"
              className="block md:hidden transition-colors duration-700 ease-in-out"
              fill={activeItem.waveColor}
            />
          </svg>
        </div>

        {/* Main Content Layout Container */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pt-24 md:pt-0 flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-4">
          
          {/* Left Side Content Area */}
          <div className="flex flex-col justify-center text-center md:text-left order-2 md:order-1 max-w-xl mx-auto md:mx-0 pb-12 md:pb-0">
            <h1
              key={`title-${activeItem.id}`}
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-wide mb-4 md:mb-6 drop-shadow-md leading-tight uppercase ${activeItem.textColor}`}
            >
              {activeItem.name}
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-6 md:mb-10 opacity-90 max-w-md mx-auto md:mx-0 ${activeItem.textColor}`}
            >
              {activeItem.description}
            </p>

            {/* Thumbnails Container */}
            <div className="flex gap-3 sm:gap-4 items-center bg-black/10 p-2.5 sm:p-3 rounded-full w-max mx-auto md:mx-0 backdrop-blur-md shadow-inner">
              {menuItems.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleManualClick(index)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 sm:border-[3px] shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform focus:outline-none
                      ${isActive ? "border-white scale-110 ring-4 ring-white/30 bg-white/20" : "border-transparent scale-100 opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      src={item.thumbImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side Main Animated Container */}
          <div className="relative order-1 md:order-2 w-full flex items-center justify-center pointer-events-none h-[280px] sm:h-[380px] md:h-[75vh] lg:h-[85vh]">
            <div className="relative w-[75%] sm:w-[65%] md:w-[90%] aspect-square flex items-center justify-center animate-float">
              
              {/* Animated Presence Wrapper */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeItem.id}
                    // Initial entry point optimized dynamically for screens
                    initial={{ y: "20%", x: "80%", rotate: 20, opacity: 0 }}
                    animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                    exit={{ y: "80%", x: "40%", rotate: 35, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 16,
                      mass: 0.9,
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={activeItem.mainImage}
                      alt={activeItem.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] md:drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}