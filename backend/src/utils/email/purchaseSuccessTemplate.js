import { emailShell } from "./emailShell.js";

// Sent to the customer right after a successful subscription purchase.
export const purchaseSuccessTemplate = (name, planName, amount, totalMeals) =>
  emailShell({
    heading: "Welcome Aboard!",
    subtitle: "Your culinary journey begins now.",
    badge: "SUBSCRIPTION CONFIRMED",
    intro: `Hi ${name}, thank you for choosing our tiffin service! We're thrilled to start delivering fresh, delicious, and healthy meals right to your doorstep.`,
    lines: [
      { label: "Selected Plan", value: planName },
      { label: "Total Meals", value: `${totalMeals} Meals` },
      { label: "Amount Paid", value: `$${amount}` },
      { label: "Status", value: "Confirmed" },
    ],
    ctaText: "View My Plan",
    ctaUrl: `${(process.env.FRONTEND_URL || "").replace(/\/$/, "")}/dashboard`,
    accent: "#dc2626",
    accentDark: "#991b1b",
  });
