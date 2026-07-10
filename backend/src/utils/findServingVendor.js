import Vendor from "../models/vendor.model.js";
import VendorAssignment from "../models/vendorAssignment.model.js";

// Finds the vendor serving a given pincode.
// When packageId is provided, resolves via VendorAssignment (admin-assigned
// vendor for that exact pincode + package) — this is the source of truth for
// package-based ordering flows (e.g. Admin Packages).
// When packageId is omitted (custom/legacy flows with no package reference),
// falls back to matching the vendor's own base pincode.
export const findServingVendor = async (pincode, packageId) => {
  if (!pincode) return null;

  const normalizedPincode = pincode.trim();

  if (packageId) {
    const assignment = await VendorAssignment.findOne({
      pincode: normalizedPincode,
      package: packageId,
      isActive: true,
    }).populate("vendor");

    return assignment?.vendor?.isActive ? assignment.vendor : null;
  }

  return Vendor.findOne({ isActive: true, pincode: normalizedPincode });
};
