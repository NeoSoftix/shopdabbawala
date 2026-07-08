import axios from "axios";

// Sends transactional email via Brevo's HTTP API (port 443) instead of raw
// SMTP. Render's free/starter plans block outbound SMTP ports (25/465/587)
// entirely, which is why Gmail SMTP never delivered from production - an
// HTTPS API call isn't affected by that restriction.
export const sendEmail = async (to, subject, html) => {
  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Tiffin Delivery",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
    }
  );

  return response.data;
};
