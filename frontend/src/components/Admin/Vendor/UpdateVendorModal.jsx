import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";

const UpdateVendorModal = ({
  isOpen,
  formData,
  updating,
  categories = [],
  onInputChange,
  onFileChange,
  onSubmit,
  onClose,
  isActive,
  togglingStatus,
  onToggleStatus,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} wide showCloseButton>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Update Vendor Details</h3>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-700">Vendor Status</span>
          <p className="mt-0.5 text-[11px] text-gray-400">
            {isActive ? "Vendor is currently active and can receive orders." : "Vendor is currently inactive and won't receive orders."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          disabled={togglingStatus}
          onClick={() => onToggleStatus(!isActive)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
            isActive ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Owner Name" type="text" name="name" value={formData.name} onChange={onInputChange} required />
          <Input label="Organization Name" type="text" name="organizationName" value={formData.organizationName} onChange={onInputChange} required />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={onInputChange} required />
          <Input label="Phone" type="text" name="phone" value={formData.phone} onChange={onInputChange} required />
          <Input wrapperClassName="sm:col-span-2" label="Address" type="text" name="address" value={formData.address} onChange={onInputChange} required />
          <Input label="City" type="text" name="city" value={formData.city} onChange={onInputChange} required />
          <Input label="State" type="text" name="state" value={formData.state} onChange={onInputChange} required />
          <Input label="Pincode" type="text" name="pincode" value={formData.pincode} onChange={onInputChange} required />
          <div>
            <Select
              label="Category (vendor serves only this category)"
              name="category"
              value={formData.category}
              onChange={onInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <p className="mt-1 text-[11px] text-gray-400">
              Orders for this category in this vendor's pincodes are routed to them only.
              Delivery pincodes are managed from the Assign Vendor page.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Update Logo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#e61e2d] hover:file:bg-red-100"
            />
          </div>
          <Textarea
            wrapperClassName="sm:col-span-2"
            label="Description"
            rows="2"
            name="description"
            value={formData.description}
            onChange={onInputChange}
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-3 mt-4">
          <Button type="button" variant="outline" disabled={updating} onClick={onClose}>
            Close
          </Button>
          <Button type="submit" loading={updating}>
            {updating ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateVendorModal;
