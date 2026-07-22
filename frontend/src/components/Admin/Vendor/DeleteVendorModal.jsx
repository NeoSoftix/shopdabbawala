import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

const DeleteVendorModal = ({ isOpen, deleting, onCancel, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h3 className="text-lg font-bold text-gray-900">Delete Vendor Profile?</h3>
      <p className="mt-2 text-sm text-gray-500">
        Are you sure you want to delete this vendor? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" disabled={deleting} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" loading={deleting} onClick={onConfirm}>
          {deleting ? "Deleting..." : "Yes, Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteVendorModal;
