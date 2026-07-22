import React, { useState } from "react";
import { Lock, Sparkles, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { sendOtp, verifyOtp } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PhoneInputPkg from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
const PhoneInput = PhoneInputPkg.default ? PhoneInputPkg.default : PhoneInputPkg;

export default function UserLogin({ isOpen, onClose }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // API payload expects phone with +
      await sendOtp({ phone: `+${phone}` });
      toast.success("OTP sent successfully!");
      setStep("otp");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await verifyOtp({ phone: `+${phone}`, otp, allowNoSubscription: true });
      if (res.success && res.user) {
        setUser(res.user);
        toast.success("Logged in successfully!");
        onClose();
        navigate("/");
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      {/* Header info */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 text-red-500 shadow-inner">
          <Sparkles size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          {step === "phone" ? "Verify Mobile" : "Enter Verification OTP"}
        </h2>
        <p className="text-slate-400 text-xs font-semibold mt-1.5 leading-relaxed">
          {step === "phone"
            ? "Enter your mobile number to receive a verification OTP."
            : `We sent a 6-digit OTP to your number ending in ***${phone.slice(-4)}.`}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600 text-center flex items-center justify-center gap-1.5">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block text-left">
              Mobile Number
            </label>
            <div className="relative text-left">
              <PhoneInput
                country={'in'}
                value={phone}
                onChange={(val) => setPhone(val)}
                inputClass="!w-full !px-4 !py-3.5 !bg-slate-50 !border !border-slate-200 !rounded-2xl !font-semibold !text-sm !text-slate-800 !pl-14 focus:!outline-none focus:!border-red-400 focus:!ring-2 focus:!ring-red-100 !transition-all"
                buttonClass="!bg-transparent !border-none !pl-2"
                containerClass="!w-full"
              />
            </div>
          </div>

          <Button type="submit" size="lg" loading={loading} className="font-black tracking-widest uppercase">
            {loading ? "Sending OTP..." : <>Get OTP <ArrowRight size={16} /></>}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block">
              One-Time Password (OTP)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all tracking-[0.2em]"
              />
            </div>
          </div>

          <Button type="submit" size="lg" loading={loading} className="font-black tracking-widest uppercase">
            {loading ? "Verifying..." : <>Verify &amp; Login <ArrowRight size={16} /></>}
          </Button>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => { setOtp(""); setStep("phone"); }}
              className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors"
            >
              <ArrowLeft size={13} /> Change Phone
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="text-red-600 text-xs font-bold hover:text-red-700 transition-colors"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
