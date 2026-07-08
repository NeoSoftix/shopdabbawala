// Thin composition layer — re-exports all package controller functions
// from the split modules under ./package/. Kept at this path so existing
// imports (e.g. routes/package.routes.js) continue to work unchanged.

export { createPackage } from "./package/package.create.controller.js";
export {
  getAllPackage,
  getOnePackage,
  getActivePackage,
} from "./package/package.read.controller.js";
export { updatePackage } from "./package/package.update.controller.js";
export {
  toggleStatus,
  deletePackage,
} from "./package/package.lifecycle.controller.js";
