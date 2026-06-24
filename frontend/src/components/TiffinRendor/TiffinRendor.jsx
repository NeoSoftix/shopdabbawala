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
    imageClass: "scale-100 translate-x-0 translate-y-0",
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
    imageClass: "scale-100 translate-x-0 translate-y-0",
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
    imageClass: "scale-100 translate-x-0 translate-y-0",
  },
];

export default function TiffinRender() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = menuItems[activeIndex];
  const timerRef = useRef(null);

  // Function to start the automatic slider interval
  const startSlider = () => {
    // 1500ms (1.5 seconds) tak center mein hold karega phir change hoga
    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % menuItems.length);
    }, 2500); // 1000ms animation transition time + 1500ms center hold time = 2500ms
  };

  // Auto-play trigger on component load
  useEffect(() => {
    startSlider();
    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, []);

  // Handle manual thumbnail click
  const handleManualClick = (index) => {
    clearInterval(timerRef.current); // Pehle chal raha interval clear karo taaki lag na ho
    setActiveIndex(index); // Nayi thali set karo
    startSlider(); // Interval ko dobara restart karo
  };

  return (
    <>
      <style>
        {`
          @keyframes float-effect {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(10deg); }
          }
          .animate-float {
            animation: float-effect 5s ease-in-out infinite;
          }
        `}
      </style>
     <HeroHeader />
      <div
        className={`relative h-screen w-screen overflow-hidden transition-colors duration-700 ease-in-out ${activeItem.bg} font-sans select-none`}
      >
        
        {/* Background Wave */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,0 L450,0 C500,100 550,200 500,300 C450,400 550,500 550,600 L0,600 Z"
              fill={activeItem.waveColor}
              className="transition-colors duration-700 ease-in-out"
            />
          </svg>
        </div>

        {/* Left Side Content Area */}
        <div className="absolute top-1/2 left-12 md:left-24 -translate-y-1/2 z-10 max-w-xl md:max-w-2xl">
          <h1
            key={`title-${activeItem.id}`}
            className={`text-6xl md:text-8xl font-black tracking-wide mb-6 drop-shadow-lg leading-tight uppercase ${activeItem.textColor}`}
          >
            {activeItem.name}
          </h1>
          <p
            className={`text-lg md:text-xl font-medium leading-relaxed mb-10 opacity-90 ${activeItem.textColor}`}
          >
            {activeItem.description}
          </p>

          {/* Thumbnails */}
          <div className="flex gap-4 items-center bg-black/5 p-3 rounded-full w-max backdrop-blur-sm">
            {menuItems.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={item.id}
                  onClick={() => handleManualClick(index)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform focus:outline-none
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
        <div className="absolute top-0 right-0 h-full w-[50%] z-20 flex items-center justify-center pointer-events-none overflow-visible">
          <div className="relative w-[85%] max-w-[480px] md:max-w-[620px] lg:max-w-[700px] aspect-square flex items-center justify-center overflow-visible">
            {/* MAIN THALI PERFECT ANIMATION LAYER */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible top-[40px]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeItem.id}
                  // 1. INITIAL (Nayi Thali): Right side ke center se horizontal slide hokar aayegi
                  initial={{ y: "0%", x: "100%", rotate: 15, opacity: 0 }}
                  // 2. ANIMATE (Center Stay): Screen par standard center space par lock hogi
                  animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                  // 3. EXIT (Purani Thali): Bottom-Right side ki taraf slip hokar niche nikal jayegi
                  exit={{ y: "110%", x: "60%", rotate: 35, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 95,
                    damping: 15,
                    mass: 0.85,
                  }}
                  className={`w-full h-full transform origin-center z-10 ${activeItem.imageClass}`}
                >
                  <img
                    src={activeItem.mainImage}
                    alt={activeItem.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
