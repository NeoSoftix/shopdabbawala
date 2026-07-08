// Single shared visual shell for every transactional email the app sends
// (order events, purchase confirmation, vendor welcome, password reset).
// Keeping one function means every email inherits the same branding/layout
// automatically - individual templates only supply content, never markup.

// Read lazily (inside functions, not at module top level) - with ESM,
// static imports are hoisted and evaluated before this module's importer
// gets to call dotenv.config(), so a top-level `process.env.X` read here
// would always see undefined in local dev (works out on Render only
// because the platform injects real env vars before Node even starts).
const getBrandName = () => process.env.BREVO_SENDER_NAME || "Tiffin Delivery";
const getLogoUrl = () => `${(process.env.FRONTEND_URL || "").replace(/\/$/, "")}/logo.png`;

// Best-effort icon per row based on its label, so callers that only ever
// pass { label, value } (no icon) still get the same polished row look.
const ROW_ICONS = [
  [/customer|name/i, "👤"],
  [/vendor/i, "🏪"],
  [/plan/i, "📦"],
  [/day|date|delivery/i, "📅"],
  [/item|meal|quantity/i, "🍽️"],
  [/amount|price|total/i, "💰"],
  [/status/i, "✅"],
  [/email/i, "✉️"],
  [/phone/i, "📞"],
  [/password/i, "🔒"],
  [/pincode|address/i, "📍"],
];
const iconForLabel = (label = "") => {
  const match = ROW_ICONS.find(([pattern]) => pattern.test(label));
  return match ? match[1] : "•";
};

// Auto-derives a darker shade of `accent` for the header/footer gradient so
// callers only ever need to pass one color (e.g. green for "accepted", red
// for "rejected") and still get a good-looking two-tone gradient.
const darken = (hex, amount = 0.4) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((num >> 16) & 255) * (1 - amount));
  const g = Math.round(((num >> 8) & 255) * (1 - amount));
  const b = Math.round((num & 255) * (1 - amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const POSITIVE_STATUSES = ["accepted", "active", "confirmed", "resumed", "delivered", "paid", "success"];
const NEGATIVE_STATUSES = ["rejected", "inactive", "cancelled", "canceled", "paused", "failed"];

const renderRow = ({ label, value }) => {
  const isStatus = /status/i.test(label);
  let valueHtml = value;

  if (isStatus) {
    const key = String(value).toLowerCase();
    const tone = POSITIVE_STATUSES.some((s) => key.includes(s))
      ? "background:#dcfce7;color:#16a34a;"
      : NEGATIVE_STATUSES.some((s) => key.includes(s))
        ? "background:#fee2e2;color:#dc2626;"
        : "background:#f3f4f6;color:#4b5563;";
    valueHtml = `<span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.4px;${tone}">${value}</span>`;
  }

  return `
    <div class="detail-row">
      <span class="detail-row-left">
        <span class="detail-icon">${iconForLabel(label)}</span>
        <span class="detail-label">${label}</span>
      </span>
      <span class="detail-value">${valueHtml}</span>
    </div>`;
};

export const emailShell = ({
  heading,
  subtitle,
  badge,
  icon = "📋",
  intro,
  lines = [],
  ctaText,
  ctaUrl,
  accent = "#dc2626",
  accentDark,
}) => {
  const resolvedAccentDark = accentDark || darken(accent);
  const rows = lines.map(renderRow).join("");
  const BRAND_NAME = getBrandName();
  const LOGO_URL = getLogoUrl();

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${heading}</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
      .container {
        max-width: 560px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(135deg, ${accent}, ${resolvedAccentDark});
        padding: 24px 30px;
        text-align: center;
      }
      .header .logo-wrap {
        display: inline-block;
        background: #ffffff;
        padding: 8px 16px;
        border-radius: 14px;
      }
      .header img {
        height: 38px;
        width: auto;
        display: block;
      }
      .content { padding: 40px 36px 30px; color: #1f2937; text-align: center; }
      .icon-badge {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #fee2e2;
        color: ${accent};
        font-size: 28px;
        line-height: 64px;
        text-align: center;
        margin: 0 auto 18px;
      }
      .pill-badge {
        display: inline-block;
        background: #fee2e2;
        color: ${accent};
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        padding: 6px 14px;
        border-radius: 999px;
        margin-bottom: 18px;
      }
      .content h1 {
        margin: 0 0 10px;
        font-size: 24px;
        font-weight: 800;
        color: #111827;
      }
      .content .subtitle {
        margin: 0 0 28px;
        font-size: 14px;
        line-height: 1.6;
        color: #6b7280;
      }
      .content .intro {
        margin: 0 0 24px;
        font-size: 15px;
        line-height: 1.6;
        color: #4b5563;
        text-align: left;
      }
      .details-card {
        background-color: #f9fafb;
        border: 1px solid #eef0f3;
        border-radius: 16px;
        padding: 8px 22px;
        text-align: left;
      }
      .detail-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 0;
        border-bottom: 1px solid #eef0f3;
      }
      .detail-row:last-child { border-bottom: none; }
      .detail-row-left { display: flex; align-items: center; gap: 10px; }
      .detail-icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fee2e2;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        flex-shrink: 0;
      }
      .detail-label {
        font-size: 13px;
        color: #4b5563;
        font-weight: 600;
      }
      .detail-value { font-size: 14px; color: #111827; font-weight: 800; text-align: right; }
      .cta-button {
        display: inline-block;
        margin-top: 28px;
        background: ${accent};
        color: #ffffff !important;
        font-size: 14px;
        font-weight: 800;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 12px;
        letter-spacing: 0.2px;
      }
      .disclaimer {
        margin: 24px 0 0;
        font-size: 12px;
        color: #9ca3af;
      }
      .footer {
        background: linear-gradient(135deg, ${accent}, ${resolvedAccentDark});
        padding: 18px;
        text-align: center;
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.2px;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="logo-wrap">
            <img src="${LOGO_URL}" alt="${BRAND_NAME}" />
          </div>
        </div>

        <div class="content">
          ${badge ? `<div class="pill-badge">⭐ ${badge}</div>` : ""}
          <div class="icon-badge">${icon}</div>
          <h1>${heading}</h1>
          ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
          ${intro ? `<p class="intro">${intro}</p>` : ""}

          ${rows ? `<div class="details-card">${rows}</div>` : ""}

          ${ctaText && ctaUrl ? `<a class="cta-button" href="${ctaUrl}">${ctaText} &rarr;</a>` : ""}

          <p class="disclaimer">🛡️ This is an automated message. Please do not reply.</p>
        </div>

        <div class="footer">${BRAND_NAME} &bull; Automated notification</div>
      </div>
    </div>
  </body>
  </html>
  `;
};
