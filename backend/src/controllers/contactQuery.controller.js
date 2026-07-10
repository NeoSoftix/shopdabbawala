import ContactQuery from "../models/contactQuery.model.js";
import User from "../models/User.model.js";
import { sendEmail } from "../utils/email/sendEmail.js";
import { contactQueryTemplate } from "../utils/email/contactQueryTemplate.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s'.-]+$/;

// Every Contact Us submission must always reach this inbox, regardless of
// which admin accounts happen to exist in the DB.
const CONTACT_FORM_RECEIVER_EMAIL = "neosoftix@gmail.com";

// Every field gets its own required + length + format check so the caller
// gets back one specific message instead of a generic "invalid form".
const validateContactPayload = ({ name, email, phone, subject, message }) => {
  const trimmedName = (name || "").trim();
  const trimmedEmail = (email || "").trim();
  const trimmedPhone = (phone || "").trim();
  const trimmedSubject = (subject || "").trim();
  const trimmedMessage = (message || "").trim();

  if (!trimmedName) return "Full name is required.";
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return "Full name must be between 2 and 100 characters.";
  }
  if (!NAME_REGEX.test(trimmedName)) {
    return "Full name can only contain letters, spaces, apostrophes and hyphens.";
  }

  if (!trimmedEmail) return "Email address is required.";
  if (trimmedEmail.length > 150) return "Email address is too long.";
  if (!EMAIL_REGEX.test(trimmedEmail)) return "Please enter a valid email address.";

  if (!trimmedPhone) return "Phone number is required.";
  const digitsOnly = trimmedPhone.replace(/\D/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return "Phone number must be between 7 and 15 digits.";
  }

  if (!trimmedSubject) return "Subject is required.";
  if (trimmedSubject.length < 3 || trimmedSubject.length > 150) {
    return "Subject must be between 3 and 150 characters.";
  }

  if (!trimmedMessage) return "Message is required.";
  if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
    return "Message must be between 10 and 2000 characters.";
  }

  return null;
};

// Public Contact Us form submission: validates every field, stores the
// query, emails every admin, and returns a reference id + timestamp so the
// frontend can render a proper Thank You confirmation.
export const submitContactQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const validationError = validateContactPayload({ name, email, phone, subject, message });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const query = await ContactQuery.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Fire-and-forget: a slow/failing email send should never block the
    // response the user is waiting on to see the Thank You page.
    (async () => {
      try {
        const admins = await User.find({ role: "admin" }).select("email");

        const recipients = new Set([CONTACT_FORM_RECEIVER_EMAIL]);
        admins.forEach((admin) => {
          if (admin.email) recipients.add(admin.email);
        });

        const html = contactQueryTemplate({
          name: query.name,
          email: query.email,
          phone: query.phone,
          subject: query.subject,
          message: query.message,
          referenceId: query._id.toString(),
        });

        recipients.forEach((recipientEmail) => {
          sendEmail(recipientEmail, `New Contact Query: ${query.subject}`, html).catch((error) =>
            console.error(`submitContactQuery: email FAILED for ${recipientEmail}:`, error.response?.data || error.message)
          );
        });
      } catch (error) {
        console.error("submitContactQuery: admin lookup/email failed:", error.message);
      }
    })();

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      referenceId: query._id.toString(),
      submittedAt: query.createdAt,
    });
  } catch (error) {
    console.error("Submit Contact Query Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message.",
      error: error.message,
    });
  }
};
