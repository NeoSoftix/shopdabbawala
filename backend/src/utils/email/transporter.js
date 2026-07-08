import dotenv from "dotenv"
dotenv.config()
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  // Keeps a small pool of already-authenticated SMTP connections open
  // instead of reconnecting + re-authenticating for every single email,
  // which is what was making sends feel slow.
  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  // Forces the SMTP socket itself over IPv4. Some hosts (Render included)
  // have no outbound IPv6 route, which made connections to Gmail's IPv6
  // address fail with ENETUNREACH/ETIMEDOUT instead of trying IPv4.
  family: 4,
  connectionTimeout: 15000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;
