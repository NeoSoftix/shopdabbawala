import { FiMapPin } from "react-icons/fi";

// Read-only display of the delivery pincode already verified in the
// checkout flow's Area step, shown at the top of the package builder.
export default function PincodeCheckBar({ pincode }) {
  if (!pincode) return null;

  return (
    <div className="mb-3 px-2">
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-3">
        <FiMapPin className="text-red-500 text-lg shrink-0" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivering to</span>
        <span className="text-sm font-semibold text-gray-800">{pincode}</span>
      </div>
    </div>
  );
}
