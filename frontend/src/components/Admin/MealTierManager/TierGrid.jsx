import TierCard from "./TierCard.jsx";

// Handles the three list states — loading skeleton, empty state, and the
// populated grid of TierCard entries.
export default function TierGrid({ tiers, loading, onAddNew, onEdit, onToggle, onDeleteRequest }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-4 h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (tiers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#dc2626] flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">No meal tiers yet</h3>
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Add your first tier — like "Basic" with a few features and items.
        </p>
        <button
          onClick={onAddNew}
          className="text-xs font-bold text-[#dc2626] hover:underline"
        >
          + Add New Tier
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {tiers.map((tier) => (
        <TierCard
          key={tier._id}
          tier={tier}
          onEdit={onEdit}
          onToggle={onToggle}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
