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