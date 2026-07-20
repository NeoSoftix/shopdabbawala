import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    htmlContent: {
      type: String,
      required: true, // The compiled HTML from the editor
    },
    designJson: {
      type: Object,
      required: true, // The JSON format used by react-email-editor to re-load the design
    },
  },
  {
    timestamps: true,
  }
);

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

export default EmailTemplate;
