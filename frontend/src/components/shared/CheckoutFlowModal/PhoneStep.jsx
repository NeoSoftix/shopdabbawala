import { motion } from "framer-motion";
import { FiSmartphone } from "react-icons/fi";
import PhoneInputPkg from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SubmitBtn, ErrorMessage } from "./FormFields";

const PhoneInput = PhoneInputPkg.default ? PhoneInputPkg.default : PhoneInputPkg;

/**
 * Mobile number collection step (used by both modes, ahead of OTP).
 */
export default function PhoneStep({ phone, onPhoneChange, error, loading, onSubmit, onBack }) {
  return (
    <motion.form
      key="phone"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={onSubmit}
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
          onChange={onPhoneChange}
          inputClass="!w-full !px-4 !py-3.5 !bg-slate-50 !border !border-slate-200 !rounded-2xl !font-semibold !text-sm !text-slate-800 !pl-14 focus:!outline-none focus:!border-red-400 focus:!ring-2 focus:!ring-red-100 !transition-all"
          buttonClass="!bg-transparent !border-none !pl-2"
          containerClass="!w-full"
        />
      </div>
      <div className="mt-2">
        <ErrorMessage error={error} />
        <SubmitBtn label="Send OTP →" loading={loading} />
      </div>
      <button type="button" onClick={onBack} className="w-full text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors pt-2">← Go Back</button>
    </motion.form>
  );
}
