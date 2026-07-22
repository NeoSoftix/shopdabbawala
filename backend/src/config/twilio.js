import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// OTP/SMS and WhatsApp are on two separate Twilio accounts (different SIDs
// and auth tokens), so each needs its own client - mixing them would send
// requests to the wrong account and fail auth.
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Falls back to the main account's credentials if the WhatsApp-specific ones
// aren't set, so a single-account setup keeps working unchanged.
export const whatsappClient = twilio(
  process.env.TWILIO_WHATSAPP_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_WHATSAPP_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN
);

export default client;