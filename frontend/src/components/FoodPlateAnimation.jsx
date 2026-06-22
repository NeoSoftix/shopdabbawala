import { motion } from "framer-motion";

export default function FoodPlateAnimation({ trigger }) {
  return (
    <motion.div
      key={trigger}
      className="relative w-[380px] h-[380px] lg:w-[620px] lg:h-[620px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Plate */}
      <motion.img
        src="/food/plate.png"
        alt=""
        initial={{ scale: 0.7, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Rice */}
      <motion.img
        src="/food/rice.png"
        alt=""
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.7,
          type: "spring",
        }}
        className="
          absolute
          left-[18%]
          top-[48%]
          w-[28%]
        "
      />

      {/* Rasgulla */}
      <motion.img
        src="/food/rasgulla.png"
        alt=""
        initial={{ y: -250, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.6,
          type: "spring",
          stiffness: 120,
        }}
        className="
          absolute
          left-[8%]
          top-[8%]
          w-[28%]
        "
      />

      {/* Naan */}
      <motion.img
        src="/food/naan.png"
        alt=""
        initial={{
          y: -250,
          rotate: -25,
          opacity: 0,
        }}
        animate={{
          y: 0,
          rotate: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.9,
          type: "spring",
        }}
        className="
          absolute
          right-[10%]
          top-[6%]
          w-[34%]
        "
      />

      {/* Chole */}
      <motion.img
        src="/food/chole.png"
        alt=""
        initial={{ y: -250, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 1.2,
          type: "spring",
          stiffness: 120,
        }}
        className="
          absolute
          right-[12%]
          top-[34%]
          w-[34%]
        "
      />

      {/* Salad */}
      <motion.img
        src="/food/salad.png"
        alt=""
        initial={{
          y: 200,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 1.5,
          type: "spring",
        }}
        className="
          absolute
          left-[18%]
          bottom-[10%]
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