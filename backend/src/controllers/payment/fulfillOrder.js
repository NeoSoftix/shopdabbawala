import { fulfillAdminPackage } from "./fulfillAdminPackage.js"
import { fulfillCustomPackage } from "./fulfillCustomPackage.js"
import { fulfillRenewal } from "./fulfillRenewal.js"

// -------- FULFILL ORDER HELPER --------
export const fulfillOrder = async (session, payment) => {
  payment.status = "paid";
  payment.paymentIntentId = session.payment_intent;
  payment.paidAt = new Date();

  await payment.save();

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
};
