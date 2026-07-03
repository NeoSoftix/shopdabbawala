import API from "./api";

// Create Stripe Checkout Session
export const createPackageCheckout = async (data) => {
  try {
    const res = await API.post("/payment/package-checkout", data);

    return res.data;
  } catch (error) {
    console.log("Create Package Checkout Error:", error);
    throw error;
  }
};