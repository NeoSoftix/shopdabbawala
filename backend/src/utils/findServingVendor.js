import Vendor from "../models/vendor.model.js";

// Finds the active vendor serving a given pincode (matches vendor's base
// pincode or any of its serviceZones areas). Same matching rule used by
// checkServiceAvailability, kept in one place so both stay in sync.
export const findServingVendor = async (pincode) => {
  if (!pincode) return null;

  return Vendor.findOne({
    isActive: true,
    $or: [
      { pincode: pincode.trim() },
      { "serviceZones.area": { $regex: `^${pincode.trim()}$`, $options: "i" } },
    ],
  });
};
