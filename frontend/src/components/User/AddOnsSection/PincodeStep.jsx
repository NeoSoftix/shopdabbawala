
export default function PincodeStep({ pincode, onPincodeChange, pincodeError, pincodeLoading, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      {/* ... Same content unchanged ... */}
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
        Check Availability
      </h3>
      <p className="text-xs font-medium text-gray-400 mb-6">
        Please enter your 6-digit pincode to check deliverability
        status.
      </p>

      <div className="mb-4">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => onPincodeChange(e.target.value.replace(/\D/g, ""))}
          className="w-full px-5 py-4 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-red-500 bg-slate-50/50"
        />
        {pincodeError && (
          <p className="text-red-500 font-bold text-xs mt-2 pl-1">
            ⚠️ {pincodeError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pincodeLoading}
        className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20 transition-all cursor-pointer"
      >
        {pincodeLoading ? "Checking..." : "Verify Area"}
      </button>
    </form>
  );
}
