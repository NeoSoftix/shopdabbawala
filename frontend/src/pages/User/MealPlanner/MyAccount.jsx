import { User } from "lucide-react";

const fieldRow = (label, value) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-black font-medium uppercase tracking-wider">{label}</span>
    <span className="text-sm text-gray-900">{value || "—"}</span>
  </div>
);

// ================= COMPONENT: ACCOUNT PROFILE (READ-ONLY) =================
const MyAccount = ({ user }) => {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
        <span className="w-10 h-10 rounded-full bg-red-50 text-[#e61e2d] flex items-center justify-center shrink-0">
          <User size={18} />
        </span>
        <div>
          <h2 className="text-base text-gray-900">My Account</h2>
          <p className="text-gray-500 text-xs">Your profile information.</p>
        </div>
      </div>

      <div>
        {fieldRow("Name", user?.name)}
        {fieldRow("Email", user?.email)}
        {fieldRow("Phone", user?.phone)}
        {fieldRow("Address", user?.address)}
        {fieldRow("City", user?.city)}
        {fieldRow("State", user?.state)}
        {fieldRow("Pincode", user?.pincode)}
      </div>
    </div>
  );
};

export default MyAccount;
