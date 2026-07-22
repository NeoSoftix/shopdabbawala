import API from "./api";

export const createPackageCheckout = async (packageId) => {
  const res = await API.post("/payment/package-checkout", {
    packageId,
  });

  return res.data;
};

export const createAddonCheckout = async (items) => {
  const res = await API.post("/payment/addon-checkout", { items });
  return res.data;
};

// Per-day add-ons checkout (extra items on top of an already-scheduled meal)
export const createDayAddonCheckout = async ({ subscriptionId, date, addons }) => {
  const res = await API.post("/payment/day-addon-checkout", { subscriptionId, date, addons });
  return res.data;
};

export const saveCheckoutDetails = async (data) => {
  const res = await API.post("/payment/save-details", data);
  return res.data;
};

export const createScheduledSubscription = async (scheduleData) => {
  const res = await API.post("/payment/create-schedule", scheduleData);
  return res.data;
};

export const getSessionDetails = async (sessionId) => {
  const res = await API.get(`/payment/session/${sessionId}`);
  return res.data;
};

// Establishes a logged-in session from a Stripe checkout session id alone -
// needed on the payment-success page when the buyer never logged into the
// website first (e.g. a purchase started from the WhatsApp bot).
export const checkoutLogin = async (sessionId) => {
  const res = await API.post("/payment/checkout-login", { sessionId });
  return res.data;
};