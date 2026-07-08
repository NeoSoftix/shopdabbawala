import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { checkServiceAvailability } from "../../../services/vendor.service";
import { sendOtp, verifyOtp } from "../../../services/auth.service";
import { createPackageCheckout, saveCheckoutDetails, getSessionDetails } from "../../../services/payment.service";
import { createSubscription } from "../../../services/subscription.service";
import { useAuth } from "../../../context/AuthContext";

/**
 * All state + step-transition / API-calling logic for CheckoutFlowModal.
 * mode="packages" → Pincode → Phone → OTP → Payment (Redirect)
 *                   → (Returns with ?payment_success) → Details → Thank You
 *
 * mode="create"   → Pincode → Customization(Children) → Phone → OTP → Payment (Redirect)
 *                   → (Returns with ?payment_success) → Details → Thank You
 */
export default function useCheckoutFlow({
  isOpen,
  onClose,
  mode,
  planId,
  subscriptionData,
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

  const redirectToPayment = async () => {
    setLoading(true);
    try {
      const successUrl = `${window.location.origin}${location.pathname}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;
      let checkoutRes;
      if (mode === "packages") {
        checkoutRes = await createPackageCheckout(planId);
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

  const stepLabels =
    mode === "packages"
      ? ["Area", "Mobile", "OTP", "Details"]
      : ["Area", "Customize", "Mobile", "OTP", "Details"];

  const currentStepIndex = step - 1;

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
    setLoading(true);
    try {
      const res = await checkServiceAvailability(pincode.trim());
      if (res && res.success) {
        toast.success(" Great news! We deliver to your area.");
        // Logged-in users skip Mobile + OTP verification entirely and go
        // straight to payment; guests still verify phone via OTP.
        localStorage.setItem("pincode", pincode.trim());
        if (mode === "packages" && user) {
          await redirectToPayment();
        } else {
          setStep(2);
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
        toast.success("📱 OTP sent to your mobile!");
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
        toast.success("📱 OTP resent to your mobile!");
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
        toast.success("✅ Mobile verified! Redirecting to payment...");

        // Pass success URL so it comes back to the same page
        const successUrl = `${window.location.origin}${location.pathname}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;

        let checkoutRes;
        if (mode === "packages") {
          // You may need to update this backend service to accept a successUrl override if supported,
          // or handle it in backend via referer.
          checkoutRes = await createPackageCheckout(planId);
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
      toast.success("🙌 Your details saved! Welcome aboard!");
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
    handleCustomizationNext,
    handlePhoneChange,
    handlePhoneSubmit,
    handleResendOtp,
    handleOtpSubmit,
    handleDetailsSubmit,
  };
}
