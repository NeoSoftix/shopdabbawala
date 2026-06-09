import transporter from "./transporter.js";

export const sendEmail = async (
  to,
  subject,
  html
) => {
  await transporter.sendMail({
    from: `"Tiffin Delivery" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};