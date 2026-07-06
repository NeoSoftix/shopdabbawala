export const purchaseSuccessTemplate = (name, planName, amount, totalMeals) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Purchase Confirmation</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      }
      .header {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        padding: 40px 20px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.5px;
      }
      .header p {
        margin: 10px 0 0 0;
        font-size: 16px;
        opacity: 0.9;
        font-weight: 500;
      }
      .content {
        padding: 40px 30px;
        color: #334155;
      }
      .content h2 {
        color: #0f172a;
        font-size: 20px;
        margin-top: 0;
        font-weight: 700;
      }
      .details-card {
        background-color: #fff1f2;
        border: 1px solid #ffe4e6;
        border-radius: 12px;
        padding: 24px;
        margin: 30px 0;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        border-bottom: 1px dashed #fecdd3;
        padding-bottom: 16px;
      }
      .detail-row:last-child {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
      }
      .detail-label {
        font-size: 14px;
        color: #64748b;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .detail-value {
        font-size: 16px;
        color: #0f172a;
        font-weight: 800;
        text-align: right;
      }
      .total-row {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 2px solid #fda4af;
      }
      .total-value {
        color: #e11d48;
        font-size: 22px;
        font-weight: 900;
      }
      .footer {
        background-color: #f8fafc;
        padding: 24px;
        text-align: center;
        color: #64748b;
        font-size: 13px;
        border-top: 1px solid #f1f5f9;
      }
      .btn {
        display: inline-block;
        background-color: #ef4444;
        color: #ffffff;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 700;
        margin-top: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome Aboard! 🎉</h1>
        <p>Your subscription is confirmed and ready to go.</p>
      </div>
      <div class="content">
        <h2>Hi ${name},</h2>
        <p>Thank you for choosing Tiffin Delivery! We are thrilled to start delivering fresh and healthy meals right to your doorstep. Here are the details of your recent purchase:</p>
        
        <div class="details-card">
          <div class="detail-row">
            <span class="detail-label">Plan Name</span>
            <span class="detail-value">${planName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Meals</span>
            <span class="detail-value">${totalMeals}</span>
          </div>
          <div class="detail-row total-row">
            <span class="detail-label" style="color: #e11d48;">Amount Paid</span>
            <span class="detail-value total-value">₹${amount}</span>
          </div>
        </div>

        <p>We will keep you updated on your upcoming deliveries. If you have any questions or need to make changes, feel free to reach out to our support team.</p>
        
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Tiffin Delivery. All rights reserved.</p>
        <p>Need help? Contact us at support@tiffindelivery.com</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
