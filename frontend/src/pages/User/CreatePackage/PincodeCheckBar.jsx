import { useEffect, useState } from "react";
import { FiMapPin, FiCheck, FiX } from "react-icons/fi";
import { checkServiceAvailability } from "../../../services/vendor.service";
import { useAuth } from "../../../context/AuthContext";

// Always-visible delivery pincode check shown at the top of the package
// builder — prefilled from the logged-in user's saved pincode, editable, and
// re-verifiable, independent of the checkout modal's own pincode gate later
// in the flow.
export default function PincodeCheckBar() {
  const { user } = useAuth();
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { available: bool, message: string } | null

  useEffect(() => {
    if (user?.pincode) {
      setPincode(user.pincode);
    }
  }, [user]);

  const handlePincodeChange = (e) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setPincode(raw);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^[A-Z0-9]{6}$/.test(pincode.trim())) {
      setResult({ available: false, message: "Please enter a valid 6-character pincode." });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await checkServiceAvailability(pincode.trim());
      if (res && res.success) {
        setResult({ available: true, message: "Great news! We deliver to your area." });
      } else {
        setResult({ available: false, message: res?.message || "Sorry, we don't deliver to this pincode yet." });
      }
    } catch (err) {
      setResult({
        available: false,
        message: err.response?.data?.message || "Sorry, we don't deliver to this pincode yet.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3 px-2">
      <form
        onSubmit={handleVerify}
        className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-3"
      >
        <div className="flex items-center gap-2 flex-1">
          <FiMapPin className="text-red-500 text-lg shrink-0" />
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={handlePincodeChange}
            placeholder="e.g. A1B2C3"
            className="w-full bg-transparent text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Checking..." : "Verify"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-2 flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl ${
            result.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {result.available ? <FiCheck /> : <FiX />}
          {result.message}
        </div>
      )}
    </div>
  );
}
