import axios from "axios";

// A message that's 100% HTML with no plain-text alternative is a classic
// spam-filter signal (real mail clients always send both parts) - derive a
// reasonable plain-text fallback from the HTML so every email carries one,
// without having to hand-write a text version per template.
const htmlToPlainText = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&rarr;/gi, "->")
    .replace(/&bull;/gi, "*")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

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
      replyTo: { email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: htmlToPlainText(html),
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
