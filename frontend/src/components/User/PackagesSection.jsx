import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreatePackage from "../../pages/User/CreatePackage";
import { checkServiceAvailability } from "../../services/vendor.service";
// Aapki service file se function import karein
// Path ko apne folder structure ke according check kar lein (e.g., "../../services/packageService")
import { getActivePackages } from "../../services/package.service";
import { sendOtp, verifyOtp } from "../../services/auth.service.js";

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
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    pincode: "",
    phone: "",
    otp: "",
    name: "",
    email: "",
    address: "",
  });
  const [checkoutError, setCheckoutError] = useState("");

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
    setCheckoutPlan(pkg);
    setCheckoutStep(1);
    setCheckoutError("");
    setCheckoutData({
      pincode: "",
      phone: "",
      otp: "",
      name: "",
      email: "",
      address: "",
    });
  };

  const closeCheckoutModal = () => {
    setCheckoutPlan(null);
    setCheckoutStep(1);
    setCheckoutError("");
  };

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();

    try {
      setCheckoutError("");

      const res = await checkServiceAvailability(checkoutData.pincode.trim());

      if (res.success) {
        setCheckoutStep(2);
      } else {
        setCheckoutError(res.message);
      }
    } catch (error) {
      setCheckoutError(
        error.response?.data?.message ||
          "Sorry! Service is not available in your area.",
      );
    }
  };

const handlePhoneSubmit = async (e) => {
  e.preventDefault();

  // 1. Phone number validation (Frontend boundary)
  if (!checkoutData.phone || checkoutData.phone.length !== 10) {
    setCheckoutError("Please enter a valid 10 digit phone number.");
    return;
  }

    try {
      setCheckoutError("");

    // Backend ko exact wahi object chahiye jo usne req.body me manga hai
    const res = await sendOtp({
      phone: checkoutData.phone.trim(),
    });

    // Backend return karta hai: { success: true, message: "OTP sent successfully" }
    if (res && res.success) {
      alert(res.message || "OTP Sent Successfully");
      setCheckoutStep(3); // Agle step (OTP Enter karne) par bhejein
    } else {
      setCheckoutError(res?.message || "Failed to send OTP.");
    }
 
  } catch (error) {
    console.error("Frontend Send OTP Error:", error);
    // Agar backend status(400) ya (500) dega toh axios catch me bhejega
    setCheckoutError(
      error.response?.data?.message || "Something went wrong. Failed to send OTP."
    );
  }
};

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!checkoutData.otp) {
      setCheckoutError("Please enter OTP.");
      return;
    }

    try {
      setCheckoutError("");

      // Backend me key check karo: const { phone, otp: enteredOtp } = req.body;
      // Isliye frontend se hum 'phone' aur 'otp' dono bhejenge
      const res = await verifyOtp({
        phone: checkoutData.phone.trim(),
        otp: checkoutData.otp.trim(),
      });

      // Backend return karta hai: { success: true, message: "OTP Verified successfully." }
      if (res && res.success) {
        alert(res.message || "OTP Verified Successfully");
        setCheckoutStep(4); // User details step par le jayein
      } else {
        setCheckoutError(res?.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Frontend Verify OTP Error:", error);
      setCheckoutError(
        error.response?.data?.message || "Invalid OTP or Server Error.",
      );
    }
  };

  const handleFinalDetailsSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep(5);
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
                      className={`w-full py-3 sm:py-3.5 rounded-xl font-black text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 border focus:outline-none mt-2 shadow-sm cursor-pointer
                        ${
                          isActive
                            ? "bg-red-600 border-red-600 text-white shadow-red-500/20"
                            : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      onClick={() => openCheckoutModal(pkg)}
                    >
                      Choose Plan
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
                {packages.map((pkg, index) => (
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
                      onClick={() => handleChoosePlanInModal(index)}
                      className="w-full py-2.5 mt-4 rounded-xl font-black text-[11px] tracking-widest uppercase bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all focus:outline-none"
                    >
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= CUSTOMIZE POPUP LEAD MODAL ================= */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            {popupStep === 1 ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-5xl min-h-[92vh] rounded-[2.5rem] shadow-2xl z-10 border border-slate-100 overflow-hidden pointer-events-auto flex flex-col justify-center items-center p-6"
              >
                <button
                  onClick={closePopup}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-20"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="w-full max-w-md mx-auto bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex flex-col space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                      Enter Details
                    </h3>
                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mt-1.5">
                      Please share your info to customize your meal plan
                    </p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-5">
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">
                        Area Pincode
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="110001"
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                      {leadError && (
                        <p className="text-red-500 text-xs font-semibold mt-2">
                          {leadError}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2 bg-red-600 text-white font-black text-xs tracking-widest uppercase py-4 rounded-xl shadow-md transition-all duration-300 hover:bg-red-700"
                    >
                      Continue to Customize →
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl z-10 border border-slate-100 max-h-[92vh] overflow-y-auto pointer-events-auto"
              >
                <CreatePackage onClose={closePopup} userData={formData} />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* ================= CHOOSE PLAN CHECKOUT STEPPER MODAL ================= */}
      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCheckoutModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl z-10 border border-slate-100 p-6 sm:p-8 pointer-events-auto flex flex-col justify-between max-h-[95vh] overflow-y-auto"
            >
              {checkoutStep !== 5 && (
                <button
                  onClick={closeCheckoutModal}
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
              )}

              {checkoutStep < 5 && (
                <div className="mb-4 text-left">
                  <span className="bg-red-50 text-red-600 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                    Plan: {checkoutPlan.title} ({checkoutPlan.price})
                  </span>
                </div>
              )}

              {checkoutError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
                  {checkoutError}
                </div>
              )}

              {/* STEP 1: PINCODE CHECK */}
              {checkoutStep === 1 && (
                <form onSubmit={handlePincodeSubmit} className="space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                      Check Availability
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      Please enter your delivery area pincode
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 144001"
                      value={checkoutData.pincode}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          pincode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-md"
                  >
                    Verify Area →
                  </button>
                </form>
              )}

              {/* STEP 2: PHONE NUMBER */}
              {checkoutStep === 2 && (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                      Great News! 🚚
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      We serve your area. Enter phone to continue.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Contact Number</label>
                    <input 
                      type="tel" required placeholder="Enter 10 digit mobile" maxLength="10"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-md"
                  >
                    Send Verification OTP →
                  </button>
                </form>
              )}

              {/* STEP 3: OTP VERIFICATION */}
              {checkoutStep === 3 && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                      Verify Mobile
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      We sent a code to +91 {checkoutData.phone}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 6 digit OTP code"
                      maxLength="6"
                      value={checkoutData.otp}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          otp: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg tracking-widest font-black text-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-md"
                  >
                    Verify Code & Pay
                  </button>
                </form>
              )}

              {/* STEP 4: SUCCESS & PERSONAL DETAILS */}
              {checkoutStep === 4 && (
                <form onSubmit={handleFinalDetailsSubmit} className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center mb-1">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-lg shadow-sm">
                      ✓
                    </div>
                    <h4 className="text-emerald-800 font-black text-sm uppercase tracking-wide">
                      Payment Successfully Submitted!
                    </h4>
                    <p className="text-emerald-600/95 font-medium text-[11px] mt-0.5">
                      Please enter your full details below to complete setting
                      up your profile.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 opacity-60">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500">
                        Pincode
                      </label>
                      <input
                        type="text"
                        disabled
                        value={checkoutData.pincode}
                        className="w-full px-3 py-2 bg-slate-100 border rounded-xl font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500">
                        Phone
                      </label>
                      <input
                        type="text"
                        disabled
                        value={checkoutData.phone}
                        className="w-full px-3 py-2 bg-slate-100 border rounded-xl font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={checkoutData.name}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={checkoutData.email}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Full Delivery Address
                      </label>
                      <textarea
                        required
                        placeholder="Flat/House No, Building, Street Name..."
                        rows="2"
                        value={checkoutData.address}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-red-500 resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-md"
                  >
                    Submit Onboarding Data →
                  </button>
                </form>
              )}

              {/* STEP 5: THANK YOU PAGE */}
              {checkoutStep === 5 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <span className="text-3xl animate-bounce">🎉</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      Thank You, {checkoutData.name}!
                    </h3>
                    <p className="text-red-600 text-xs font-black uppercase tracking-widest mt-1">
                      Your Subscription is Live
                    </p>
                  </div>
                  <p className="text-slate-500 font-semibold text-xs leading-relaxed max-w-sm mx-auto px-2">
                    We have mapped your{" "}
                    <span className="text-slate-800 font-extrabold">
                      {checkoutPlan.title}
                    </span>{" "}
                    plan bundle. A detailed configuration email containing
                    delivery calendars has been sent to{" "}
                    <span className="text-slate-800 font-bold break-all">
                      {checkoutData.email}
                    </span>
                    .
                  </p>
                  <div className="pt-3">
                    <button 
                      onClick={closeCheckoutModal}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs tracking-widest uppercase px-8 py-3 rounded-xl transition-all shadow-md"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
