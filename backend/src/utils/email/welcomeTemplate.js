const vendorWelcomeTemplate = (
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

export default vendorWelcomeTemplate;