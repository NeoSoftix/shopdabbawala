// vendor.controller.js
//
// Thin composition layer that re-exports vendor controller functions from
// the modular files under ./vendor/. Split out for maintainability — keep
// this file's exports in sync with backend/src/routes/vendor.routes.js.

export {
  createVendor,
  getAllVendors,
  getOneVendor,
  updateVendor,
  toggleVendorStatus,
  deleteVendor,
} from "./vendor/vendor.crud.controller.js";

export {
  vendorProfile,
  checkServiceAvailability,
} from "./vendor/vendor.profile.controller.js";
