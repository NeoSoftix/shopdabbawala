import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['email', 'sms'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'completed', 'failed'],
      default: 'draft',
    },
    filters: {
      type: Object, // Will store filters like { role: 'user', isActive: true, city: 'Delhi' }
      default: {},
    },
    targetCount: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    // For SMS Campaigns
    messageContent: {
      type: String,
    },
    // For Email Campaigns
    subject: {
      type: String,
    },
    emailTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmailTemplate',
    },
    scheduledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
