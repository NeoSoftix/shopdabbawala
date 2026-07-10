import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Eye, EyeOff, KeyRound, AlertCircle, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { changePassword } from "../../services/auth.service";

const PasswordField = ({ label, name, value, onChange, show, onToggleShow, placeholder }) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block">
      {label}
    </label>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        type={show ? "text" : "password"}
        name={name}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

// Reusable "change my own password" modal for any logged-in role
// (vendor, admin, customer) — hits PATCH /auth/change-password.
export default function ChangePasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [visibility, setVisibility] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShow = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClose = () => {
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setVisibility({ oldPassword: false, newPassword: false, confirmPassword: false });
    setError("");
    onClose();
  };

  const requirements = [
    { label: "At least 8 characters", met: form.newPassword.length >= 8 },
    { label: "Different from current password", met: form.newPassword.length > 0 && form.newPassword !== form.oldPassword },
    { label: "Passwords match", met: form.confirmPassword.length > 0 && form.newPassword === form.confirmPassword },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!requirements.every((r) => r.met)) {
      setError("Please satisfy all password requirements below.");
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(form);
      if (res.success) {
        toast.success("Password changed successfully!");
        handleClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-100"
        >
          {/* Top border indicator */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <KeyRound size={26} />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Change Password</h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">Keep your account secure with a strong password.</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600 text-center flex items-center justify-center gap-1.5">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordField
                label="Current Password"
                name="oldPassword"
                placeholder="Enter current password"
                value={form.oldPassword}
                onChange={handleChange}
                show={visibility.oldPassword}
                onToggleShow={() => toggleShow("oldPassword")}
              />
              <PasswordField
                label="New Password"
                name="newPassword"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={handleChange}
                show={visibility.newPassword}
                onToggleShow={() => toggleShow("newPassword")}
              />
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={handleChange}
                show={visibility.confirmPassword}
                onToggleShow={() => toggleShow("confirmPassword")}
              />

              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5">
                {requirements.map((r) => (
                  <div key={r.label} className="flex items-center gap-2 text-xs font-semibold">
                    <span
                      className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 transition-colors ${r.met ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"}`}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className={r.met ? "text-slate-600" : "text-slate-400"}>{r.label}</span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-2xl transition-all shadow-lg shadow-red-100 mt-2"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
