import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import HeroHeader from "../components/HeroHeader";
import { slides } from "../data/slides";

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
      className="relative min-h-[88vh] overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, #ef4444 0%, ${slide.color} 80%)`,
        padding: "0 1.5rem",
      }}
    >
      <HeroHeader />

      {/* Noise */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Glows */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-500/30 blur-[150px]" />

      <div className="absolute bottom-[-150px] right-[-100px] h-[500px] w-[500px] rounded-full bg-white/10 blur-[150px]" />

      {/* Rotating Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[-250px] top-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-white/10"
      >
        <div className="absolute inset-0 flex items-center justify-center text-[36px] font-black text-white/10 tracking-[15px]">
          HEALTHY • FRESH • DAILY • PREMIUM • PROTEIN •
        </div>
      </motion.div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-24 min-h-[88vh] flex items-center">

            <div className="grid lg:grid-cols-2 gap-20 xl:gap-28 items-center w-full">

          {/* LEFT */}
<div className="z-20 lg:pl-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-5 py-3 mb-8">

              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

              <span className="text-white text-sm">
                Trusted by 10,000+ Customers
              </span>

            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.title}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-white font-black leading-[0.85] tracking-[-4px]">

                  <span className="text-[70px] md:text-[90px] xl:text-[120px]">
                    {slide.title}
                  </span>

                  <span className="block text-[55px] md:text-[80px] xl:text-[105px] text-white/70">
                    {slide.subtitle}
                  </span>

                </h1>

                <p className="max-w-xl mt-8 text-lg text-white/80 leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-wrap gap-4 mt-10">

                  <button className="bg-white text-red-600 px-8 py-4 rounded-full font-bold hover:scale-105 transition">
                    Order Now
                  </button>

                  <button className="border border-white/30 text-white px-8 py-4 rounded-full flex items-center gap-2 hover:bg-white hover:text-red-600 transition">
                    Explore Menu
                    <FiArrowRight />
                  </button>

                </div>

                <div className="flex gap-10 mt-10">

                  <div>
                    <h3 className="text-3xl font-black text-white">
                      10K+
                    </h3>
                    <p className="text-white/70 text-sm">
                      Meals Delivered
                    </p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-white">
                      4.9★
                    </h3>
                    <p className="text-white/70 text-sm">
                      Rating
                    </p>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-white">
                      24/7
                    </h3>
                    <p className="text-white/70 text-sm">
                      Support
                    </p>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute top-12 left-0 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl px-5 py-4 text-white"
            >
              🔥 5000+ Meals
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute bottom-12 right-0 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl px-5 py-4 text-white"
            >
              ⭐ 4.9 Rating
            </motion.div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-10 right-10 text-5xl"
            >
              🍅
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-24 left-10 text-5xl"
            >
              🥑
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.img
                key={slide.image}
                src={slide.image}
                alt=""
                initial={{
                  opacity: 0,
                  scale: 0.7,
                  rotate: -15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.8,
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: -10,
                }}
                className="
                w-[380px]
                h-[380px]
                lg:w-[620px]
                lg:h-[620px]
                object-cover
                rounded-full
                border-[12px]
                border-white/20
                shadow-[0_0_120px_rgba(255,255,255,.25)]
                "
              />
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* Slide Nav */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">

        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              active === i
                ? "w-4 h-14 bg-white"
                : "w-3 h-3 bg-white/40"
            }`}
          />
        ))}

      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-black/10 backdrop-blur-xl">

        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between text-white/70 text-sm">

          <span>Fresh Ingredients</span>
          <span>Free Delivery</span>
          <span>High Protein Meals</span>
          <span>Custom Meal Plans</span>

        </div>

      </div>
    </section>
  );
}