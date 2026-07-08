import { toast } from "react-hot-toast";

export const confirmDeleteToast = (message, onConfirm) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-sm text-gray-800">{message}</p>
        <p className="text-xs text-gray-500">This action cannot be undone.</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await onConfirm();
            }}
            className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    { duration: 8000 }
  );
};
