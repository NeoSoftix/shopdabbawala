import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";

const FOOD_DATA = [
  {
    id: 1,
    name: "Spicy Quinoa Avocado Bowl",
    price: "$35",
    description:
      "Protein-rich quinoa base topped with spicy chickpeas, freshly sliced avocados, and zesty lemon vinaigrette.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Mediterranean Caesar Salad",
    price: "$28",
    description:
      "Crisp romaine lettuce, crunchy croutons, and premium parmesan cheese, served with a creamy caesar twist.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Crunchy Sesame Tofu Bowl",
    price: "$30",
    description:
      "Crispy pan-seared tofu tossed in sesame seeds, served over fresh mixed greens and crunchy red cabbage.",
    image:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Green Goddess Chicken Salad",
    price: "$32",
    description:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Roasted Beet & Goat Cheese",
    price: "$26",
    description:
      "Earthy roasted beets perfectly paired with soft, tangy goat cheese and a drizzle of honey balsamic reduction.",
    image:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80",
  },
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
    <div className="relative w-full min-h-screen lg:h-screen bg-white overflow-hidden font-sans select-none flex flex-col justify-center py-12 lg:py-0">
      {/* Beige Background Shape Sweeping Top-Right */}
      <div
        className="absolute rounded-full pointer-events-none z-0 transition-all duration-700
                   w-[600px] h-[600px] -top-[220px] -right-[150px]
                   sm:w-[900px] sm:h-[900px] sm:-top-[300px] sm:-right-[200px]
                   lg:w-[1250px] lg:h-[1050px] lg:-top-[420px] lg:-right-[200px]"
        style={{
          backgroundColor: "#f3e4d8",
        }}
      />

      {/* Main Grid Framework Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center h-full">
        
        {/* Left Content Area */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-center text-center lg:text-left items-center lg:items-start space-y-6 z-10 order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-3 flex flex-col items-center lg:items-start"
            >
              <span className="block text-3xl sm:text-4xl font-bold text-[#000]">
                {currentItem.price}
              </span>
              <h1 className="text-3xl sm:text-[44px] font-bold text-gray-900 leading-[1.2] tracking-tight max-w-[400px]">
                {currentItem.name}
              </h1>
              <p className="text-gray-400 text-xs sm:text-[14px] leading-relaxed max-w-[380px] pt-2">
                {currentItem.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-full font-black text-sm uppercase text-white tracking-wider shadow-lg cursor-pointer transition-colors duration-500 shadow-black/10 flex items-center gap-4 bg-[#E7000B]"
            >
              <FaShoppingCart /> Shop Now
            </motion.button>
          </div>
        </div>

        {/* Right Arena */}
        <div className="col-span-1 lg:col-span-7 relative w-full flex items-center justify-center order-1 lg:order-2 min-h-[380px] sm:min-h-[500px] lg:h-full">
          {/* Responsive Scaling Container */}
          <div className="absolute top-[5%] sm:top-[12%] lg:top-[24%] left-1/2 lg:left-[45%] transform -translate-x-1/2 lg:translate-x-0 w-[500px] h-[500px] scale-[0.65] sm:scale-[0.85] lg:scale-100 origin-center lg:origin-top-left">
            
            {/* Dashed Semi-Circle SVG Arc */}
            <svg
              className="absolute inset-0 w-[600px] h-[600px] pointer-events-none z-0 transform -translate-x-12 -translate-y-12"
              viewBox="0 0 600 600"
            >
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
                    y: "-50%",
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div
                    className={`w-[66px] h-[66px] rounded-full overflow-hidden border-2 bg-white shadow-md transition-all ${
                      isActive ? "border-[#f4b004]" : "border-white"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Central Main Big Plate */}
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
                    <img
                      src={currentItem.image}
                      alt={currentItem.name}
                      className="w-full h-full object-cover rounded-full"
                    />
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-orange-400/80 transform rotate-90 lg:rotate-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
              </button>
            </div>

            {/* Right Controller Arrow */}
            <div className="absolute top-[66%] left-[98%] z-40">
              <button
                onClick={handleNext}
                className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-orange-400/80 transform rotate-90 lg:rotate-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}