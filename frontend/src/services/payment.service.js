import API from "./api";

export const createPackageCheckout = async (packageId) => {
  const res = await API.post("/payment/package-checkout", {
    packageId,
  });

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