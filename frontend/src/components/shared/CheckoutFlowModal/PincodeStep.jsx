import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import { InputField, SubmitBtn, ErrorMessage } from "./FormFields";

/**
 * Step 1 (all modes): collect + validate the delivery pincode.
 */
export default function PincodeStep({ pincode, setPincode, error, loading, onSubmit }) {
  return (
    <motion.form
      key="pincode"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <div className="text-center">
        <FiMapPin className="text-4xl text-red-500 mx-auto mb-3 drop-shadow-sm" />
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Check Area</h3>
        <p className="text-slate-400 text-xs font-medium">Verify if we deliver to your pincode</p>
      </div>
      <InputField
        label="Pincode"
        placeholder="e.g. A1A 1A1"
        maxLength={7}
        value={pincode}
        onChange={(e) => {
          let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
          if (raw.length > 6) raw = raw.slice(0, 6);
          setPincode(raw.length > 3 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw);
        }}
      />
      <div className="mt-2">
        <ErrorMessage error={error} />
        <SubmitBtn label="Continue" loading={loading} />
      </div>
    </motion.form>
  );
}
