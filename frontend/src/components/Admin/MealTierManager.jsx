import useMealTiers from "./MealTierManager/useMealTiers.js";
import useTierForm from "./MealTierManager/useTierForm.js";
import TierGrid from "./MealTierManager/TierGrid.jsx";
import TierFormPanel from "./MealTierManager/TierFormPanel.jsx";
import DeleteTierModal from "./MealTierManager/DeleteTierModal.jsx";

export default function MealTierManager() {
  const {
    tiers,
    loading,
    fetchTiers,
    handleToggle,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
  } = useMealTiers();

  const tierForm = useTierForm({ onSaved: fetchTiers });

  return (
    <div className="min-h-screen bg-[#f9f9fb] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
              Meal Tiers
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Define meal tiers like "Basic", "Medium", "Premium" — set their features and
              which items belong to each tier.
            </p>
          </div>
          <button
            onClick={tierForm.openCreateForm}
            className="inline-flex items-center gap-1.5 bg-[#dc2626] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl shadow-sm shadow-red-600/20 transition-all active:scale-[0.98] focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Tier
          </button>
        </div>

        <TierGrid
          tiers={tiers}
          loading={loading}
          onAddNew={tierForm.openCreateForm}
          onEdit={tierForm.openEditForm}
          onToggle={handleToggle}
          onDeleteRequest={setDeleteTarget}
        />
      </div>

      {/* ADD / EDIT FORM — slide-over panel */}
      <TierFormPanel tierForm={tierForm} />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteTierModal
        tier={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
