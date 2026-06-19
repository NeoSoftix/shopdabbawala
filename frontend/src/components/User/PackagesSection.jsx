
import { useState } from "react";
import { motion } from "framer-motion";

const packages = [
  {
    title: "STARTER",
    price: "$99",
    meals: "15 Meals / Month",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
    gradient: "from-green-100 via-white to-red-50",
    tags: ["Healthy", "Fresh"],
  },
  {
    title: "PRO",
    price: "$179",
    meals: "30 Meals / Month",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200",
    gradient: "from-red-100 via-white to-pink-100",
    tags: ["Best Seller", "High Protein"],
  },
  {
    title: "ELITE",
    price: "$299",
    meals: "60 Meals / Month",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    gradient: "from-purple-100 via-white to-red-100",
    tags: ["Premium", "Chef Crafted"],
  },

];

export default function PackagesSection() {
  const [active, setActive] = useState(1);

  return (
    <section
      className={`relative overflow-hidden py-20 transition-all duration-700 bg-gradient-to-br ${packages[active].gradient}`}
    >
      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-200/40 rounded-full blur-[150px]" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[180px]" />

      {/* Rotating Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
        absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-[900px]
        h-[900px]
        rounded-full
        border
        border-red-100
      "
      />

      {/* Heading */}
      <div className="text-center relative z-10 mb-16">
        <span
          className="
          inline-block
          px-5
          py-2
          rounded-full
          bg-white/80
          border
          border-red-100
          text-red-600
          font-semibold
          mb-5
        "
        >
          CHOOSE YOUR PLAN
        </span>

        <h2 className="font-black leading-none">
          <span className="block text-[45px] md:text-[75px] text-gray-900">
            PICK YOUR
          </span>

          <span className="block text-[38px] md:text-[65px] text-red-500">
            PERFECT PACKAGE
          </span>
        </h2>
      </div>

      {/* Big Background Text */}
      <div
        className="
        absolute
        left-1/2
        top-[35%]
        -translate-x-1/2
        text-[220px]
        font-black
        text-red-50
        hidden xl:block
        pointer-events-none
        select-none
      "
      >
        MEALS
      </div>

      {/* Cards */}
      <div className="relative h-[650px] max-w-7xl mx-auto z-10">

        {packages.map((pkg, index) => {
          const isActive = index === active;

          let xPosition = 0;

          if (active === 0) {
            if (index === 0) xPosition = 0;       // center
            if (index === 1) xPosition = 420;     // right
            if (index === 2) xPosition = -420;    // left
          }

          if (active === 1) {
            if (index === 1) xPosition = 0;       // center
            if (index === 0) xPosition = -420;    // left
            if (index === 2) xPosition = 420;     // right
          }

          if (active === 2) {
            if (index === 2) xPosition = 0;       // center
            if (index === 0) xPosition = 420;     // right
            if (index === 1) xPosition = -420;    // left
          }

          return (
            <motion.div
              key={pkg.title}
              onClick={() => setActive(index)}
              animate={{
                x: xPosition,
                scale: isActive ? 1 : 0.82,
                opacity: isActive ? 1 : 0.55,
                // filter: isActive ? "blur(0px)" : "blur(6px)",
                rotateY: isActive ? 0 : 20,
              }}
              transition={{
                duration: 0.7,
              }}
              whileHover={{
                scale: isActive ? 1.05 : 0.85,
              }}
              className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[420px]
              cursor-pointer
            "
              style={{
                zIndex: isActive ? 20 : 5,
                perspective: "1200px",
              }}

            >
              <motion.div
                animate={
                  isActive
                    ? {
                      y: [0, -15, 0],
                    }
                    : {
                      y: [0, -8, 0],
                    }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="
                relative
                bg-white/80
                backdrop-blur-3xl
                rounded-[45px]
                border
                border-white
                shadow-[0_30px_100px_rgba(0,0,0,.12)]
                pt-28
                pb-10
                px-8
                overflow-visible
              "
              >
                {/* Image */}
                <img
                  src={pkg.image}
                  alt=""
                  className="
                  absolute
                  -top-16
                  left-1/2
                  -translate-x-1/2
                  w-32
                  h-32
                  rounded-full
                  object-cover
                  border-[8px]
                  border-white
                  shadow-2xl
                "
                />

                {isActive && (
                  <div
                    className="
                    absolute
                    top-5
                    right-5
                    bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    font-bold
                  "
                  >
                    POPULAR
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-5xl font-black text-gray-900">
                    {pkg.title}
                  </h3>

                  <p className="text-gray-500 mt-3">
                    {pkg.meals}
                  </p>

                  <div className="text-red-600 text-7xl font-black mt-6">
                    {pkg.price}
                  </div>

                  <div className="flex justify-center gap-2 mt-6">
                    {pkg.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                        px-3
                        py-1
                        rounded-full
                        bg-red-50
                        text-red-600
                        text-xs
                      "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className={`
                    mt-8
                    w-full
                    py-4
                    rounded-2xl
                    font-bold
                    transition
                    ${isActive
                        ? "bg-red-600 text-white"
                        : "border border-red-200 text-red-600"
                      }
                  `}
                  >
                    Choose Plan
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div
          className="
          relative
          overflow-hidden
          rounded-[45px]
          bg-gradient-to-r
          from-red-600
          via-red-500
          to-red-600
          p-12
          text-center
          shadow-[0_30px_120px_rgba(239,68,68,.30)]
        "
        >
          <div className="absolute -top-17 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

          <h3 className="text-white text-5xl font-black">
            BUILD YOUR OWN PACKAGE
          </h3>

          <p className="text-white/80 mt-4 text-lg">
            Customize calories, proteins, meal count and delivery schedule.
          </p>

          <button
            className="
            mt-8
            bg-white
            text-red-600
            px-10
            py-4
            rounded-full
            font-bold
            hover:scale-105
            transition
          "
          >
            Customize Now
          </button>
        </div>
      </div>
    </section>
  );
}