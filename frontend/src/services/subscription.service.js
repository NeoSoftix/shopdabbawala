import API from "./api";

// Create Custom Package / Subscription
export const createSubscription = async (data) => {
  try {
    const res = await API.post("/subscriptions/create-custom-package", data);

    return res.data;
  } catch (error) {
    console.log("Create Subscription Error", error);
  console.log(error.response);
  console.log(error.response?.data);
    throw error;
  }
};

export const instantUpgradeSubscription = async (packageId) => {
  try {
    const res = await API.post("/subscriptions/instant-upgrade", { packageId });
    return res.data;
  } catch (error) {
    console.log("Instant Upgrade Error", error);
    throw error;
  }
};

export const getMySubscriptions = async () => {
  try {
    const res = await API.get("/subscriptions/my-subscriptions");
    return res.data;
  } catch (error) {
    console.log("Get My Subscriptions Error", error);
    throw error;
  }
};