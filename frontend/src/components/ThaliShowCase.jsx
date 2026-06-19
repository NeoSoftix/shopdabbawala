import { motion } from "framer-motion";

const thalis = [
  {
    name: "Special Thali",
    desc: "Fresh homemade thali with premium taste.",
    image: "/thali1.png",
  },
  {
    name: "Punjabi Thali",
    desc: "Rich flavor, full meal and perfect spices.",
    image: "/thali2.png",
  },
];

export default function ThaliShowcase() {
  return (
    <section className="relative min-h-screen bg-[#d71920] overflow-hidden text-white">
      {/* Triangle Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#d71920]" />
        <div className="absolute left-0 top-0 w-full h-full bg-white [clip-path:polygon(0_0,50%_50%,0_100%)] opacity-95" />
        <div className="absolute right-0 top-0 w-full h-full bg-white [clip-path:polygon(100%_0,50%_50%,100%_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-6 md:px-16 flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Rotating Thali */}
          <div className="relative flex justify-center items-center min-h-[560px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative z-20"
            >
              <img
                src="/coffee.png"
                alt="Thali"
                className="w-[360px] md:w-[540px] object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.35)]"
              />
            </motion.div>

            {/* Small sauce */}
            <motion.img
              src="/coffee2.png"
              alt="Sauce"
              animate={{ rotate: -360 }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-24 right-10 w-28 md:w-36 object-contain drop-shadow-2xl"
            />

            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute w-[420px] h-[420px] rounded-full border-2 border-white/60"
            />
          </div>

          {/* Right Text */}
          <div>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xl font-black tracking-[6px]"
            >
              TASTY & FRESH
            </motion.p>

            <motion.h2
              initial={{ y: 70, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-5 text-6xl md:text-8xl font-black leading-[0.9]"
            >
              Sit Back <br /> & Relax!
            </motion.h2>

            <motion.p
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-7 text-lg max-w-md text-white/90"
            >
              Enjoy delicious thalis made with fresh ingredients, authentic taste
              and perfect homemade flavors.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="mt-9 bg-white text-[#d71920] px-9 py-4 rounded-full font-black shadow-xl"
            >
              Explore Thalis
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}