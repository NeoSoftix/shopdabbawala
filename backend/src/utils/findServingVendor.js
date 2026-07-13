import Vendor from "../models/vendor.model.js";

// Finds the vendor serving a given pincode, optionally scoped to a package.
// Each vendor is onboarded for exactly one fixed package (or, exclusively,
// as the "custom package" vendor) and a list of pincodes it delivers to
// (servicePincodes) — a (pincode, package) combination, or (pincode,
// custom), can only belong to one vendor, enforced at create/update time in
// the vendor controller.
// When packageId is omitted and isCustom is false (generic "do you deliver
// here" checks before a package is chosen), any active vendor covering the
// pincode qualifies.
export const findServingVendor = async (pincode, packageId, { isCustom = false } = {}) => {
  if (!pincode) return null;

  const normalizedPincode = pincode.trim();

  const query = { isActive: true, servicePincodes: normalizedPincode };
  if (isCustom) {
    query.isCustomPackageVendor = true;
  } else if (packageId) {
    query.package = packageId;
  }

  return Vendor.findOne(query);
};
