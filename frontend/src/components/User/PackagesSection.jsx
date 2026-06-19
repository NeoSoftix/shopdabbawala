import { motion } from "framer-motion";

export default function PackagesSection() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white via-[#fff8f8] to-white">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-200/40 rounded-full blur-[150px]" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-100 rounded-full blur-[180px]" />

      {/* Rotating Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-red-100"
      />

      {/* Heading */}
      <div className="text-center relative z-10 mb-14">

        <span className="inline-block px-5 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 font-semibold mb-5">
          CHOOSE YOUR PLAN
        </span>

        <h2 className="text-gray-900 font-black leading-none">

          <span className="block text-[50px] md:text-[75px]">
            PICK YOUR
          </span>

          <span className="block text-[40px] md:text-[65px] text-red-500">
            PERFECT PACKAGE
          </span>

        </h2>
      </div>

      {/* Cards Area */}
      <div className="relative max-w-6xl mx-auto min-h-[650px] px-6">

        {/* BASIC */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          whileHover={{
            scale: 1.05,
            rotateY: 10,
          }}
          className="
          absolute
          left-0
          top-0
          w-[280px]
          rounded-[40px]
          bg-white
          border
          border-red-100
          shadow-[0_20px_60px_rgba(0,0,0,.08)]
          p-8
          "
        >
          <div className="text-5xl mb-5">🥗</div>

          <h3 className="text-gray-900 text-4xl font-black">
            BASIC
          </h3>

          <p className="text-gray-500 mt-2">
            15 Meals / Month
          </p>

          <div className="text-5xl font-black text-red-600 mt-8">
            $99
          </div>

          <button className="mt-8 w-full py-4 rounded-2xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition">
            Choose Plan
          </button>
        </motion.div>

        {/* ELITE */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [2, -2, 2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          whileHover={{
            scale: 1.05,
            rotateY: -10,
          }}
          className="
          absolute
          right-0
          top-5
          w-[280px]
          rounded-[40px]
          bg-white
          border
          border-red-100
          shadow-[0_20px_60px_rgba(0,0,0,.08)]
          p-8
          "
        >
          <div className="text-5xl mb-5">🍱</div>

          <h3 className="text-gray-900 text-4xl font-black">
            ELITE
          </h3>

          <p className="text-gray-500 mt-2">
            60 Meals / Month
          </p>

          <div className="text-5xl font-black text-red-600 mt-8">
            $299
          </div>

          <button className="mt-8 w-full py-4 rounded-2xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition">
            Choose Plan
          </button>
        </motion.div>

        {/* Connector Lines */}
        <div className="absolute left-[240px] top-[160px] w-[220px] h-[2px] bg-red-200 rotate-[18deg]" />

        <div className="absolute right-[240px] top-[160px] w-[220px] h-[2px] bg-red-200 -rotate-[18deg]" />

        {/* PRO CARD */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          whileHover={{
            scale: 1.05,
          }}
          className="
          absolute
          left-1/2
          top-28
          -translate-x-1/2
          z-20
          w-[360px]
          rounded-[50px]
          bg-white
          border
          border-red-200
          shadow-[0_30px_80px_rgba(239,68,68,.20)]
          p-10
          overflow-hidden
          "
        >
          <div className="absolute inset-0 bg-red-100 blur-[100px]" />

          <div className="relative z-10">

            <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold">
              MOST POPULAR
            </div>

            <div className="text-6xl mb-5">🔥</div>

            <h3 className="text-gray-900 text-5xl font-black">
              PRO
            </h3>

            <p className="text-gray-500 mt-2">
              30 Meals / Month
            </p>

            <div className="text-7xl font-black text-red-600 mt-8">
              $179
            </div>

            <button className="mt-8 w-full py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition">
              Choose Plan
            </button>

          </div>
        </motion.div>

      </div>

      {/* Custom Package CTA */}
    <div className="max-w-4xl mx-auto mt-12 px-6">

  <div className="
  rounded-[50px]
  bg-gradient-to-r
  from-red-600
  to-red-500
  p-12
  text-center
  shadow-[0_20px_80px_rgba(239,68,68,.30)]
  ">

    <h3 className="text-white text-5xl font-black">
      BUILD YOUR OWN PACKAGE
    </h3>

    <p className="text-white/80 mt-4">
      Customize calories, proteins and meal preferences.
    </p>

    <button className="
    mt-8
    bg-white
    text-red-600
    px-8
    py-4
    rounded-full
    font-bold
    ">
      Customize Now
    </button>

  </div>

</div>
    </section>
  );
}