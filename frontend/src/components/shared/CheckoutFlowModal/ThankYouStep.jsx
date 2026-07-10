import { motion } from "framer-motion";
import { FiCheckCircle, FiMail, FiMapPin } from "react-icons/fi";

/**
 * Final confirmation step shown after details are submitted.
 */
export default function ThankYouStep({ formData, onClose }) {
  return (
    <motion.div
      key="thankyou"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-6"
    >
      <FiCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4 drop-shadow-md" />
      <h1 className="text-2xl font-black text-red-600 tracking-tight mb-2">Thank You, {formData.name || "Friend"}!</h1>
      <p className="text-slate-600 text-sm font-medium mb-1">Your order has been placed successfully.</p>
      <p className="text-slate-400 text-xs mb-6">We're excited to fuel your journey to better health!</p>
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 mb-6">
        <div className="flex gap-2 items-center"><FiMail className="text-sm text-red-500" /><span className="text-xs font-semibold">{formData.email}</span></div>
        {formData.address && (
          <div className="flex gap-2 items-start"><FiMapPin className="text-sm text-red-500 mt-0.5" /><span className="text-xs font-semibold">{formData.address}</span></div>
        )}
      </div>
      <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs tracking-widest uppercase py-4 rounded-2xl transition-all shadow-lg">Go to Dashboard</button>
    </motion.div>
  );
}
