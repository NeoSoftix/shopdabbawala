import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import HeroHeader from "../components/HeroHeader";
import { slides } from "../data/slides";
import FoodPlateAnimation from "../components/FoodPlateAnimation";

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section
      className="relative min-h-[90vh] lg:min-h-screen overflow-hidden transition-all duration-700 ease-in-out"
      style={{
        background: `radial-gradient(circle at center, #ef4444 0%, ${slide.color} 80%)`,
        padding: "0 1.5rem",
      }}
    >
      <HeroHeader />

      {/* Noise - willChange property added for smooth hardware acceleration */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none style={{ willChange: 'transform' }}" />

      {/* Glows - Fixed dimensions and hardware acceleration enabled */}
      <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-red-500/30 blur-[120px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-[-150px] right-[-100px] h-[450px] w-[450px] rounded-full bg-white/10 blur-[120px] pointer-events-none transform-gpu" />

      {/* Rotating Ring - Used transform-gpu for better frames */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[-250px] top-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-white/10 pointer-events-none transform-gpu"
      >
        <div className="absolute inset-0 flex items-center justify-center text-[32px] font-black text-white/5 tracking-[15px] select-none">
          HEALTHY • FRESH • DAILY • PREMIUM • PROTEIN •
        </div>
      </motion.div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-28 pb-20 min-h-[85vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center w-full">
          
          {/* LEFT CONTENT */}
          <div className="z-20 lg:pl-8 relative min-h-[450px] flex flex-col justify-center">
            <div className="inline-flex self-start items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-5 py-2.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-xs md:text-sm font-medium">
                Trusted by 10,000+ Customers
              </span>
            </div>

            {/* Main Animating Wrapper */}
            <div className="relative overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="transform-gpu"
                >
                  <h1 className="text-white font-black leading-[0.9] tracking-[-3px] uppercase">
                    <span className="text-[55px] sm:text-[70px] md:text-[85px] xl:text-[110px] block dynamic-text-shadow">
                      {slide.title}
                    </span>
                    <span className="block text-[40px] sm:text-[55px] md:text-[70px] xl:text-[90px] text-white/70">
                      {slide.subtitle}
                    </span>
                  </h1>

                  <p className="max-w-xl mt-6 text-base md:text-lg text-white/80 leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="bg-white text-red-600 px-8 py-3.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
                      Order Now
                    </button>
                    <button className="border border-white/30 text-white px-8 py-3.5 rounded-full flex items-center gap-2 hover:bg-white hover:text-red-600 active:scale-95 transition-all duration-200">
                      Explore Menu
                      <FiArrowRight />
                    </button>
                  </div>

                  {/* Stats Counter Section */}
                  <div className="flex gap-8 md:gap-12 mt-10 border-t border-white/10 pt-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white">10K+</h3>
                      <p className="text-white/60 text-xs md:text-sm font-medium">Meals Delivered</p>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white">4.9★</h3>
                      <p className="text-white/60 text-xs md:text-sm font-medium">Rating</p>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white">24/7</h3>
                      <p className="text-white/60 text-xs md:text-sm font-medium">Support</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT FOOD PLATE */}
          <div className="relative flex justify-center items-center lg:mt-0 mt-8">
            {/* Badges and Floating Elements */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 left-4 md:left-0 z-30 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-xs md:text-sm text-white shadow-xl transform-gpu"
            >
              🔥 5000+ Meals
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 right-4 md:right-0 z-30 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-xs md:text-sm text-white shadow-xl transform-gpu"
            >
              ⭐ 4.9 Rating
            </motion.div>

            {/* Emoji details */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute top-6 right-12 text-3xl md:text-4xl select-none z-10 pointer-events-none transform-gpu"
            >
              🍅
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-16 left-8 text-3xl md:text-4xl select-none z-10 pointer-events-none transform-gpu"
            >
              🥑
            </motion.div>

            {/* Food Plate Container */}
            <div className="w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] xl:max-w-[550px] relative z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.9, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotate: 15 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="transform-gpu origin-center"
                >
                  <FoodPlateAnimation trigger={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Side Slider Dot Indicator */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              active === i ? "w-3 h-10 md:h-12 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Bottom Features Sticky Bar */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-black/10 backdrop-blur-md z-20 hidden md:block">
        <div className="max-w-[1600px] mx-auto px-8 py-3.5 flex justify-between text-white/70 text-xs xl:text-sm tracking-wide font-medium">
          <span>🌿 Fresh Ingredients</span>
          <span>🚀 Free Delivery</span>
          <span>💪 High Protein Meals</span>
          <span>📅 Custom Meal Plans</span>
        </div>
      </div>
    </section>
  );
}