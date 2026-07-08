
export default function PhoneStep({ pincode, phone, onPhoneChange, detailsError, detailsLoading, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">
        Enter Mobile Number
      </h3>
      <div className="bg-emerald-50 text-emerald-700 rounded-xl p-2.5 mb-5 text-[11px] font-bold flex gap-1.5 items-center">
        <span>✓</span> We deliver to pincode {pincode}
      </div>

      <div className="space-y-4 mb-6">
        <input
          type="tel"
          required
          maxLength={10}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ""))}
          className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-red-500 bg-slate-50/50 text-sm"
        />
        {detailsError && (
          <p className="text-red-500 font-bold text-xs pl-1">
            ⚠️ {detailsError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={detailsLoading}
        className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
      >
        {detailsLoading ? "Sending OTP..." : "Send OTP Verification"}
      </button>
    </form>
  );
}
