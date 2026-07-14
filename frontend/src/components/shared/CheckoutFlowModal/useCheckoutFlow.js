import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { checkServiceAvailability } from "../../../services/vendor.service";
import { sendOtp, verifyOtp } from "../../../services/auth.service";
import { createPackageCheckout, createAddonCheckout, saveCheckoutDetails, getSessionDetails } from "../../../services/payment.service";
import { createSubscription } from "../../../services/subscription.service";
import { useAuth } from "../../../context/AuthContext";

/**
 * All state + step-transition / API-calling logic for CheckoutFlowModal.
 * mode="packages" → Pincode → Phone → OTP → Payment (Redirect)
 *                   → (Returns with ?payment_success) → Details → Thank You
 *
 * mode="create"   → Pincode → Customization(Children) → Phone → OTP → Payment (Redirect)
 *                   → (Returns with ?payment_success) → Details → Thank You
 *
 * mode="addons"   → Cart Preview → Pincode → Phone → OTP → Payment (Redirect)
 *                   Logged-in users skip Phone+OTP, same as "packages".
 */
export default function useCheckoutFlow({
  isOpen,
  onClose,
  mode,
  planId,
  subscriptionData,
  cart,
  isCustomizationValid,
  customizationErrorMsg,
  onCustomizationSubmit,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const paymentSuccess = searchParams.get("payment_success");
  const sessionId = searchParams.get("session_id");

  const [step, setStep] = useState(1);
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", address: "", pincode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Flat {id, quantity} list built from the addons cart map, used by mode="addons".
  const cartItems = Object.entries(cart || {}).map(([id, quantity]) => ({ id, quantity }));

  const redirectToPayment = async () => {
    setLoading(true);
    try {
      const successUrl = `${window.location.origin}${location.pathname}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;
      let checkoutRes;
      if (mode === "packages") {
        checkoutRes = await createPackageCheckout(planId);
      } else if (mode === "addons") {
        checkoutRes = await createAddonCheckout(cartItems);
      } else {
        checkoutRes = await createSubscription({ ...subscriptionData, successUrl });
      }

      if (checkoutRes && checkoutRes.checkoutUrl) {
        window.location.href = checkoutRes.checkoutUrl;
      } else {
        setError("Could not start payment session.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Prefill details from logged-in user profile if available
  useEffect(() => {
    if (user && isOpen) {
      if (user.phone) {
        let cleanPhone = user.phone.replace(/\D/g, "");
        if (cleanPhone.length === 10) {
          cleanPhone = "91" + cleanPhone;
        }
        setPhone(cleanPhone);
      }
      if (user.pincode) {
        setPincode(user.pincode);
      }
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        address: user.address || prev.address,
        pincode: user.pincode || prev.pincode,
      }));
    }
  }, [user, isOpen]);

  // If redirected back from Stripe
  useEffect(() => {
    if (paymentSuccess === "true" && isOpen) {
      setStep(mode === "packages" ? 4 : 5); // Jump to Details step
      if (sessionId) {
        getSessionDetails(sessionId).then(res => {
          if (res.success && res.customer_details) {
            setFormData(prev => ({
              ...prev,
              name: prev.name || res.customer_details.name || "",
              email: prev.email || res.customer_details.email || "",
            }));
          }
        }).catch(err => console.error("Failed to fetch session", err));
      }
    }
  }, [paymentSuccess, isOpen, mode, sessionId]);

  // Logged-in users never see the Mobile/OTP steps (they skip straight to
  // payment - see handlePincodeSubmit/handleCustomizationNext below), so the
  // progress bar shouldn't list them either, otherwise they'd render as
  // "completed" checkmarks the user never actually stepped through.
  const stepLabels = user
    ? (mode === "packages" ? ["Area", "Details"]
        : mode === "addons" ? ["Cart", "Area"]
        : ["Area", "Customize", "Details"])
    : (mode === "packages"
        ? ["Area", "Mobile", "OTP", "Details"]
        : mode === "addons"
          ? ["Cart", "Area", "Mobile", "OTP"]
          : ["Area", "Customize", "Mobile", "OTP", "Details"]);

  // Maps the real `step` number (which always accounts for every possible
  // step, guest or not) to an index in the possibly-compacted stepLabels
  // above, so the indicator stays in sync for logged-in users too.
  const stepIndexMaps = {
    packages: { guest: { 1: 0, 2: 1, 3: 2, 4: 3 }, user: { 1: 0, 4: 1 } },
    create: { guest: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 }, user: { 1: 0, 2: 1, 5: 2 } },
    addons: { guest: { 1: 0, 2: 1, 3: 2, 4: 3 }, user: { 1: 0, 2: 1 } },
  };
  const stepIndexMap = stepIndexMaps[mode][user ? "user" : "guest"];
  const currentStepIndex = stepIndexMap[step] ?? step - 1;

  const reset = () => {
    setStep(1);
    setPincode("");
    setPhone("");
    setOtp("");
    setError("");
    setLoading(false);
    setFormData({ name: "", email: "", address: "" });
    if (paymentSuccess) {
      searchParams.delete("payment_success");
      searchParams.delete("session_id");
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[A-Za-z0-9]{6}$/.test(pincode.trim())) {
      setError("Please enter a valid 6-character pincode.");
      return;
    }

    setLoading(true);
    try {
      // No category is known yet at checkout time (that's chosen later,
      // per-day, when the customer actually schedules meals) - just check
      // whether any active vendor covers this pincode at all.
      const res = await checkServiceAvailability(pincode.trim());
      if (res && res.success) {
        toast.success(" Great news! We deliver to your area.");
        // Logged-in users skip Mobile + OTP verification entirely and go
        // straight to payment; guests still verify phone via OTP.
        localStorage.setItem("pincode", pincode.trim());
        if ((mode === "packages" || mode === "addons") && user) {
          await redirectToPayment();
        } else {
          setStep(mode === "addons" ? 3 : 2);
        }

      } else {
        setError(res?.message || "Sorry! Service not available in your area.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sorry! Service not available in your area.");
    } finally {
      setLoading(false);
    }
  };

  // mode="addons" only: Step 1 (Cart Preview) → Step 2 (Pincode).
  const handlePreviewConfirm = () => {
    setStep(2);
  };

  const handleCustomizationNext = async (e) => {
    e.preventDefault();
    if (!isCustomizationValid) {
      setError(customizationErrorMsg);
      return;
    }
    setError("");
    if (onCustomizationSubmit) onCustomizationSubmit();

    // Logged-in users skip Mobile + OTP verification entirely and go
    // straight to payment; guests still verify phone via OTP.
    if (user) {
      await redirectToPayment();
    } else {
      setStep(3);
    }
  };

  const handlePhoneChange = (val) => {
    // react-phone-input-2 returns just the digits with country code, e.g. "919876543210"
    setPhone(val);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await sendOtp({ phone: `+${phone}` });
      if (res && res.success) {
        toast.success("OTP sent to your mobile!");
        setStep(mode === "packages" ? 3 : 4);
      } else {
        setError(res?.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await sendOtp({ phone: `+${phone}` });
      if (res && res.success) {
        toast.success("OTP resent to your mobile!");
      } else {
        setError(res?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const verifyRes = await verifyOtp({ phone: `+${phone}`, otp: otp.trim(), allowNoSubscription: true });
      if (verifyRes && verifyRes.success) {
        toast.success("Mobile verified! Redirecting to payment...");

        // Pass success URL so it comes back to the same page
        const successUrl = `${window.location.origin}${location.pathname}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;

        let checkoutRes;
        if (mode === "packages") {
          // You may need to update this backend service to accept a successUrl override if supported,
          // or handle it in backend via referer.
          checkoutRes = await createPackageCheckout(planId);
        } else if (mode === "addons") {
          checkoutRes = await createAddonCheckout(cartItems);
        } else {
          checkoutRes = await createSubscription({ ...subscriptionData, successUrl });
        }

        if (checkoutRes && checkoutRes.checkoutUrl) {
          window.location.href = checkoutRes.checkoutUrl;
        } else {
          setError("Could not start payment session.");
        }
      } else {
        setError(verifyRes?.message || "Invalid OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill all details.");
      return;
    }
    setLoading(true);
    try {
      if (sessionId) {
        await saveCheckoutDetails({ ...formData, sessionId });
      }
      toast.success("Your details saved! Welcome aboard!");
      setStep(mode === "packages" ? 5 : 6); // Move to Thank you
    } catch (err) {
      setError("Failed to save details.");
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    pincode,
    setPincode,
    phone,
    otp,
    setOtp,
    formData,
    setFormData,
    error,
    setError,
    loading,
    sessionId,
    stepLabels,
    currentStepIndex,
    handleClose,
    handlePincodeSubmit,
    handlePreviewConfirm,
    handleCustomizationNext,
    handlePhoneChange,
    handlePhoneSubmit,
    handleResendOtp,
    handleOtpSubmit,
    handleDetailsSubmit,
  };
}
