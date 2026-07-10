import { motion } from "framer-motion";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import { InputField, SubmitBtn, ErrorMessage } from "./FormFields";

/**
 * OTP verification step, following PhoneStep in both modes.
 */
export default function OtpStep({ phone, otp, setOtp, error, loading, onSubmit, onBack, onResend }) {
  return (
    <motion.form
      key="otp"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <div className="text-center">
        <FiShield className="text-4xl text-red-500 mx-auto mb-3 drop-shadow-sm" />
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Verify Mobile</h3>
        <p className="text-slate-400 text-xs font-medium">OTP sent to <span className="font-bold">{phone}</span></p>
      </div>
      <InputField label="Enter OTP" placeholder="• • • • • •" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} extraClass="text-center text-xl tracking-[0.4em] font-black" />
      <div className="mt-2">
        <ErrorMessage error={error} />
        <SubmitBtn label="Verify & Pay" loading={loading} />
      </div>
      <div className="flex justify-between items-center pt-2">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors">
          <FiArrowLeft className="w-3.5 h-3.5" /> Go Back
        </button>
        <button type="button" onClick={onResend} disabled={loading} className="text-red-600 text-xs font-bold hover:text-red-700 transition-colors">Resend OTP</button>
      </div>
    </motion.form>
  );
}
