import { ButtonSpinner } from "../../shared/Loader";

const DeleteVendorModal = ({ isOpen, deleting, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md p-4 pt-16 transition-all duration-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200/80 transform translate-y-0 transition-transform animate-in slide-in-from-top-4 duration-200">
        <h3 className="text-lg font-bold text-gray-900">
          Delete Vendor Profile?
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete this vendor? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={deleting}
            onClick={onCancel}
            className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={deleting}
            onClick={onConfirm}
            className="rounded-xl bg-[#e61e2d] px-4 py-2 text-sm font-medium text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {deleting && <ButtonSpinner />}
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVendorModal;
