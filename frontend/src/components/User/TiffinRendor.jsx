import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  {
    id: "thali1",
    name: "Protein Meal",
    description: "High-protein, home-style meals delivered with love, every day!",

    // Hex values instead of Tailwind for absolute smooth animation syncing
    bg: "#FDFBF9",
    waveColor: "#FCEBE1",
    textColor: "text-red-600",
    btnBg: "bg-red-600 hover:bg-red-700", // Matched to site theme red (red-600)

    mainImage: "/TifinSlider/1.png",
    thumbImage: "/TifinSlider/1.png",

    titleParts: [
      { text: "PROTEIN", color: "#DC2626" },
      { text: "THALI", color: "#D97706" },
    ],
    priceBox: {
      leftMeals: "8 MEALS",
      leftPrice: "$10",
      rightMeals: "12 MEALS",
      rightPrice: "$9",
      badge: "NOW ONLY",
      badgeColor: "#DC2626",
    },
  },
  {
    id: "thali2",
    name: "VEGETARIAN THALI",
    description:
      "Fresh home-style meals delivered with love, every day!",

    bg: "#FDFBF9",
    waveColor: "#FCEBE1",
    textColor: "text-[#636B2F]",
    btnBg: "bg-[#636B2F]",

    mainImage: "/TifinSlider/2.png",
    thumbImage: "/TifinSlider/2.png",

    // Extra content only the Vegetarian Thali slide uses - matches the
    // reference design exactly, other slides fall back to the plain layout.
    // tagline: "Delicious. Healthy. Affordable.",
    titleParts: [
      { text: "VEGETARIAN", color: "#636B2F" },
      { text: "THALI", color: "#C17A3E" },
    ],
    priceBox: {
      leftMeals: "8 MEALS",
      leftPrice: "$10",
      rightMeals: "12 MEALS",
      rightPrice: "$9",
      badge: "NOW ONLY",
    },
  },
  {
    id: "thali3",
    name: "NON-VEG THALI",
    description:
      "Fresh home-style non-veg meals delivered with love, every day!",

    bg: "#FDFBF9",
    waveColor: "#FCEBE1",
    textColor: "text-red-700",
    btnBg: "bg-red-700 hover:bg-red-800", // Matched to site theme red, darker shade to stay distinct from Protein slide

    mainImage: "/TifinSlider/3.png",
    thumbImage: "/TifinSlider/3.png",

    // Extra content only the Non-Veg Thali slide uses - matches the
    // reference design exactly, other slides fall back to the plain layout.
    // tagline: "Rich. Flavorful. Satisfying.",
    taglineColor: "#B45309",
    decorColor: "#E8B4A8",
    titleParts: [
      { text: "NON-VEG", color: "#B91C1C" },
      { text: "THALI", color: "#B45309" },
    ],
    priceBox: {
      leftMeals: "8 MEALS",
      leftPrice: "$10",
      rightMeals: "12 MEALS",
      rightPrice: "$9",
      badge: "NOW ONLY",
      badgeColor: "#B91C1C",
    },
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
        className="relative w-full overflow-hidden font-sans select-none flex flex-col justify-between pb-10 md:pb-14 lg:pb-16"
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
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-20 sm:pt-24 md:pt-32 flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-4">
          {/* Main Animated Container (Upar Dikhega Mobile me) */}
          <div className="relative order-1 md:order-2 w-full flex items-center justify-center pointer-events-none h-[200px] xs:h-[230px] sm:h-[400px] md:h-[420px] lg:h-[480px] xl:h-[520px]">
            <div className="relative w-[65%] xs:w-[70%] sm:w-[70%] md:w-[90%] aspect-square flex items-center justify-center animate-float">
              {/* Decorative circle behind the plate (slides with a priceBox) */}
              {activeItem.priceBox && (
                <div className="absolute inset-[6%] rounded-full" style={{ backgroundColor: `${activeItem.decorColor || "#AEBB7C"}80` }} />
              )}
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
            {activeItem.tagline && (
              <p
                key={`tagline-${activeItem.id}`}
                className="font-serif italic text-base sm:text-lg md:text-xl lg:text-2xl mb-1 justify-center md:justify-start"
                style={{ color: activeItem.taglineColor || "#C17A3E" }}
              >
                {activeItem.tagline}
              </p>
            )}

            {activeItem.titleParts ? (
              <h1
                key={`title-${activeItem.id}`}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wide mb-3 md:mb-4 drop-shadow-md leading-[0.95] uppercase"
              >
                {activeItem.titleParts.map((part, i) => (
                  <span key={i} className="block" style={{ color: part.color }}>
                    {part.text}
                  </span>
                ))}
              </h1>
            ) : (
              <h1
                key={`title-${activeItem.id}`}
                className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wide mb-3 md:mb-6 drop-shadow-md leading-tight uppercase transition-colors duration-500 ${activeItem.textColor}`}
              >
                {activeItem.name}
              </h1>
            )}

            <p
              className={`text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-6 justify-center md:justify-start transition-colors duration-500 line-clamp-2 max-w-[280px] xs:max-w-[320px] sm:max-w-none mx-auto md:mx-0 ${activeItem.priceBox ? "text-[#2B2B2B]" : activeItem.textColor}`}
            >
              {activeItem.description}
            </p>

            {/* Price promo box (Vegetarian / Non-Veg Thali) */}
            {activeItem.priceBox && (
              <div className="relative mx-auto md:mx-0 w-full sm:w-max max-w-full mb-10 md:mb-8">
                <div className="relative flex items-center justify-center sm:justify-start gap-3 xs:gap-4 sm:gap-6 border-2 border-[#E8DCC8] rounded-2xl px-4 xs:px-5 sm:px-7 py-4 bg-transparent">
                  <div className="text-center">
                    <p className="text-[11px] xs:text-xs sm:text-sm font-black text-[#2B2B2B] uppercase tracking-wide">{activeItem.priceBox.leftMeals}</p>
                    <p className="text-xl xs:text-2xl sm:text-3xl font-black text-red-600/80 line-through decoration-2">{activeItem.priceBox.leftPrice}</p>
                  </div>

                  <div
                    className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 shrink-0 rounded-full text-white flex flex-col items-center justify-center text-center font-black uppercase leading-tight text-[9px] xs:text-[10px] sm:text-xs shadow-lg border-2 border-dashed border-white/70 ring-2 ring-offset-2 -rotate-6"
                    style={{ backgroundColor: activeItem.priceBox.badgeColor || "#4A5D23", "--tw-ring-color": `${activeItem.priceBox.badgeColor || "#4A5D23"}4D` }}
                  >
                    {activeItem.priceBox.badge.split(" ").map((w, i) => (
                      <span key={i}>{w}</span>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-[11px] xs:text-xs sm:text-sm font-black text-[#2B2B2B] uppercase tracking-wide">{activeItem.priceBox.rightMeals}</p>
                    <p className="text-xl xs:text-2xl sm:text-3xl font-black text-[#2B2B2B]">{activeItem.priceBox.rightPrice}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Interactive Action Button Area */}
            <div className="mb-8 md:mb-10 flex justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base uppercase tracking-wider text-white shadow-lg cursor-pointer transition-colors duration-500 ${activeItem.btnBg} shadow-black/10`}
                onClick={scrollToPackages}
              >
                Shop Now
              </motion.button>
            </div>

            {/* Thumbnails Container */}
            <div className="flex gap-2.5 xs:gap-3 sm:gap-4 items-center p-2 xs:p-2.5 sm:p-3 rounded-full w-max mx-auto md:mx-0 backdrop-blur-md shadow-inner bg-black/5">
              {menuItems.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleManualClick(index)}
                    className={`w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 sm:border-[3px] shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform focus:outline-none
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
