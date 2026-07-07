import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreatePackage from "../../pages/User/CreatePackage";
import { checkServiceAvailability } from "../../services/vendor.service";
import { getActivePackages } from "../../services/package.service";
import { toast } from "react-hot-toast";
import CheckoutFlowModal from "../shared/CheckoutFlowModal";
import { useAuth } from "../../context/AuthContext";
import { getMySubscriptions } from "../../services/subscription.service";
// Fallback Images (agar backend se image na mile)
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
];

// Gradients array
const GRADIENTS = [
  "from-[#F3FBF7] via-white to-[#FFF5F5]",
  "from-[#FFF5F5] via-white to-[#FFF0F5]",
  "from-[#F5F0FA] via-white to-[#FFF5F5]",
  "from-[#F0F9FF] via-white to-[#FFF5F5]",
];

export default function PackagesSection() {
  const location = useLocation();
  // --- BACKEND DATA STATES ---
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [active, setActive] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupStep, setPopupStep] = useState(1);
  const [formData, setFormData] = useState({ pincode: "" });

  const [featureModalData, setFeatureModalData] = useState(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [leadError, setLeadError] = useState("");
  // --- CHECKOUT MODAL STATES ---
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  
  const { user } = useAuth();
  const [userSubscriptions, setUserSubscriptions] = useState([]);

  useEffect(() => {
    if (user) {
      getMySubscriptions()
        .then((res) => {
          if (res.success && res.subscriptions) {
            setUserSubscriptions(res.subscriptions);
          }
        })
        .catch((err) => console.error("Failed to fetch subscriptions:", err));
    }
  }, [user]);

  const activeSubscriptions = userSubscriptions.filter(sub => sub.status === "active");

  // --- DYNAMIC DATA FETCHING VIA SERVICE ---
  useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        setLoading(true);
        // Custom API Service hit
        const result = await getActivePackages();

        if (result.success && result.data) {
          const formattedPackages = result.data.map((pkg, index) => ({
            ...pkg,
            title: pkg.name ? pkg.name.toUpperCase() : "PLAN",
            price: pkg.price ? `₹${pkg.price}` : "₹0",
            meals: `${pkg.totalMeals || 0} Meals / ${pkg.validityDays || 0} Days`,
            image:
              pkg.image?.url ||
              pkg.image ||
              DEFAULT_IMAGES[index % DEFAULT_IMAGES.length],
            gradient: GRADIENTS[index % GRADIENTS.length],
            features: pkg.description
              ? pkg.description.split(", ")
              : [
                  "Healthy Meals",
                  "Fresh Ingredients",
                  `Max Items: ${pkg.maxItemsPerMeal || 3}`,
                  "Macro-Friendly Plan",
                ],
            popular: index === 1,
          }));

          setPackages(formattedPackages);
          setError(null);
        } else {
          setError(result.message || "Failed to fetch active packages");
        }
      } catch (err) {
        console.error("Error fetching packages via service:", err);
        setError("Unable to load packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesData();
  }, []);

  const getResponsiveOffset = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 480) return 140;
      if (window.innerWidth < 768) return 240;
    }
    return 370;
  };

  const handleNext = () => {
    if (packages.length === 0) return;
    setActive((prev) => (prev + 1) % packages.length);
  };

  const handlePrev = () => {
    if (packages.length === 0) return;
    setActive((prev) => (prev - 1 + packages.length) % packages.length);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -50) {
      handleNext();
    } else if (info.offset.x > 50) {
      handlePrev();
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();

    try {
      setLeadError("");

      const res = await checkServiceAvailability(formData.pincode.trim());

      if (res.success) {
        setPopupStep(2);
      } else {
        setLeadError(res.message);
      }
    } catch (error) {
      setLeadError(
        error.response?.data?.message ||
          "Sorry! Service is not available in your area.",
      );
    }
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupStep(1);
  };

  const handleChoosePlanInModal = (index) => {
    setActive(index);
    setIsViewAllOpen(false);
    openCheckoutModal(packages[index]);
  };

  const openFeaturesModal = (e, pkg) => {
    e.stopPropagation();
    setFeatureModalData(pkg);
  };

  const openCheckoutModal = (pkg) => {
    const isCurrentPlan = activeSubscriptions.some(sub => sub.package?._id === pkg._id || sub.mealSize === pkg.name);

    if (isCurrentPlan) {
      return; // Already on this plan, do nothing
    }

    // Always go through the full checkout flow (pincode -> phone -> OTP -> payment),
    // even for users upgrading from an existing plan. Only their details get prefilled.
    setCheckoutPlan(pkg);
  };

  const closeCheckoutModal = () => {
    setCheckoutPlan(null);
  };

  // --- LOADING & ERROR STATES UI ---
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">
          Fetching Active Packages...
        </p>
      </div>
    );
  }

  if (error || packages.length === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <p className="text-red-500 font-black text-xl mb-2">
          ⚠️ {error || "No Active Packages Found"}
        </p>
        <p className="text-slate-400 text-sm">
          Please make sure your admin server has activated packages configured.
        </p>
      </div>
    );
  }

  return (
    <section
      className={`relative min-h-screen w-full py-12 md:py-16 flex flex-col justify-between bg-gradient-to-br ${packages[active]?.gradient || "from-slate-50 to-white"} font-sans select-none overflow-x-hidden transition-all duration-[700ms] ease-out`}
      id="plans"
    >
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-100/40 rounded-full blur-[90px] md:blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-pink-100/40 rounded-full blur-[90px] md:blur-[170px] pointer-events-none z-0" />

      {/* ================= HEADER BLOCK ================= */}
      <div className="text-center relative z-20 px-4 mb-4 md:mb-6 flex-shrink-0">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-red-200 shadow-md text-red-600 font-extrabold text-[10px] md:text-xs tracking-widest mb-3 md:mb-4">
          ⚡ CHOOSE YOUR PLAN
        </span>

        <h2 className="font-black tracking-tight uppercase leading-none">
          <span className="block text-[32px] sm:text-[48px] md:text-[64px] text-slate-900 tracking-tighter font-black">
            PICK YOUR
          </span>
          <span className="block text-[28px] sm:text-[42px] md:text-[54px] text-red-600 tracking-normal mt-1 font-black">
            PERFECT PACKAGE
          </span>
        </h2>

        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] sm:text-[11px] md:text-xs">
            <span className="md:hidden">
              Swipe or click cards to discover plans.
            </span>
            <span className="hidden md:inline">
              Click any card directly or use arrows to discover plans.
            </span>
          </p>
          <button
            onClick={() => setIsViewAllOpen(true)}
            className="mt-1 bg-white hover:bg-slate-50 text-red-600 border border-red-200 shadow-sm font-black text-[11px] md:text-xs uppercase tracking-wider px-5 py-2 rounded-full transition-all focus:outline-none"
          >
            View All Packages +
          </button>
        </div>
      </div>

      {/* ================= INTERACTIVE CAROUSEL STRUCTURE ================= */}
      <div className="relative w-full max-w-6xl mx-auto z-10 flex items-center justify-between px-2 sm:px-6 my-auto overflow-visible">
        <button
          onClick={handlePrev}
          className="hidden md:flex w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-800 font-black items-center justify-center shadow-lg hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 z-40 focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="relative h-[480px] sm:h-[510px] md:h-[550px] w-full flex items-center justify-center overflow-visible mx-2 md:mx-4">
          {packages.map((pkg, index) => {
            const isActive = index === active;
            const offsetWidth = getResponsiveOffset();
            let distance = index - active;

            // Carousel Bound Logic for infinite loop
            if (distance > 1 && active === 0 && index === packages.length - 1) {
              distance = -1;
            } else if (
              distance < -1 &&
              active === packages.length - 1 &&
              index === 0
            ) {
              distance = 1;
            }

            let xPosition = 0;
            let shouldRender = false;

            if (distance === 0) {
              xPosition = 0;
              shouldRender = true;
            } else if (distance === 1) {
              xPosition = offsetWidth;
              shouldRender = true;
            } else if (distance === -1) {
              xPosition = -offsetWidth;
              shouldRender = true;
            }

            // Agar active package 1 se zyaada door hai array me, toh skip render
            if (!shouldRender && packages.length > 2) return null;

            const visibleFeatures = pkg.features.slice(0, 3);
            const isCurrentPlan = activeSubscriptions.some(sub => sub.package?._id === pkg._id || sub.mealSize === pkg.name);

            return (
              <motion.div
                key={pkg._id}
                onClick={() => !isActive && setActive(index)}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={{
                  x: xPosition,
                  scale: isActive ? 1 : 0.86,
                  opacity: 1,
                  rotate: isActive ? 0 : distance * 3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                whileHover={{
                  scale: isActive ? 1.02 : 0.9,
                }}
                className="absolute w-[265px] sm:w-[310px] md:w-[340px] overflow-visible select-none touch-pan-y"
                style={{
                  zIndex: isActive ? 30 : 10,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div
                  className="relative bg-white rounded-[2.5rem] border p-6 flex flex-col justify-between h-full min-h-[440px] sm:min-h-[480px] md:min-h-[510px] cursor-pointer shadow-2xl transition-colors duration-300"
                  style={{
                    boxShadow: isActive
                      ? "0 30px 60px rgba(220,38,38,0.15)"
                      : "0 15px 35px rgba(0,0,0,0.06)",
                    borderColor: isActive ? "#ef4444" : "#f1f5f9",
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-md z-30 whitespace-nowrap">
                      ⚡ POPULAR CHOICE
                    </div>
                  )}

                  <div className="w-full flex justify-center mb-3 md:mb-4 mt-1">
                    <div
                      className={`relative rounded-full overflow-hidden bg-slate-50 border-[4px] border-slate-100 shadow-md transition-all duration-500
                      ${isActive ? "w-24 h-24 sm:w-26 sm:h-26 md:w-28 h-28 ring-4 ring-red-500/10" : "w-18 h-18 sm:w-20 sm:h-20"}`}
                    >
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => { e.target.src = DEFAULT_IMAGES[0]; e.target.onerror = null; }}
                      />
                    </div>
                  </div>

                  <div className="text-center flex-grow flex flex-col justify-between">
                    <div>
                      <h3
                        className={`text-base sm:text-lg md:text-xl font-black tracking-wide uppercase ${isActive ? "text-red-600" : "text-slate-800"}`}
                      >
                        {pkg.title}
                      </h3>
                      <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5">
                        {pkg.meals}
                      </p>

                      <div className="w-8 h-[2px] bg-red-500/20 mx-auto my-2" />

                      <div className="my-1 flex items-baseline justify-center">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                          {pkg.price}
                        </span>
                        <span className="text-slate-400 font-bold text-[10px] sm:text-xs ml-0.5">
                          /mo
                        </span>
                      </div>

                      <div className="my-3 overflow-hidden">
                        <ul className="space-y-2 text-left max-w-[150px] sm:max-w-[190px] mx-auto">
                          {visibleFeatures.map((feat) => (
                            <li
                              key={feat}
                              className="flex items-center text-slate-600 text-[11px] sm:text-xs font-semibold tracking-wide"
                            >
                              <div className="w-4 h-4 bg-red-500/10 rounded-full flex items-center justify-center mr-2.5 flex-shrink-0">
                                <svg
                                  className="w-2.5 h-2.5 text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={(e) => openFeaturesModal(e, pkg)}
                          className="mt-3.5 text-[10px] sm:text-xs font-black tracking-widest text-red-500 hover:text-red-600 transition-colors uppercase focus:outline-none block mx-auto underline decoration-dashed underline-offset-4"
                        >
                          View Full Features +
                        </button>
                      </div>
                    </div>

                    <button
                      disabled={isCurrentPlan}
                      className={`w-full py-3 sm:py-3.5 rounded-xl font-black text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 border focus:outline-none mt-2 shadow-sm ${isCurrentPlan ? "" : "cursor-pointer"}
                        ${
                          isCurrentPlan 
                            ? "bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed shadow-none opacity-80" 
                            : isActive
                              ? "bg-red-600 border-red-600 text-white shadow-red-500/20"
                              : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      onClick={() => openCheckoutModal(pkg)}
                    >
                      {isCurrentPlan ? "Current Plan" : "Choose Plan"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="hidden md:flex w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-800 font-black items-center justify-center shadow-lg hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 z-40 focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* ================= BUILD YOUR OWN PACKAGE BOX ================= */}
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 relative z-30 flex-shrink-0 mt-6">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-6 sm:p-7 md:p-8 shadow-[0_25px_50px_-10px_rgba(220,38,38,0.25)] border border-red-400/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0 backdrop-blur-sm">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide">
                BUILD YOUR OWN PACKAGE
              </h3>
              <p className="text-red-50/80 mt-1 text-[10px] sm:text-xs font-semibold">
                Customize calories, proteins, meal count, and delivery schedule.
              </p>
            </div>
          </div>

          <button
            className="relative z-10 w-full md:w-auto bg-white text-slate-950 font-black text-[10px] sm:text-xs tracking-widest uppercase px-7 sm:px-9 py-3.5 rounded-xl shadow-md transition-all duration-300 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-1.5 group whitespace-nowrap focus:outline-none cursor-pointer"
            onClick={() => setIsPopupOpen(true)}
          >
            Customize Now
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* ================= FULL PACKAGE FEATURE DETAILS MODAL ================= */}
      <AnimatePresence>
        {featureModalData && (
          <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFeatureModalData(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl z-10 p-6 sm:p-8 border border-slate-100 pointer-events-auto"
            >
              <button
                onClick={() => setFeatureModalData(null)}
                className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors focus:outline-none shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-4 border-slate-50 shadow-md">
                  <img
                    src={featureModalData.image}
                    alt={featureModalData.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = DEFAULT_IMAGES[0]; e.target.onerror = null; }}
                  />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide">
                  {featureModalData.title} Plan
                </h3>
                <p className="text-red-600 font-extrabold text-sm uppercase tracking-wider mt-0.5">
                  {featureModalData.meals} • {featureModalData.price}/mo
                </p>
              </div>

              <div className="w-full h-[1px] bg-slate-100 mb-5" />

              <h4 className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-3 text-left">
                Included Premium Features
              </h4>
              <ul className="space-y-3 text-left mb-6">
                {featureModalData.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center text-slate-700 text-xs sm:text-sm font-semibold tracking-wide"
                  >
                    <div className="w-5 h-5 bg-red-500/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setFeatureModalData(null)}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-xl shadow-md transition-all focus:outline-none"
              >
                Got It, Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= VIEW ALL PACKAGES MODAL OVERLAY ================= */}
      <AnimatePresence>
        {isViewAllOpen && (
          <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewAllOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl z-10 p-6 md:p-10 max-h-[85vh] overflow-y-auto pointer-events-auto border border-slate-100"
            >
              <button
                onClick={() => setIsViewAllOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors focus:outline-none shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="mb-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  All Meal Packages
                </h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-1.5">
                  Browse and select your perfect health subscription bundle
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {packages.map((pkg, index) => {
                  const isCurrentPlan = activeSubscriptions.some(sub => sub.package?._id === pkg._id || sub.mealSize === pkg.name);
                  return (
                  <div
                    key={pkg._id}
                    className="bg-slate-50/70 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    {pkg.popular && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white font-black text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-inner border-2 border-white flex-shrink-0">
                          <img
                            src={pkg.image}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = DEFAULT_IMAGES[0]; e.target.onerror = null; }}
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-base tracking-wide uppercase">
                            {pkg.title}
                          </h4>
                          <p className="text-slate-400 font-bold text-[10px] uppercase mt-0.5">
                            {pkg.meals}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-2xl font-black text-slate-900">
                          {pkg.price}
                        </span>
                        <span className="text-slate-400 font-bold text-xs">
                          /mo
                        </span>
                      </div>

                      <ul className="space-y-1.5 mb-2">
                        {pkg.features.slice(0, 4).map((feat) => (
                          <li
                            key={feat}
                            className="flex items-center text-slate-600 text-xs font-semibold tracking-wide"
                          >
                            <div className="w-3.5 h-3.5 bg-red-500/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                              <svg
                                className="w-2 h-2 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      disabled={isCurrentPlan}
                      onClick={() => handleChoosePlanInModal(index)}
                      className={`w-full py-2.5 mt-4 rounded-xl font-black text-[11px] tracking-widest uppercase shadow-sm transition-all focus:outline-none ${isCurrentPlan ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                    >
                      {isCurrentPlan ? "Current Plan" : "Choose Plan"}
                    </button>
                  </div>
                )})}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= CUSTOMIZE POPUP LEAD MODAL ================= */}
      <AnimatePresence>
        {isPopupOpen && (
          <CreatePackage isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
        )}
      </AnimatePresence>

      {/* ================= SHARED CHECKOUT FLOW MODAL ================= */}
      <CheckoutFlowModal
        isOpen={!!checkoutPlan || new URLSearchParams(location.search).get("payment_success") === "true"}
        onClose={closeCheckoutModal}
        mode="packages"
        planId={checkoutPlan?._id}
      />
    </section>
  );
}
