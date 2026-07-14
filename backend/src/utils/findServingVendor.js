import Vendor from "../models/vendor.model.js";

// Finds the vendor serving a given pincode, optionally scoped to a category
// (the sole order-routing key: a vendor serves exactly one category per
// pincode). A (pincode, category) combination can only belong to one
// vendor, enforced at create/update time in the vendor controller.
// When categoryId is omitted (generic "do you deliver here" checks before a
// category is known, e.g. at checkout), any active vendor covering the
// pincode qualifies.
export const findServingVendor = async (pincode, categoryId) => {
  if (!pincode) return null;

  const normalizedPincode = pincode.trim();

  const query = { isActive: true, servicePincodes: normalizedPincode };
  if (categoryId) {
    query.category = categoryId;
  }

  return Vendor.findOne(query);
};
