import { motion } from "framer-motion";

export default function FoodPlateAnimation({ trigger }) {
  return (
    <motion.div
      key={trigger}
      className="relative w-[380px] h-[380px] lg:w-[680px] lg:h-[680px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Plate */}
      <motion.img
        src="/food/plate.png"
        alt=""
        initial={{
          scale: 0.8,
          rotate: -10,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          rotate: 0,
          opacity: 1,
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 w-full h-full object-cover drop-shadow-[0_40px_80px_rgba(0,0,0,0.35)]"
      />

      {/* Rice */}
      <motion.img
        src="/food/rice.png"
        alt=""
        initial={{
          x: -80,
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.3,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          left-[12%]
          top-[34%]
          w-[38%]
        "
      />

      {/* Rasgulla */}
      <motion.img
        src="/food/rasgulla.png"
        alt=""
        initial={{
          y: -80,
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.6,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          left-[25%]
          top-[8%]
          w-[28%]
        "
      />

      {/* Naan */}
      <motion.img
        src="/food/naan.png"
        alt=""
        initial={{
          y: -80,
          rotate: -10,
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          y: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.9,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          right-[18%]
          top-[12%]
          w-[34%]
        "
      />

      {/* Chole Wrapper */}
      <div
        className="
    absolute
    right-[12%]
    top-[40%]
    w-[34%]
  "
      >
        <motion.img
          src="/food/chole.png"
          alt=""
          initial={{
            y: -80,
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 1.2,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full"
        />
      </div>

      {/* Salad */}
      <motion.img
        src="/food/salad.png"
        alt=""
        initial={{
          y: 80,
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 1.5,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          left-[18%]
          bottom-[15%]
          w-[45%]
        "
      />

      {/* Final Bounce */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1, 1.03, 1],
        }}
        transition={{
          delay: 2,
          duration: 0.8,
        }}
      />
    </motion.div>
  );
}
