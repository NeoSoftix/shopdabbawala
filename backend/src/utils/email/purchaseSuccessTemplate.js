export const purchaseSuccessTemplate = (name, planName, amount, totalMeals) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Purchase Confirmation</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        width: 100%;
        background-color: #f3f4f6;
        padding: 40px 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      }
      .header {
        background: url('https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=600&auto=format&fit=crop') center/cover;
        position: relative;
        padding: 60px 30px;
        text-align: center;
        color: #ffffff;
      }
      .header-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(to bottom, rgba(220, 38, 38, 0.85), rgba(153, 27, 27, 0.95));
      }
      .header-content {
        position: relative;
        z-index: 1;
      }
      .header-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      .header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 800;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .header p {
        margin: 15px 0 0 0;
        font-size: 18px;
        opacity: 0.95;
        font-weight: 500;
      }
      .content {
        padding: 45px 40px;
        color: #1f2937;
      }
      .content h2 {
        color: #111827;
        font-size: 24px;
        margin-top: 0;
        font-weight: 800;
        margin-bottom: 20px;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
        color: #4b5563;
        margin-bottom: 30px;
      }
      .details-card {
        background-color: #fef2f2;
        border: 1px solid #fee2e2;
        border-radius: 16px;
        padding: 30px;
        margin: 35px 0;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #fecdd3;
        padding-bottom: 20px;
      }
      .detail-row:last-child {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
      }
      .detail-label {
        font-size: 14px;
        color: #7f1d1d;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .detail-value {
        font-size: 18px;
        color: #111827;
        font-weight: 800;
        text-align: right;
      }
      .total-row {
        margin-top: 5px;
        padding-top: 25px;
        border-top: 2px dashed #fca5a5;
      }
      .total-value {
        color: #dc2626;
        font-size: 26px;
        font-weight: 900;
      }
      .highlight-box {
        background-color: #ecfdf5;
        border-left: 4px solid #10b981;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 30px;
      }
      .highlight-box p {
        margin: 0;
        color: #065f46;
        font-size: 15px;
        font-weight: 600;
      }
      .footer {
        background-color: #f8fafc;
        padding: 35px;
        text-align: center;
        color: #64748b;
        font-size: 14px;
        border-top: 1px solid #e2e8f0;
      }
      .social-links {
        margin: 20px 0;
      }
      .social-links a {
        color: #94a3b8;
        text-decoration: none;
        margin: 0 10px;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="header-overlay"></div>
          <div class="header-content">
            <div class="header-icon">🍲</div>
            <h1>Welcome Aboard!</h1>
            <p>Your culinary journey begins now.</p>
          </div>
        </div>
        
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for choosing <strong>Tiffin Delivery</strong>! We are absolutely thrilled to start delivering fresh, delicious, and healthy meals right to your doorstep. Here are the exciting details of your subscription:</p>
          
          <div class="details-card">
            <div class="detail-row">
              <span class="detail-label">Selected Plan</span>
              <span class="detail-value" style="color: #dc2626;">${planName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Meals Included</span>
              <span class="detail-value">${totalMeals} Meals</span>
            </div>
            <div class="detail-row total-row">
              <span class="detail-label" style="color: #dc2626; font-size: 16px;">Amount Paid</span>
              <span class="detail-value total-value">$${amount}</span>
            </div>
          </div>

          <div class="highlight-box">
            <p>✨ Sit back and relax! Our chefs are preparing your first meal with love. We'll notify you when your delivery is on the way.</p>
          </div>

          <p style="margin-bottom: 0;">If you ever need to customize your meals or have any questions, our support team is always here for you. Bon Appétit!</p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Instagram</a> &bull; <a href="#">Twitter</a> &bull; <a href="#">Facebook</a>
          </div>
          <p>&copy; ${new Date().getFullYear()} Tiffin Delivery. Freshness delivered daily.</p>
          <p style="margin-top: 8px;">Need help? Contact us at <a href="mailto:support@tiffindelivery.com" style="color: #dc2626; text-decoration: none; font-weight: 600;">support@tiffindelivery.com</a></p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};
