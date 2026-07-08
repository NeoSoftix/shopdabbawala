import { emailShell } from "./emailShell.js";

// Generic branded template for order-lifecycle emails (new subscription
// purchased, new day order, order paused/resumed/accepted/rejected) sent to
// admins, vendors and customers. `lines` renders as icon/label/value rows;
// `accent` tints the header/footer so different event types stay visually
// distinguishable in an inbox full of these.
export const orderEventTemplate = ({ heading, intro, lines = [], accent = "#dc2626", accentDark }) =>
  emailShell({
    heading,
    badge: "ORDER UPDATE",
    icon: "📋",
    intro,
    lines,
    accent,
    accentDark,
  });
