import API from "./api";

// Submit the public Contact Us form
export const submitContactQuery = async (data) => {
  try {
    const res = await API.post("/contact", data);

    return res.data;
  } catch (error) {
    console.log("Submit Contact Query Error", error);

    throw error;
  }
};
