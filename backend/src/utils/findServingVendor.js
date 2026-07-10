import Vendor from "../models/vendor.model.js";

// Finds the vendor serving a given pincode, optionally scoped to a package.
// Each vendor is onboarded for exactly one fixed package and a list of
// pincodes it delivers that package to (servicePincodes) — a (pincode,
// package) combination can only belong to one vendor, enforced at
// create/update time in the vendor controller.
// When packageId is omitted (generic "do you deliver here" checks before a
// package is chosen), any active vendor covering the pincode qualifies.
export const findServingVendor = async (pincode, packageId) => {
  if (!pincode) return null;

  const normalizedPincode = pincode.trim();

  const query = { isActive: true, servicePincodes: normalizedPincode };
  if (packageId) query.package = packageId;

  return Vendor.findOne(query);
};
