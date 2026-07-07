import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { checkServiceAvailability } from "../../services/vendor.service";
import { sendOtp, verifyOtp } from "../../services/auth.service";
import { createPackageCheckout, saveCheckoutDetails, getSessionDetails } from "../../services/payment.service";
import { createSubscription } from "../../services/subscription.service";
import { updateCustomerProfile } from "../../services/customer.service";
import { useAuth } from "../../context/AuthContext";
import { FiMapPin, FiSmartphone, FiShield, FiPackage, FiCheckCircle, FiX, FiLoader, FiMail } from "react-icons/fi";
import PhoneInputPkg from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const PhoneInput = PhoneInputPkg.default ? PhoneInputPkg.default : PhoneInputPkg;

const InputField = ({ label, type = "text", placeholder, value, onChange, maxLength, extraClass = "" }) => (
  <div>
    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
      {label}
    </label>
    <input
      type={type}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all ${extraClass}`}
    />
  </div>
);

const SubmitBtn = ({ label, disabled: isDisabled, loading }) => (
  <button
    type="submit"
    disabled={isDisabled || loading}
    className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 text-white font-black text-[11px] tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg shadow-red-100 mt-2"
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <FiLoader className="w-4 h-4 animate-spin" />
        Please wait...
      </span>
    ) : label}
  </button>
);

/**
 * Shared Checkout Flow Modal
 * mode="packages" → Pincode → Phone → OTP → Payment (Redirect) 
 *                   → (Returns with ?payment_success) → Details → Thank You
 * 
 * mode="create"   → Pincode → Customization(Children) → Phone → OTP → Payment (Redirect)
 *                   → (Returns with ?payment_success) → Details → Thank You
 */
export default function CheckoutFlowModal({
  isOpen,
  onClose,
  mode = "packages",
  planId,
  subscriptionData, 
  isCustomizationValid = true,
  customizationErrorMsg = "Please complete your plan configuration.",
  onCustomizationSubmit,
  children,
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
        setStep(2);
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
    setStep(3);
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
        await redirectToPayment();
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



  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative bg-white w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh] ${
              mode === "create" && step === 2 ? "max-w-4xl" : "max-w-md"
            }`}
          >
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-400 to-red-600 shrink-0" />

            <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar">
              {/* Close Button */}
              {step !== (mode === "packages" ? 5 : 6) && (
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 w-8 h-8 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center transition-colors z-20"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}

              {/* Steps Indicator (Hide on Thank You) */}
              {step < (mode === "packages" ? 5 : 6) && (
                <div className="flex items-center justify-center gap-1 mb-6 mt-1">
                  {stepLabels.map((label, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black transition-all duration-300 ${
                          i < currentStepIndex
                            ? "bg-emerald-500 text-white"
                            : i === currentStepIndex
                            ? "bg-red-600 text-white ring-4 ring-red-100"
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {i < currentStepIndex ? "✓" : i + 1}
                        </div>
                        <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wide mt-1 whitespace-nowrap ${i === currentStepIndex ? "text-red-600" : "text-slate-400"}`}>
                          {label}
                        </span>
                      </div>
                      {i < stepLabels.length - 1 && (
                        <div className={`w-4 sm:w-6 lg:w-8 h-0.5 mb-3 mx-1 sm:mx-1.5 rounded-full transition-all duration-300 ${i < currentStepIndex ? "bg-emerald-400" : "bg-slate-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}


              <AnimatePresence mode="wait">
                {/* ── STEP 1: PINCODE ── */}
                {step === 1 && (
                  <motion.form
                    key="pincode"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handlePincodeSubmit}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <FiMapPin className="text-4xl text-red-500 mx-auto mb-3 drop-shadow-sm" />
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Check Area</h3>
                      <p className="text-slate-400 text-xs font-medium">Verify if we deliver to your pincode</p>
                    </div>
                    <InputField label="Pincode" placeholder="e.g. 144001" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                    <div className="mt-2">
                      {error && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
                          <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                      <SubmitBtn label="Continue →" loading={loading} />
                    </div>
                  </motion.form>
                )}

                {/* ── STEP 2: CUSTOMIZE (Create mode only) ── */}
                {mode === "create" && step === 2 && (
                  <motion.form
                    key="customization"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleCustomizationNext}
                    className="flex flex-col h-full"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Configure Your Plan</h3>
                      <p className="text-slate-400 text-xs font-medium">Select your meals, preferences, and schedule</p>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto px-1 pb-4">
                      {children}
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-100 shrink-0">
                      {error && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
                          <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                      <SubmitBtn label="Proceed to Phone Verification →" loading={loading} />
                    </div>
                    <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="w-full text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors pt-2">← Go Back</button>
                  </motion.form>
                )}

                {/* ── STEP: PHONE ── */}
                {((mode === "packages" && step === 2) || (mode === "create" && step === 3)) && (
                  <motion.form
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handlePhoneSubmit}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <FiSmartphone className="text-4xl text-red-500 mx-auto mb-3 drop-shadow-sm" />
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Enter Mobile</h3>
                      <p className="text-slate-400 text-xs font-medium">We'll send you an OTP to verify</p>
                    </div>
                    <div className="text-left">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">Mobile Number</label>
                      <PhoneInput
                        country={'in'}
                        value={phone}
                        onChange={handlePhoneChange}
                        inputClass="!w-full !px-4 !py-3.5 !bg-slate-50 !border !border-slate-200 !rounded-2xl !font-semibold !text-sm !text-slate-800 !pl-14 focus:!outline-none focus:!border-red-400 focus:!ring-2 focus:!ring-red-100 !transition-all"
                        buttonClass="!bg-transparent !border-none !pl-2"
                        containerClass="!w-full"
                      />
                    </div>
                    <div className="mt-2">
                      {error && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
                          <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                      <SubmitBtn label="Send OTP →" loading={loading} />
                    </div>
                    <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className="w-full text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors pt-2">← Go Back</button>
                  </motion.form>
                )}

                {/* ── STEP: OTP ── */}
                {((mode === "packages" && step === 3) || (mode === "create" && step === 4)) && (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleOtpSubmit}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <FiShield className="text-4xl text-red-500 mx-auto mb-3 drop-shadow-sm" />
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Verify Mobile</h3>
                      <p className="text-slate-400 text-xs font-medium">OTP sent to <span className="font-bold">{phone}</span></p>
                    </div>
                    <InputField label="Enter OTP" placeholder="• • • • • •" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} extraClass="text-center text-xl tracking-[0.4em] font-black" />
                    <div className="mt-2">
                      {error && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
                          <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                      <SubmitBtn label="Verify & Pay →" loading={loading} />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <button type="button" onClick={() => { setOtp(""); setError(""); setStep(step - 1); }} className="text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors">← Go Back</button>
                      <button type="button" onClick={handleResendOtp} disabled={loading} className="text-red-600 text-xs font-bold hover:text-red-700 transition-colors">Resend OTP</button>
                    </div>
                  </motion.form>
                )}

                {/* ── STEP: DETAILS (Post-Payment) ── */}
                {((mode === "packages" && step === 4) || (mode === "create" && step === 5)) && (
                  <motion.form
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleDetailsSubmit}
                    className="space-y-3"
                  >
                    <div className="text-center mb-5">
                      <FiPackage className="text-4xl text-red-500 mx-auto mb-3 drop-shadow-sm" />
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Delivery Details</h3>
                      <p className="text-slate-400 text-xs font-medium">Tell us where to deliver your fresh meals!</p>
                      {sessionId && <div className="mt-2 text-[10px] text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">Payment Successful</div>}
                    </div>
                    <InputField label="Full Name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <InputField label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <InputField label="Delivery Address" placeholder="123 Health Street" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    <InputField label="Pincode" placeholder="e.g. 144001" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
                    <div className="mt-2">
                      {error && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
                          <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                      <SubmitBtn label="Submit Details →" loading={loading} />
                    </div>
                  </motion.form>
                )}

                {/* ── STEP: THANK YOU ── */}
                {((mode === "packages" && step === 5) || (mode === "create" && step === 6)) && (
                  <motion.div
                    key="thankyou"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-6"
                  >
                    <FiCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4 drop-shadow-md" />
                    <h1 className="text-2xl font-black text-red-600 tracking-tight mb-2">Thank You, {formData.name || "Friend"}!</h1>
                    <p className="text-slate-600 text-sm font-medium mb-1">Your order has been placed successfully.</p>
                    <p className="text-slate-400 text-xs mb-6">We're excited to fuel your journey to better health! 🌿</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 mb-6">
                      <div className="flex gap-2 items-center"><FiMail className="text-sm text-red-500" /><span className="text-xs font-semibold">{formData.email}</span></div>
                      {formData.address && (
                        <div className="flex gap-2 items-start"><FiMapPin className="text-sm text-red-500 mt-0.5" /><span className="text-xs font-semibold">{formData.address}</span></div>
                      )}
                    </div>
                    <button onClick={handleClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg">Go to Dashboard</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
