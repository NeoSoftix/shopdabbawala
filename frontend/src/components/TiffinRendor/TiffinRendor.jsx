import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa"

const menuItems = [
  {
    id: "thali1",
    name: "Protein Meal",
    description:
      "A high-protein meal packed with lean proteins, wholesome ingredients, and balanced nutrition, crafted to fuel your body while delivering great taste in every bite.",

    // Hex values instead of Tailwind for absolute smooth animation syncing
    bg: "#FDFBF9",
    waveColor: "#FCEBE1",
    textColor: "text-[#881111]",
    btnBg: "bg-[#881111]", // Added active theme colored buttons

    mainImage: "/TifinSlider/1.png",
    thumbImage: "/TifinSlider/1.png",
  },
  {
    id: "thali2",
    name: "VEGETARIAN THALI",
    description:
      "Fresh and healthy home-style tiffin with a variety of delicious curries, breads, and perfect flavors crafted for your daily cravings.",

    bg: "#FDFBF9",
    waveColor: "#FCEBE1",
    textColor: "text-[#636B2F]",
    btnBg: "bg-[#636B2F]",

    mainImage: "/TifinSlider/2.png",
    thumbImage: "/TifinSlider/2.png",
  },
  {
    id: "thali3",
    name: "NON-VEG THALI",
    description:
      "Delicious bite-sized treats crafted with fresh ingredients and bold flavors, perfect for a quick snack, light craving, or anytime enjoyment.",

    bg: "#FDFBF9",
    waveColor: "#FCEBE1",
    textColor: "text-[#915E02]",
    btnBg: "bg-[#915E02]",

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
    }, 3500);
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

  const scrollToPackages = () => {
    let scrolledSection = document.getElementById("plans")

    if(scrolledSection) {
      scrolledSection.scrollIntoView({
        behavior:"smooth",
        block:"start"
      })
    } 
  }

  return (
    <>
      <style>
        {`
          @keyframes float-effect {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
          .animate-float {
            animation: float-effect 6s ease-in-out infinite;
          }
        `}
      </style>

      {/* Main Wrapper Wrapper: framer-motion manages background color change instantly & smoothly */}
      <motion.div
        animate={{ backgroundColor: activeItem.bg }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative min-h-screen w-full overflow-hidden font-sans select-none flex flex-col justify-between"
      >
        {/* Background Waves */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            className="w-full h-full object-cover"
          >
            {/* Desktop View Layout Shapes */}
            <motion.path
              animate={{ fill: activeItem.waveColor }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              d="M 0,0 
                 L 640,0 
                 C 640,180 500,240 540,380 
                 C 580,520 620,540 510,680 
                 C 420,790 320,810 240,900 
                 L 0,900 Z 
                 M 1440,900 
                 L 1120,900 
                 C 1180,820 1200,740 1280,680 
                 C 1350,620 1390,620 1440,580 Z"
              className="hidden md:block"
            />

            {/* Mobile View Layout Shapes */}
            <motion.path
              animate={{ fill: activeItem.waveColor }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              d="M 0,0 
                 L 1440,0 
                 L 1440,520 
                 C 1100,560 900,440 680,560 
                 C 440,660 220,580 0,720 Z"
              className="block md:hidden"
            />
          </svg>
        </div>

        {/* Main Content Layout Container */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pt-20 md:pt-0 flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-4">
          {/* Main Animated Container (Upar Dikhega Mobile me) */}
          <div className="relative order-1 md:order-2 w-full flex items-center justify-center pointer-events-none h-[320px] sm:h-[400px] md:h-[75vh] lg:h-[85vh]">
            <div className="relative w-[85%] sm:w-[70%] md:w-[90%] aspect-square flex items-center justify-center animate-float">
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeItem.id}
                    // ENTRY: Right-Center se rotate ho kar aayegi
                    initial={{ y: 0, x: "100%", rotate: 45, opacity: 0 }}
                    // ANIMATE: Center me stable position
                    animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                    // EXIT: Bottom-Center ki taraf slide-out ho jayegi
                    exit={{ y: "100%", x: 0, rotate: -20, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 85,
                      damping: 15,
                      mass: 0.8,
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={activeItem.mainImage}
                      alt={activeItem.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] md:drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Content Area (Niche Ayega Mobile me) */}
          <div className="flex flex-col justify-center text-center md:text-left order-2 md:order-1 max-w-xl mx-auto md:mx-0 pb-12 md:pb-0 pl-0 md:pl-6 z-20">
            <h1
              key={`title-${activeItem.id}`}
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wide mb-3 md:mb-6 drop-shadow-md leading-tight uppercase transition-colors duration-500 ${activeItem.textColor}`}
            >
              {activeItem.name}
            </h1>
            <p
              className={`text-sm sm:text-base md:text-xl font-medium leading-relaxed mb-6 transition-colors duration-500 ${activeItem.textColor}`}
            >
              {activeItem.description}
            </p>

            {/* Premium Interactive Action Button Area */}
            <div className="mb-8 md:mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3.5 rounded-full font-black text-me uppercase tracking-wider text-white shadow-lg cursor-pointer transition-colors duration-500 ${activeItem.btnBg} shadow-black/10 flex gap-4`}
                onClick={scrollToPackages}

              >
               <FaShoppingCart className="mt-1"/> Shop Now
              </motion.button>
            </div>

            {/* Thumbnails Container */}
            <div className="flex gap-3 sm:gap-4 items-center p-2.5 sm:p-3 rounded-full w-max mx-auto md:mx-0 backdrop-blur-md shadow-inner bg-black/5">
              {menuItems.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleManualClick(index)}
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 sm:border-[3px] shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform focus:outline-none                       
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
        </div>
      </motion.div>
    </>
  );
}