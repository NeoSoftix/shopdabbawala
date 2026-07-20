// Single tier card shown in the tier grid — name, status pill, features
// and the edit/hide/delete row actions.
export default function TierCard({ tier, onEdit, onToggle, onDeleteRequest }) {
  return (
    <div
      className={`relative bg-white rounded-2xl border p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all flex flex-col ${
        tier.isActive ? "border-gray-200/80" : "border-gray-200/60 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
            tier.isActive
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {tier.isActive ? "Active" : "Hidden"}
        </span>
      </div>

      {/* Features */}
      <ul className="space-y-1 mb-3">
        {(tier.features || []).map((feature, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
            <span className="text-[#dc2626] mt-0.5">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-1.5 mt-auto">
        <button
          onClick={() => onEdit(tier)}
          className="flex-1 text-[11px] font-bold text-gray-600 hover:text-[#dc2626] bg-gray-50 hover:bg-red-50 rounded-lg py-1.5 transition-all focus:outline-none"
        >
          Edit
        </button>
        <button
          onClick={() => onToggle(tier)}
          className="flex-1 text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg py-1.5 transition-all focus:outline-none"
        >
          {tier.isActive ? "Hide" : "Show"}
        </button>
        <button
          onClick={() => onDeleteRequest(tier)}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
          aria-label="Delete tier"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79l-.622 10.72a2.25 2.25 0 01-2.244 2.13H7.638a2.25 2.25 0 01-2.244-2.13L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.956.397a48.11 48.11 0 013.478-.397m0 0V4.67c0-1.03.83-1.874 1.86-1.913a45.62 45.62 0 013.28 0c1.03.04 1.86.883 1.86 1.913v.816m-6 0a48.667 48.667 0 017.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
