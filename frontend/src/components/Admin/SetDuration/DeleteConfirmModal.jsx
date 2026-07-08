const DeleteConfirmModal = ({ target, onCancel, onConfirm }) => {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5">
        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-sm font-black text-gray-900">Delete this plan?</h3>
        <p className="text-xs text-gray-500 mt-1.5 mb-4">
          "{target.durationLabel} — {target.totalMeals} meals" will be removed
          permanently and will no longer appear on the customer's checkout page.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2.5 transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl py-2.5 transition-all focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
