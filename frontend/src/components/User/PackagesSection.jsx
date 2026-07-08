import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CreatePackage from "../../pages/User/CreatePackage";
import { checkServiceAvailability } from "../../services/vendor.service";
import { getActivePackages } from "../../services/package.service";
import CheckoutFlowModal from "../shared/CheckoutFlowModal";
import { useAuth } from "../../context/AuthContext";
import { getMySubscriptions } from "../../services/subscription.service";
import PackagesHeader from "./PackagesSection/PackagesHeader";
import PackageCarousel from "./PackagesSection/PackageCarousel";
import BuildYourOwnPackageBanner from "./PackagesSection/BuildYourOwnPackageBanner";
import PackageFeaturesModal from "./PackagesSection/PackageFeaturesModal";
import ViewAllPackagesModal from "./PackagesSection/ViewAllPackagesModal";
import { formatPackages, isCurrentPlan } from "./PackagesSection/packageUtils";

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
          setPackages(formatPackages(result.data));
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

  const handleNext = () => {
    if (packages.length === 0) return;
    setActive((prev) => (prev + 1) % packages.length);
  };

  const handlePrev = () => {
    if (packages.length === 0) return;
    setActive((prev) => (prev - 1 + packages.length) % packages.length);
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
    if (isCurrentPlan(pkg, activeSubscriptions)) {
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

      <PackagesHeader onViewAll={() => setIsViewAllOpen(true)} />

      <PackageCarousel
        packages={packages}
        active={active}
        setActive={setActive}
        activeSubscriptions={activeSubscriptions}
        onNext={handleNext}
        onPrev={handlePrev}
        onOpenFeatures={openFeaturesModal}
        onChoosePlan={openCheckoutModal}
      />

      <BuildYourOwnPackageBanner onCustomize={() => setIsPopupOpen(true)} />

      <PackageFeaturesModal
        pkg={featureModalData}
        onClose={() => setFeatureModalData(null)}
      />

      <ViewAllPackagesModal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        packages={packages}
        activeSubscriptions={activeSubscriptions}
        onChoosePlan={handleChoosePlanInModal}
      />

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
