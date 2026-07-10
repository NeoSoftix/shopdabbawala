import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";
import { InputField, SubmitBtn, ErrorMessage } from "./FormFields";

/**
 * Post-payment delivery details step (name/email/address).
 */
export default function DetailsStep({ formData, setFormData, sessionId, error, loading, onSubmit }) {
  return (
    <motion.form
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={onSubmit}
      className="space-y-3"
    >
      <div className="text-center mb-5">
        <FiPackage className="text-4xl text-red-500 mx-auto mb-3 drop-shadow-sm" />
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Delivery Details</h3>
        <p className="text-slate-400 text-xs font-medium">Tell us where to deliver your fresh meals!</p>
        {sessionId && <div className="mt-2 text-[10px] text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">Payment Successful</div>}
      </div>
      <InputField label="Full Name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <InputField label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <InputField label="Delivery Address" placeholder="123 Health Street" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
      <div className="mt-2">
        <ErrorMessage error={error} />
        <SubmitBtn label="Submit Details" loading={loading} />
      </div>
    </motion.form>
  );
}
