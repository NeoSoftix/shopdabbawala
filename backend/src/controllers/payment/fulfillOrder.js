import { fulfillAdminPackage } from "./fulfillAdminPackage.js"
import { fulfillCustomPackage } from "./fulfillCustomPackage.js"
import { fulfillRenewal } from "./fulfillRenewal.js"
import { fulfillAddonOrder } from "./fulfillAddonOrder.js"
import { fulfillDayAddonOrder } from "./fulfillDayAddonOrder.js"

// -------- FULFILL ORDER HELPER --------
// `payment` is already marked "paid" atomically by the webhook handler
// before this runs (see webhook.js) - this only dispatches to the
// paymentType-specific fulfillment branch.
export const fulfillOrder = async (session, payment) => {
  // -------- ADMIN PACKAGE --------
  if (session.metadata?.paymentType === "ADMIN_PACKAGE") {
    await fulfillAdminPackage(session, payment);
  }

  // -------- CUSTOM PACKAGE --------
  if (session.metadata?.paymentType === "CUSTOM_PACKAGE") {
    await fulfillCustomPackage(session, payment);
  }

  // -------- RENEWAL --------
  if (session.metadata?.paymentType === "RENEWAL") {
    await fulfillRenewal(session, payment);
  }

  // -------- ADDON ORDER --------
  if (session.metadata?.paymentType === "ADDON_ORDER") {
    await fulfillAddonOrder(session, payment);
  }

  // -------- DAY ADDON ORDER --------
  if (session.metadata?.paymentType === "DAY_ADDON_ORDER") {
    await fulfillDayAddonOrder(session, payment);
  }
};
