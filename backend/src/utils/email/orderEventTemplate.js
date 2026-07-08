// Single reusable branded template for all order-lifecycle emails (new
// subscription purchased, new day order, order paused/resumed) sent to
// admins and vendors. `lines` renders as label/value rows; `accent` tints
// the header band so different event types are visually distinguishable
// at a glance in an inbox full of these.
export const orderEventTemplate = ({ heading, intro, lines = [], accent = "#dc2626" }) => {
  const rows = lines
    .map(
      ({ label, value }) => `
        <div class="detail-row">
          <span class="detail-label">${label}</span>
          <span class="detail-value">${value}</span>
        </div>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${heading}</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
      .container {
        max-width: 560px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      }
      .header {
        background: ${accent};
        padding: 32px 30px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
      .content { padding: 35px 40px; color: #1f2937; }
      .content p { font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0; }
      .details-card {
        background-color: #f9fafb;
        border: 1px solid #eef0f3;
        border-radius: 14px;
        padding: 22px;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 0;
        border-bottom: 1px solid #eef0f3;
      }
      .detail-row:last-child { border-bottom: none; }
      .detail-label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      .detail-value { font-size: 14px; color: #111827; font-weight: 700; text-align: right; }
      .footer {
        background-color: #f8fafc;
        padding: 24px;
        text-align: center;
        color: #94a3b8;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header"><h1>${heading}</h1></div>
        <div class="content">
          ${intro ? `<p>${intro}</p>` : ""}
          <div class="details-card">${rows}</div>
        </div>
        <div class="footer">Tiffin Delivery &bull; Automated notification</div>
      </div>
    </div>
  </body>
  </html>
  `;
};
