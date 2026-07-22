import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

// Confirmation modal shown before permanently deleting a tier.
export default function DeleteTierModal({ tier, onCancel, onConfirm }) {
  return (
    <Modal isOpen={!!tier} onClose={onCancel} maxWidthClass="max-w-sm">
      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900">Delete this tier?</h3>
      <p className="text-xs text-gray-500 mt-1.5 mb-4">
        "{tier?.name}" will be removed permanently and will no longer appear
        on the customer's plan selection.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} className="flex-1">
          Delete
        </Button>
      </div>
    </Modal>
  );
}
