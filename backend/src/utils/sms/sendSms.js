import client from '../../config/twilio.js';

export const sendSms = async (to, message) => {
  try {
    // Check if the user has defined a Twilio Phone Number or a Messaging Service SID in .env
    const fromNumber = process.env.TWILIO_PHONE_NUMBER ? process.env.TWILIO_PHONE_NUMBER.replace(/\s+/g, '') : undefined;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!fromNumber && !messagingServiceSid) {
      throw new Error("TWILIO_PHONE_NUMBER or TWILIO_MESSAGING_SERVICE_SID is missing in .env");
    }

    let formattedTo = to.toString().trim();
    // Normalize to E.164 format for India (+91)
    if (!formattedTo.startsWith('+')) {
      if (formattedTo.length === 10) {
        formattedTo = `+91${formattedTo}`;
      } else if (formattedTo.length === 12 && formattedTo.startsWith('91')) {
        formattedTo = `+${formattedTo}`;
      } else {
        formattedTo = `+${formattedTo}`;
      }
    }

    const payload = {
      body: message,
      to: formattedTo,
    };

    if (messagingServiceSid) {
      payload.messagingServiceSid = messagingServiceSid;
    } else {
      payload.from = fromNumber;
    }

    const response = await client.messages.create(payload);
    return response;
  } catch (error) {
    console.error('Twilio SMS Error:', error.message || error);
    throw error;
  }
};
