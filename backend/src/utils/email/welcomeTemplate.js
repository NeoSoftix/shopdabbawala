import { emailShell } from "./emailShell.js";

// Sent to a new vendor right after admin creates their account.
export const vendorWelcomeTemplate = (name, email, password) =>
  emailShell({
    heading: "Welcome to the Team!",
    subtitle: "Your vendor account is ready.",
    badge: "ACCOUNT CREATED",
    intro: `Hi ${name}, your vendor account has been created successfully. Use the credentials below to log in - please change your password after your first login.`,
    lines: [
      { label: "Email", value: email },
      { label: "Password", value: password },
      { label: "Status", value: "Active" },
    ],
    ctaText: "Login to Dashboard",
    ctaUrl: `${(process.env.FRONTEND_URL || "").replace(/\/$/, "")}/login`,
    accent: "#dc2626",
    accentDark: "#991b1b",
  });

// Sent when a user requests a password reset.
export const resetPasswordTemplate = (name, resetUrl) =>
  emailShell({
    heading: "Reset Your Password",
    subtitle: "We received a request to reset your password.",
    badge: "SECURITY",
    intro: `Hi ${name}, click the button below to choose a new password. This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.`,
    lines: [],
    ctaText: "Reset Password",
    ctaUrl: resetUrl,
    accent: "#dc2626",
    accentDark: "#991b1b",
  });
