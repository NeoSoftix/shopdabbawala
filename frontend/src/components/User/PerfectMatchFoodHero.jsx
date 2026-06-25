import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FOOD_DATA = [
  {
    id: 1,
    name: "Spicy Quinoa Avocado Bowl",
    price: "$35",
    description: "Protein-rich quinoa base topped with spicy chickpeas, freshly sliced avocados, and zesty lemon vinaigrette.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Mediterranean Caesar Salad",
    price: "$28",
    description: "Crisp romaine lettuce, crunchy croutons, and premium parmesan cheese, served with a creamy caesar twist.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Crunchy Sesame Tofu Bowl",
    price: "$30",
    description: "Crispy pan-seared tofu tossed in sesame seeds, served over fresh mixed greens and crunchy red cabbage.",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Green Goddess Chicken Salad",
    price: "$32",
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Roasted Beet & Goat Cheese",
    price: "$26",
    description: "Earthy roasted beets perfectly paired with soft, tangy goat cheese and a drizzle of honey balsamic reduction.",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80"
  }
];

export default function PerfectMatchFoodHero() {
  const [activeIndex, setActiveIndex] = useState(3); // Green Goddess Salad default

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FOOD_DATA.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FOOD_DATA.length) % FOOD_DATA.length);
  };

  const currentItem = FOOD_DATA[activeIndex];
  const radius = 250; 

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden font-sans select-none flex flex-col justify-center">
      
      {/* Beige Background Shape Sweeping Top-Right */}
      <div
        className="absolute rounded-full pointer-events-none z-0 transition-all duration-700"
        style={{
          width: "1250px",
          height: "1050px",
          backgroundColor: "#f3e4d8",
          top: "-420px",
          right: "-200px",
        }}
      />

      {/* Main Grid Framework Container (Without Header & Footer) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-12 grid grid-cols-12 items-center h-full">
        
        {/* Left Content Area */}
        <div className="col-span-5 flex flex-col justify-center space-y-6 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-3"
            >
              <span className="block text-4xl font-bold text-[#f4b004]">
                {currentItem.price}
              </span>
              <h1 className="text-[44px] font-bold text-gray-900 leading-[1.2] tracking-tight max-w-[400px]">
                {currentItem.name}
              </h1>
              <p className="text-gray-400 text-[14px] leading-relaxed max-w-[380px] pt-2">
                {currentItem.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#e09e03" }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#f4b004] text-white font-semibold rounded-full px-8 h-[52px] w-fit text-[15px] shadow-md shadow-amber-500/20 transition-all"
          >
            Add to Card
          </motion.button>
        </div>

        {/* Right Arena - Shifted upwards to partially hide behind the beige curve */}
        <div className="col-span-7 relative w-full h-full flex items-center justify-center">
          
          {/* Shifted Container Upwards from top-[42%] to top-[24%] */}
          <div className="absolute top-[24%] left-[45%] w-[500px] h-[500px]">
            
            {/* Dashed Semi-Circle SVG Arc */}
            <svg className="absolute inset-0 w-[600px] h-[600px] pointer-events-none z-0 transform -translate-x-12 -translate-y-12" viewBox="0 0 600 600">
              <path
                d="M 100,350 A 220,220 0 0,1 540,300"
                stroke="rgba(0,0,0,0.09)"
                strokeWidth="2"
                strokeDasharray="8 8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Thumbnails distributed along the Semi-Circle */}
            {FOOD_DATA.map((item, index) => {
              const total = FOOD_DATA.length;
              const relativeIndex = (index - activeIndex + total) % total;
              
              const angles = [210, 165, 120, 75, 30];
              const currentAngle = angles[relativeIndex] || 120;

              const radians = (currentAngle * Math.PI) / 180;
              const x = 270 + radius * Math.cos(radians);
              const y = 300 - radius * Math.sin(radians);

              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={item.id}
                  className="absolute z-20 cursor-pointer"
                  style={{ top: y, left: x }}
                  animate={{
                    scale: isActive ? 0.85 : 1,
                    opacity: isActive ? 0.5 : 1,
                    x: "-50%",
                    y: "-50%"
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`w-[66px] h-[66px] rounded-full overflow-hidden border-2 bg-white shadow-md transition-all ${isActive ? 'border-[#f4b004]' : 'border-white'}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                </motion.div>
              );
            })}

            {/* Down-sized Central Main Big Plate (Shifted up with the parent) */}
            <div className="absolute top-[68%] left-[58%] transform -translate-x-1/2 -translate-y-1/2 z-30">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 15 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                >
                  <div className="w-[310px] h-[310px] rounded-full overflow-hidden border-4 border-white bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                    <img src={currentItem.image} alt={currentItem.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left Controller Arrow */}
            <div className="absolute top-[66%] left-[10%] z-40">
              <button
                onClick={handlePrev}
                className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-orange-400/80">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </button>
            </div>

            {/* Right Controller Arrow */}
            <div className="absolute top-[66%] left-[98%] z-40">
              <button
                onClick={handleNext}
                className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-orange-400/80">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}