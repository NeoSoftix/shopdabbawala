import { whatsappClient as client } from '../../config/twilio.js';

// Proactively sends a WhatsApp message (not a TwiML webhook reply) - used
// e.g. to confirm a payment after the Stripe webhook fires, outside the
// request/response cycle of an inbound WhatsApp message.
export const sendWhatsApp = async (to, message) => {
  try {
    if (process.env.TEST_SMS_MODE === 'true') {
      console.log(`[TEST MODE] WhatsApp sent to ${to}: "${message}"`);
      return { sid: 'test_whatsapp_' + Date.now(), status: 'delivered' };
    }

    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER
      ? process.env.TWILIO_WHATSAPP_NUMBER.replace(/\s+/g, '')
      : undefined;

    if (!fromNumber) {
      throw new Error("TWILIO_WHATSAPP_NUMBER is missing in .env");
    }

    let formattedTo = to.toString().trim().replace(/^whatsapp:/, '');
    if (!formattedTo.startsWith('+')) {
      if (formattedTo.length === 10) {
        formattedTo = `+91${formattedTo}`;
      } else if (formattedTo.length === 12 && formattedTo.startsWith('91')) {
        formattedTo = `+${formattedTo}`;
      } else {
        formattedTo = `+${formattedTo}`;
      }
    }

    const response = await client.messages.create({
      body: message,
      from: fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`,
      to: `whatsapp:${formattedTo}`,
    });

    return response;
  } catch (error) {
    console.error('Twilio WhatsApp Error:', error.message || error);
    throw error;
  }
};
