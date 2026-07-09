import { useState, useEffect, useRef } from "react";
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
      "Fresh home-style meals delivered with love, every day!",

    bg: "#FDFBF9",
    waveColor: "#FCEBE1",
    textColor: "text-[#636B2F]",
    btnBg: "bg-[#636B2F]",

    mainImage: "/TifinSlider/2.png",
    thumbImage: "/TifinSlider/2.png",

    // Extra content only the Vegetarian Thali slide uses - matches the
    // reference design exactly, other slides fall back to the plain layout.
    tagline: "Delicious. Healthy. Affordable.",
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
    textColor: "text-[#915E02]",
    btnBg: "bg-[#915E02]",

    mainImage: "/TifinSlider/3.png",
    thumbImage: "/TifinSlider/3.png",

    // Extra content only the Non-Veg Thali slide uses - matches the
    // reference design exactly, other slides fall back to the plain layout.
    tagline: "Rich. Flavorful. Satisfying.",
    taglineColor: "#A9631C",
    taglineIcon: "✨",
    decorColor: "#D9B98A",
    arrowColor: "#A9631C",
    titleParts: [
      { text: "NON-VEG", color: "#915E02" },
      { text: "THALI", color: "#915E02" },
    ],
    titleIcon: "🤎",
    subtitleIcon: "🔥",
    priceBox: {
      leftMeals: "8 MEALS",
      leftPrice: "$10",
      rightMeals: "12 MEALS",
      rightPrice: "$9",
      badge: "NOW ONLY",
      badgeColor: "#915E02",
      decorBursts: true,
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
              {/* Decorative circle + dashed arrows behind the plate (slides with a priceBox) */}
              {activeItem.priceBox && (
                <>
                  <div className="absolute inset-[6%] rounded-full" style={{ backgroundColor: `${activeItem.decorColor || "#AEBB7C"}80` }} />
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute -top-2 right-4 sm:right-10 w-10 h-10 sm:w-14 sm:h-14"
                    style={{ color: activeItem.arrowColor || "#C17A3E" }}
                  >
                    <path
                      d="M10,80 Q40,80 60,40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                    <path d="M52,30 L60,40 L48,44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute bottom-4 -right-1 sm:right-6 w-8 h-8 sm:w-12 sm:h-12"
                    style={{ color: activeItem.arrowColor || "#C17A3E" }}
                  >
                    <path
                      d="M20,20 Q30,60 70,70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                    <path d="M60,64 L70,70 L64,80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
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
                className="font-serif italic text-lg sm:text-xl md:text-2xl mb-1 flex items-center gap-2 justify-center md:justify-start"
                style={{ color: activeItem.taglineColor || "#C17A3E" }}
              >
                {activeItem.tagline} <span className="text-base">{activeItem.taglineIcon || "🌿"}</span>
              </p>
            )}

            {activeItem.titleParts ? (
              <h1
                key={`title-${activeItem.id}`}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wide mb-3 md:mb-4 drop-shadow-md leading-[0.95] uppercase flex items-center gap-3"
              >
                <span>
                  {activeItem.titleParts.map((part, i) => (
                    <span key={i} className="block" style={{ color: part.color }}>
                      {part.text}
                    </span>
                  ))}
                </span>
                {activeItem.titleIcon && <span className="text-3xl sm:text-4xl md:text-5xl">{activeItem.titleIcon}</span>}
              </h1>
            ) : (
              <h1
                key={`title-${activeItem.id}`}
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wide mb-3 md:mb-6 drop-shadow-md leading-tight uppercase transition-colors duration-500 ${activeItem.textColor}`}
              >
                {activeItem.name}
              </h1>
            )}

            <p
              className={`text-sm sm:text-base md:text-xl font-medium leading-relaxed mb-6 flex items-center gap-2 justify-center md:justify-start transition-colors duration-500 ${activeItem.priceBox ? "text-[#2B2B2B]" : activeItem.textColor}`}
            >
              {activeItem.description}
              {activeItem.priceBox && <span className="text-base">{activeItem.subtitleIcon || "💞"}</span>}
            </p>

            {/* Price promo box (Vegetarian / Non-Veg Thali) */}
            {activeItem.priceBox && (
              <div className={`relative mx-auto md:mx-0 w-max max-w-full ${activeItem.priceBox.banner ? "mb-10 md:mb-9" : "mb-10 md:mb-8"}`}>
                <div className="relative flex items-center gap-4 sm:gap-6 border-2 border-[#E8DCC8] rounded-2xl px-5 sm:px-7 py-4 bg-white/60">
                  {activeItem.priceBox.decorBursts &&
                    ["-top-2 -left-2 rotate-0", "-top-2 -right-2 rotate-90", "-bottom-2 -left-2 -rotate-90", "-bottom-2 -right-2 rotate-180"].map((pos, i) => (
                      <svg key={i} viewBox="0 0 24 24" className={`absolute ${pos} w-4 h-4 sm:w-5 sm:h-5 text-[#C99354]`}>
                        <path d="M12 2 L12 8 M12 2 L9 5 M12 2 L15 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ))}

                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-black text-[#2B2B2B] uppercase tracking-wide">{activeItem.priceBox.leftMeals}</p>
                    <p className="text-2xl sm:text-3xl font-black text-red-600/80 line-through decoration-2">{activeItem.priceBox.leftPrice}</p>
                  </div>

                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full text-white flex flex-col items-center justify-center text-center font-black uppercase leading-tight text-[10px] sm:text-xs shadow-lg ring-2 ring-offset-2"
                    style={{ backgroundColor: activeItem.priceBox.badgeColor || "#4A5D23", "--tw-ring-color": `${activeItem.priceBox.badgeColor || "#4A5D23"}4D` }}
                  >
                    {activeItem.priceBox.badge.split(" ").map((w, i) => (
                      <span key={i}>{w}</span>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-black text-[#2B2B2B] uppercase tracking-wide">{activeItem.priceBox.rightMeals}</p>
                    <p className="text-2xl sm:text-3xl font-black text-[#2B2B2B]">{activeItem.priceBox.rightPrice}</p>
                  </div>
                </div>

                {/* {activeItem.priceBox.banner && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-4 sm:px-5 py-2 rounded-full shadow-md whitespace-nowrap"
                    style={{ backgroundColor: activeItem.priceBox.badgeColor || "#C17A3E" }}
                  >
                    {activeItem.priceBox.banner}
                  </div>
                )} */}
              </div>
            )}

            {/* Premium Interactive Action Button Area */}
            <div className="mb-8 md:mb-10  flex justify-center md:justify-start">
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