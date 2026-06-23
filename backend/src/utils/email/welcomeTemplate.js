export const vendorWelcomeTemplate = (
  name,
  email,
  password
) => {
  return `
    Hello ${name},

    Your vendor account has been created successfully.

    Email: ${email}
    Password: ${password}

    Please change your password after login.

    Regards,
    Tiffin Delivery Team
  `;
};

export const resetPasswordTemplate = (
  name,
  resetUrl
) => {
  return `
    Hello ${name},

    We received a request to reset your password.

    Reset Link:
    ${resetUrl}

    This link will expire in 15 minutes.

    If you did not request this, please ignore this email.

    Regards,
    Tiffin Delivery Team
  `;
};

