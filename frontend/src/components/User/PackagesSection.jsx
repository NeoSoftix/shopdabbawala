import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreatePackage from "../../pages/User/CreatePackage";

const packages = [
  {
    title: "STARTER",
    price: "$99",
    meals: "15 Meals / Month",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
    gradient: "from-[#F3FBF7] via-white to-[#FFF5F5]",
    features: ["Healthy Meals", "Fresh Ingred", "Standard Del"],
    popular: false,
  },
  {
    title: "PRO",
    price: "$179",
    meals: "30 Meals / Month",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200",
    gradient: "from-[#FFF5F5] via-white to-[#FFF0F5]",
    features: ["Best Seller", "High Protein", "Priority Delivery"],
    popular: true,
  },
  {
    title: "ELITE",
    price: "$299",
    meals: "60 Meals / Month",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    gradient: "from-[#F5F0FA] via-white to-[#FFF5F5]",
    features: ["Premium Select", "Chef Crafted", "24/7 Support"],
    popular: false,
  },
  {
    title: "FITNESS DIET",
    price: "$210",
    meals: "40 Meals / Month",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200",
    gradient: "from-[#F0F9FF] via-white to-[#FFF5F5]",
    features: ["Low Carb Base", "Keto Approved", "Nutritionist Guide"],
    popular: false,
  },
  {
    title: "FAMILY FEAST",
    price: "$450",
    meals: "90 Meals / Month",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200",
    gradient: "from-[#FFFDF0] via-white to-[#FFF5F5]",
    features: ["Bulk Discount", "Flexible Swaps", "Weekend Specials"],
    popular: false,
  },
];

export default function PackagesSection() {
  const [active, setActive] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % packages.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + packages.length) % packages.length);
  };

  return (
    <section
      className={`relative min-h-screen w-full py-16 flex flex-col justify-between bg-gradient-to-br ${packages[active].gradient} font-sans select-none overflow-x-hidden transition-all duration-[700ms] ease-out`}
    >
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-100/30 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-100/30 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ================= HEADER BLOCK ================= */}
      <div className="text-center relative z-20 px-4 mb-6 flex-shrink-0">
        <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white border border-red-200 shadow-sm text-red-600 font-black text-xs tracking-widest mb-4">
          ⚡ CHOOSE YOUR PLAN
        </span>

        <h2 className="font-black tracking-tight uppercase leading-none">
          <span className="block text-[42px] md:text-[68px] text-slate-900 tracking-tighter">
            PICK YOUR
          </span>
          <span className="block text-[36px] md:text-[58px] text-red-600 tracking-normal mt-1">
            PERFECT PACKAGE
          </span>
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] md:text-xs mt-3">
          Click any card directly or use arrows to discover plans.
        </p>
      </div>

      {/* ================= INTERACTIVE CAROUSEL STRUCTURE WITH ARROWS ================= */}
      <div className="relative w-full max-w-6xl mx-auto z-10 flex items-center justify-between px-4 md:px-6 my-auto overflow-visible">
        {/* Left Arrow Controls */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/90 border border-slate-100 text-slate-800 font-black flex items-center justify-center shadow-md hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 z-40 pointer-events-auto focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel Window Deck Container */}
        <div className="relative h-[510px] w-full flex items-center justify-center overflow-visible mx-4">
          {packages.map((pkg, index) => {
            const isActive = index === active;
            let xPosition = 0;
            let shouldRender = false;
            const distance = index - active;

            if (distance === 0) {
              xPosition = 0;
              shouldRender = true;
            } else if (
              distance === 1 ||
              (active === packages.length - 1 && index === 0)
            ) {
              xPosition = 370;
              shouldRender = true;
            } else if (
              distance === -1 ||
              (active === 0 && index === packages.length - 1)
            ) {
              xPosition = -370;
              shouldRender = true;
            }

            if (!shouldRender) return null;

            return (
              <motion.div
                key={pkg.title}
                onClick={() => setActive(index)}
                animate={{
                  x: xPosition,
                  scale: isActive ? 1 : 0.92,
                  opacity: 1, // Opacity himesha full 1 rakhi hai taaki filter layer blur na kare
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                whileHover={{
                  scale: isActive ? 1.02 : 0.95,
                }}
                // FIX: transform ko rasterize hone se rokne ke liye specific class aur inline filter configurations lagaye hain
                className="absolute w-[310px] sm:w-[330px] overflow-visible select-none"
                style={{
                  zIndex: isActive ? 30 : 10,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transformStyle: "flat", // 3D preserve ki jagah flat use kiya taaki subpixel text blur na ho
                }}
              >
                {/* Inside Card Wrapper */}
                <div
                  className={`relative bg-white rounded-[2.5rem] border p-6 transition-all duration-300 flex flex-col justify-between h-full min-h-[480px] cursor-pointer`}
                  style={{
                    // Pure layout ko graphics engine par super-sharp force karne ke liye CSS layers hooks
                    transform: "translateZ(0)",
                    WebkitFontSmoothing: "antialiased",
                    boxShadow: isActive 
                      ? "0 30px 60px rgba(220,38,38,0.12)" 
                      : "0 15px 45px rgba(0,0,0,0.03)",
                    borderColor: isActive ? "#ef4444" : "rgba(226, 232, 240, 0.6)"
                  }}
                >
                  {/* Top Ribbon Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md z-30">
                      ⚡ POPULAR CHOICE
                    </div>
                  )}

                  {/* Clean Plate Image Area */}
                  <div className="w-full flex justify-center mb-5 mt-2">
                    <div
                      className={`relative rounded-full overflow-hidden bg-slate-50 border-[5px] border-slate-50 shadow-md transition-all duration-500
                      ${isActive ? "w-32 h-32 ring-4 ring-red-500/10 scale-105" : "w-24 h-24"}`}
                    >
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Info Elements Content */}
                  <div className="text-center flex-grow flex flex-col justify-between">
                    <div>
                      <h3
                        className={`text-xl font-black tracking-wide uppercase transition-colors duration-300 ${isActive ? "text-red-600" : "text-slate-800"}`}
                      >
                        {pkg.title}
                      </h3>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-0.5">
                        {pkg.meals}
                      </p>

                      <div className="w-10 h-[1.5px] bg-red-500/10 mx-auto my-3" />

                      {/* Pricing Tag */}
                      <div className="my-1 flex items-baseline justify-center">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">
                          {pkg.price}
                        </span>
                        <span className="text-slate-400 font-bold text-xs ml-0.5">
                          /mo
                        </span>
                      </div>

                      {/* Clean Checklist Grid */}
                      <ul className="space-y-3 my-4 text-left max-w-[170px] mx-auto">
                        {pkg.features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-center text-slate-600 text-xs font-bold tracking-wide"
                          >
                            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="5"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className={`w-full py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 border focus:outline-none mt-2
                        ${
                          isActive
                            ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/10"
                            : "bg-white border-red-500 text-red-500 hover:bg-red-50"
                        }`}
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow Controls */}
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/90 border border-slate-100 text-slate-800 font-black flex items-center justify-center shadow-md hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 z-40 pointer-events-auto focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ================= BUILD YOUR OWN PACKAGE BOX ================= */}
      <div className="max-w-5xl w-full mx-auto px-6 relative z-30 flex-shrink-0 mt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-6 md:p-8 shadow-[0_25px_50px_-10px_rgba(220,38,38,0.25)] border border-red-400/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0 backdrop-blur-sm">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-wide">
                BUILD YOUR OWN PACKAGE
              </h3>
              <p className="text-red-50/80 mt-0.5 text-xs font-semibold">
                Customize calories, proteins, meal count, and delivery schedule.
              </p>
            </div>
          </div>

          <button
            className="relative z-10 bg-white text-slate-950 font-black text-xs tracking-widest uppercase px-8 py-3.5 rounded-xl shadow-md transition-all duration-300 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.97] flex items-center gap-1.5 group whitespace-nowrap focus:outline-none"
            onClick={() => setIsPopupOpen(true)}
          >
            Customize Now
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* ================= HIGH-END MODAL OVERLAY POPUP INTERFACE ================= */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl z-10 border border-slate-100 max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              <CreatePackage onClose={() => setIsPopupOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}