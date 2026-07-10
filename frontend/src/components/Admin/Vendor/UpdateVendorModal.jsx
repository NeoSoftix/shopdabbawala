import { ButtonSpinner } from "../../shared/Loader";

const UpdateVendorModal = ({
  isOpen,
  formData,
  updating,
  packages = [],
  onInputChange,
  onFileChange,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-md overflow-y-auto p-4 pt-10">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl my-4 border border-gray-200/80 transform transition-transform animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Update Vendor Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Package (vendor serves only this plan)
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={onInputChange}
                required
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d] bg-white"
              >
                <option value="">Select a package</option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-gray-400">
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows="2"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                className="w-full rounded-xl border border-gray-300 p-2 text-sm outline-none focus:border-[#e61e2d]"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-3 mt-4">
            <button
              type="button"
              disabled={updating}
              onClick={onClose}
              className="rounded-xl border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={updating}
              className="rounded-xl bg-[#e61e2d] px-5 py-2 text-sm text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {updating && <ButtonSpinner />}
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVendorModal;
