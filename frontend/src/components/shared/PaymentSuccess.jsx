import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  Info,
  Package,
  PartyPopper,
  Star,
  Heart,
  User,
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { saveCheckoutDetails, getSessionDetails } from "../../services/payment.service";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const { user, setUser } = useAuth();

  // innerStep: "success" → "details" → "thankyou"
  const [innerStep, setInnerStep] = useState("success");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", pincode: localStorage.getItem("pincode") || "" });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        pincode: user.pincode || prev.pincode,
      }));
    }

    if (sessionId) {
      getSessionDetails(sessionId)
        .then(res => {
          if (res.success && res.customer_details) {
            setFormData(prev => ({
              ...prev,
              name: prev.name || res.customer_details.name || "",
              email: prev.email || res.customer_details.email || "",
              phone: prev.phone || res.customer_details.phone || "",

            }));
          }
        })
        .catch(err => console.error("Failed to fetch session", err));
    }
  }, [sessionId, user]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (sessionId) {
        const res = await saveCheckoutDetails({ ...formData, sessionId });
        // if (res && res.stripeSubscriptionScheduleId) {
        //   alert(`Stripe Subscription Schedule ID: ${res.stripeSubscriptionScheduleId}`);
        // }
      }

      if (setUser) {
        setUser(prev => prev ? ({ ...prev, name: formData.name, phone: formData.phone, address: formData.address }) : null);
      }

      toast.success("Your details saved! Welcome aboard!");
      setTimeout(() => setInnerStep("thankyou"), 600);
    } catch (err) {
      toast.error("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center p-4 antialiased">
      <AnimatePresence mode="wait">

        {/* ── SUCCESS STEP ── */}
        {innerStep === "success" && (
          <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-50 rounded-full opacity-60" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-teal-50 rounded-full opacity-60" />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100 relative z-10"
            >
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>

            <div className="relative z-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Payment Successful!
              </h1>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-2">
                Your payment has been processed successfully.
              </p>
              {/* Removed session ID display as requested */}

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-emerald-800 text-xs font-semibold leading-relaxed">
                    Please provide your delivery details so we can set up your meal subscription and start delivering fresh meals to your doorstep!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInnerStep("details")}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-xs tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                Fill Delivery Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── DETAILS FORM STEP ── */}
        {innerStep === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-400 to-red-600" />
            <div className="p-8">
              <div className="text-center mb-7">
                <Package className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Delivery Details</h2>
                <p className="text-slate-400 text-xs font-medium mt-1.5">
                  Tell us where to deliver your fresh meals!
                </p>
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    required
                    placeholder="123 Health Street, Fitness City..."
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                  />
                </div>
                <div>
                  <div>

                    <input
                      type="hidden"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 text-white font-black text-[11px] tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg shadow-red-100 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit &amp; Complete Order <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── THANK YOU STEP ── */}
        {innerStep === "thankyou" && (
          <motion.div
            key="thankyou"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-600" />

            {/* Floating decorative elements */}
            <div className="absolute top-8 left-10 w-2 h-2 bg-red-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0s" }} />
            <Star className="absolute top-14 left-16 w-4 h-4 text-red-300 opacity-50 fill-current animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="absolute top-6 right-16 w-2 h-2 bg-orange-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0.4s" }} />
            <Heart className="absolute top-12 right-6 w-4 h-4 text-red-300 opacity-50 fill-current animate-bounce" style={{ animationDelay: "0.1s" }} />

            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="w-16 h-16 mx-auto mb-6 relative z-10 flex items-center justify-center rounded-full bg-red-50 text-red-600"
            >
              <PartyPopper className="w-8 h-8" />
            </motion.div>

            <div className="relative z-10">
              <h1 className="text-3xl font-black text-red-600 mb-2 tracking-tight">
                Thank You, {formData.name || "Friend"}!
              </h1>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-1">
                Your order has been placed successfully.
              </p>
              <p className="text-slate-400 text-xs font-medium mb-6">
                We're excited to fuel your journey to better health!
              </p>

              {/* Confirmation info */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 text-left space-y-2.5">
                {formData.name && (
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{formData.name}</span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{formData.email}</span>
                  </div>
                )}
                {formData.address && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-700">{formData.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 pt-1 border-t border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-700">Confirmation email sent!</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-xs tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule Your Meals
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}