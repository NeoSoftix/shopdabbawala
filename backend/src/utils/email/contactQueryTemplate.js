import { emailShell } from "./emailShell.js";

// Sent to every admin when a visitor submits the public Contact Us form.
export const contactQueryTemplate = ({ name, email, phone, subject, message, referenceId }) =>
  emailShell({
    heading: "New Contact Query",
    badge: "CONTACT FORM",
    icon: "📩",
    intro: `${name} just submitted a message through the Contact Us page.`,
    lines: [
      { label: "Name", value: name },
      { label: "Email", value: email },
      { label: "Phone", value: phone },
      { label: "Subject", value: subject },
      { label: "Message", value: message },
      { label: "Reference ID", value: referenceId },
    ],
    accent: "#2563eb",
  });
