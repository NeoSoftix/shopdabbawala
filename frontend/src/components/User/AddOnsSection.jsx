import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Path ko apne folder structure ke according adjust karlein
import { getActiveAddOns } from "../../services/addOn.service";
import { checkServiceAvailability } from "../../services/vendor.service";
import { sendOtp, verifyOtp } from "../../services/auth.service";
import { createAddonCheckout } from "../../services/payment.service";

import { SectionLoader } from "../shared/Loader";
import CategoryTabs from "./AddOnsSection/CategoryTabs";
import AddOnsGrid from "./AddOnsSection/AddOnsGrid";
import CartToast from "./AddOnsSection/CartToast";
import CartFooterBar from "./AddOnsSection/CartFooterBar";
import CheckoutModal from "./AddOnsSection/CheckoutModal";
import {
  filterAddOnsByTab,
  getCartItemsCount,
  getTotalCartAmount,
  getCartItemNames,
} from "./AddOnsSection/addOnsUtils";

export default function AddonsSection() {
  const location = useLocation();
  const navigate = useNavigate();

  const [addonsData, setAddonsData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeTab, setActiveTab] = useState("All");
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MODAL & CHECKOUT STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Preview, 2: Pincode, 3: Phone, 4: OTP, 5: Redirecting
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const fetchActiveAddons = async () => {
      try {
        setLoading(true);
        const result = await getActiveAddOns();

        if (result.success && result.data) {
          setAddonsData(result.data);
          const dynamicCategories = result.data
            .map((item) => item.category)
            .filter((category) => category);

          const uniqueCategories = [
            "All",
            "Recommended",
            ...new Set(dynamicCategories),
          ];
          setCategories(uniqueCategories);
        } else {
          setError(result.message || "Failed to fetch active add-ons");
        }
      } catch (err) {
        console.error("Error fetching add-ons via service:", err);
        setError("Something went wrong while loading add-ons.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAddons();
  }, []);

  // If the browser returns here after a Stripe redirect (shouldn't normally
  // happen since checkout success_url points to the shared /payment-success
  // page), just send the user there instead of showing a stale cart/modal.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("payment_success") === "true") {
      const sessionId = params.get("session_id");
      navigate(`/payment-success${sessionId ? `?session_id=${sessionId}` : ""}`, { replace: true });
    }
  }, [location.search, navigate]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item._id]: (prev[item._id] || 0) + 1 }));
    setToastMessage(`${item.name} added`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const updatedCart = { ...prev };
        delete updatedCart[id];
        return updatedCart;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const clearAllCart = () => {
    setCart({});
  };

  // --- MODAL HANDLERS ---
  const handleOpenCheckout = () => {
    setModalStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setPincode("");
    setPincodeError("");
    setPhone("");
    setDetailsError("");
    setOtp("");
    setOtpError("");
  };

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    setPincodeError("");

    if (pincode.length !== 6) {
      setPincodeError("Please enter a valid 6-digit pincode.");
      return;
    }

    setPincodeLoading(true);
    try {
      const res = await checkServiceAvailability(pincode);
      if (res && res.success) {
        setModalStep(3);
      } else {
        setPincodeError(res?.message || "Sorry, we do not deliver to this area.");
      }
    } catch (err) {
      setPincodeError(err.response?.data?.message || "Sorry, we do not deliver to this area.");
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setDetailsError("");

    if (phone.length !== 10) {
      setDetailsError("Please enter a valid 10-digit phone number.");
      return;
    }

    setDetailsLoading(true);
    try {
      const res = await sendOtp({ phone: `+91${phone}` });
      if (res && res.success) {
        setModalStep(4);
      } else {
        setDetailsError(res?.message || "Failed to send OTP.");
      }
    } catch (err) {
      setDetailsError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setOtpError("Please enter the OTP.");
      return;
    }

    setOtpError("");
    setOtpLoading(true);
    try {
      const verifyRes = await verifyOtp({ phone: `+91${phone}`, otp: otp.trim() });
      if (!(verifyRes && verifyRes.success)) {
        setOtpError(verifyRes?.message || "Invalid OTP.");
        return;
      }

      const items = Object.entries(cart).map(([id, quantity]) => ({ id, quantity }));
      const checkoutRes = await createAddonCheckout(items);

      if (checkoutRes && checkoutRes.checkoutUrl) {
        setModalStep(5);
        window.location.href = checkoutRes.checkoutUrl;
      } else {
        setOtpError(checkoutRes?.message || "Could not start payment session.");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setOtpLoading(false);
    }
  };

  const filteredItems = filterAddOnsByTab(addonsData, activeTab);
  const cartItemsCount = getCartItemsCount(cart);
  const totalCartAmount = getTotalCartAmount(cart, addonsData);
  const cartItemNames = getCartItemNames(cart, addonsData);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <SectionLoader text="Loading add-ons..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF9] p-4 text-center">
        <div className="text-red-600 font-bold max-w-md">{error}</div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-[#FDFBF9] p-[15px] sm:p-8 lg:px-16 font-sans select-none pb-36">
      {/* Header Info Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div className="text-left">
          <span className="text-xs font-black tracking-widest text-red-600 uppercase block mb-1">
            CUSTOMIZE YOUR MEAL
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Add-<span className="text-red-600">ons</span>
          </h2>
          <p className="text-gray-400 font-medium text-xs sm:text-sm mt-2">
            Add extra items and make your meal perfect.
          </p>
        </div>

        {/* Dynamic Categories Tab */}
        <CategoryTabs categories={categories} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Dynamic Main Addons Grid Area */}
      <AddOnsGrid
        items={filteredItems}
        cart={cart}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAdd={addToCart}
        onQuantityChange={updateQuantity}
      />

      {/* Floating Toast Alert */}
      <CartToast message={toastMessage} />

      {/* BOTTOM BILLING FOOTER FLOATING CARD BAR */}
      <CartFooterBar
        cartItemsCount={cartItemsCount}
        cartItemNames={cartItemNames}
        totalCartAmount={totalCartAmount}
        onClearCart={clearAllCart}
        onCheckout={handleOpenCheckout}
      />

      {/* --- CHECKOUT SYSTEM MULTI-STEP MODAL --- */}
      <CheckoutModal
        isOpen={isModalOpen}
        step={modalStep}
        onClose={handleCloseModal}
        cart={cart}
        addonsData={addonsData}
        totalCartAmount={totalCartAmount}
        onConfirmPreview={() => setModalStep(2)}
        pincode={pincode}
        onPincodeChange={setPincode}
        pincodeError={pincodeError}
        pincodeLoading={pincodeLoading}
        onPincodeSubmit={handlePincodeSubmit}
        phone={phone}
        onPhoneChange={setPhone}
        detailsError={detailsError}
        detailsLoading={detailsLoading}
        onPhoneSubmit={handlePhoneSubmit}
        otp={otp}
        onOtpChange={setOtp}
        otpError={otpError}
        otpLoading={otpLoading}
        onOtpVerify={handleOtpVerify}
      />
    </section>
  );
}
