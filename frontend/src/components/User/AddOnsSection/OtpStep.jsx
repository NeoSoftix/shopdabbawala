
export default function OtpStep({ phone, otp, onOtpChange, otpError, otpLoading, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      {/* ... Same content unchanged ... */}
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
        Phone Verification
      </h3>
      <p className="text-xs font-medium text-gray-400 mb-6">
        Enter the OTP sent to +91 {phone}.
      </p>

      <div className="mb-4">
        <input
          type="text"
          maxLength={6}
          placeholder="• • • • • •"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, ""))}
          className="w-full px-5 py-4 border border-slate-200 rounded-2xl font-black text-center tracking-widest text-slate-900 text-xl focus:outline-none focus:border-red-500 bg-slate-50/50"
        />
        {otpError && (
          <p className="text-red-500 font-bold text-xs mt-2 text-center">
            ⚠️ {otpError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={otpLoading}
        className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
      >
        {otpLoading ? "Please wait..." : "Verify & Pay"}
      </button>
    </form>
  );
}
