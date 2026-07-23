import Campaign from '../models/Campaign.model.js';
import EmailTemplate from '../models/EmailTemplate.model.js';
import User from '../models/User.model.js';
import { sendEmail } from '../utils/email/sendEmail.js';
import { sendSms } from '../utils/sms/sendSms.js';
import { resolveCampaignAudience } from '../utils/campaignAudience.js';
import { getPagination } from '../utils/pagination.js';
import mongoose from 'mongoose';

// @desc    Search users by name/email/phone to hand-pick campaign recipients
// @route   GET /api/campaigns/audience/search?search=&role=
// @access  Private/Admin
export const searchAudienceUsers = async (req, res) => {
  try {
    const { search = '', role } = req.query;

    if (!search.trim()) {
      return res.status(200).json({ users: [] });
    }

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('name email phone role isActive').limit(20);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};

// @desc    Preview how many users match a set of filters (without sending)
// @route   POST /api/campaigns/audience/preview
// @access  Private/Admin
export const previewCampaignAudience = async (req, res) => {
  try {
    const { filters } = req.body;
    const users = await resolveCampaignAudience(filters || {});
    res.status(200).json({ count: users.length });
  } catch (error) {
    res.status(500).json({ message: 'Error previewing audience', error: error.message });
  }
};

// @desc    Create a new campaign (draft)
// @route   POST /api/campaigns
// @access  Private/Admin
export const createCampaign = async (req, res) => {
  try {
    const { name, type, filters, messageContent, emailTemplateId, subject,} = req.body;

    // Validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Campaign name and type are required",
      });
    }

    if (type === "email") {
      if (!subject || !emailTemplateId) {
        return res.status(400).json({
          success: false,
          message: "Subject and email template are required for email campaign",
        });
      }
    }

    if (type === "sms" || type === "whatsapp") {
      if (!messageContent) {
        return res.status(400).json({
          success: false,
          message: "Message content is required",
        });
      }
    }

    const campaign = await Campaign.create({
      name: name.trim(),
      type,
      filters: filters || {},
      messageContent,
      emailTemplateId,
      subject,
      status: "draft",
    });

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: campaign,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating campaign",
      error: error.message,
    });
  }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private/Admin
export const getCampaigns = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [campaigns, total] = await Promise.all([
      Campaign.find()
        .sort({ createdAt: -1 })
        .populate('emailTemplateId', 'name')
        .skip(skip)
        .limit(limit),
      Campaign.countDocuments(),
    ]);

    res.status(200).json({
      campaigns,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Campaigns error", error)

    res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private/Admin
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('emailTemplateId');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign', error: error.message });
  }
};

// @desc    Send/Execute a campaign
// @route   POST /api/campaigns/:id/send
// @access  Private/Admin
export const sendCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign id",
      });
    }

    const campaign = await Campaign.findById(id).populate("emailTemplateId");

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    if (campaign.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Campaign has already been sent",
      });
    }

    if (campaign.status === "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Campaign is already being sent",
      });
    }

    const users = await resolveCampaignAudience(campaign.filters);

    if (!users.length) {
      return res.status(400).json({
        success: false,
        message: "No users match the selected filters",
      });
    }

    // Atomically claim the campaign for sending - flips status straight to
    // "in-progress" (not "scheduled") so it can no longer be picked up by
    // scheduleCampaign or the cron scheduler while this send is in flight.
    // Only one concurrent "Send Now" click (or a scheduler race) can win
    // this update; a competing call gets null back and bails out below
    // instead of also launching processCampaign for the same audience.
    const claimed = await Campaign.findOneAndUpdate(
      { _id: id, status: { $in: ["draft", "scheduled"] } },
      { $set: { status: "in-progress", targetCount: users.length } },
      { new: true }
    );

    if (!claimed) {
      return res.status(400).json({
        success: false,
        message: "Campaign is already being sent or has already been sent",
      });
    }

    // Run in background
    processCampaign(claimed._id, users).catch((err) =>
      console.error("Campaign background error:", err)
    );

    return res.status(200).json({
      success: true,
      message: "Campaign execution started",
      targetCount: users.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error executing campaign",
      error: error.message,
    });
  }
};

// Background worker function to send messages
export const processCampaign = async (campaignId, users) => {
  const campaign = await Campaign.findById(campaignId).populate('emailTemplateId');
  if (!campaign) return;

  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    try {
      if (campaign.type === 'email') {
        if (!user.email) throw new Error('No email address');
        const html = campaign.emailTemplateId?.htmlContent || campaign.messageContent;
        await sendEmail(user.email, campaign.subject || 'Campaign Message', html);
      } else if (campaign.type === 'sms') {
        if (!user.phone) throw new Error('No phone number');
        await sendSms(user.phone, campaign.messageContent);
      }
      successCount++;
    } catch (error) {
      console.error(`Failed to send to ${user._id}:`, error.message);
      failureCount++;
    }
    
    // Optional delay to prevent rate limits (e.g. Twilio/Brevo limits)
    await new Promise(resolve => setTimeout(resolve, 100)); 
  }

  campaign.successCount = successCount;
  campaign.failureCount = failureCount;
  campaign.status = 'completed';
  campaign.completedAt = new Date();
  await campaign.save();
};

// @desc    Update a campaign (draft or scheduled only)
// @route   PUT /api/campaigns/:id
// @access  Private/Admin
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      filters,
      messageContent,
      emailTemplateId,
      subject,
      scheduledAt,
    } = req.body;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign id",
      });
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    if (!["draft", "scheduled"].includes(campaign.status)) {
      return res.status(400).json({
        success: false,
        message: "Only draft or scheduled campaigns can be edited",
      });
    }

    if (name !== undefined) campaign.name = name.trim();

    if (type !== undefined) campaign.type = type;

    if (filters !== undefined) campaign.filters = filters;

    if (messageContent !== undefined) campaign.messageContent = messageContent;

    if (emailTemplateId !== undefined)
      campaign.emailTemplateId = emailTemplateId;

    if (subject !== undefined) campaign.subject = subject;

    if (scheduledAt !== undefined) {
      if (new Date(scheduledAt) <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Schedule time must be in the future",
        });
      }

      campaign.scheduledAt = scheduledAt;
      campaign.status = "scheduled";
    }

    const updatedCampaign = await campaign.save();

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: updatedCampaign,
    });
  } catch (error) {
    console.error("Update Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// scheduel the campaign
export const scheduleCampaign = async (req, res) => {
  try {
    const { campaignId, scheduledAt } = req.body;

    if (!scheduledAt) {
      return res.status(400).json({
        message: "Schedule date is required",
      });
    }

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    if (campaign.status === "in-progress") {
      return res.status(400).json({
        message: "Cannot schedule a campaign that is currently being sent",
      });
    }

    if (new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({
        message: "Schedule time must be in the future",
      });
    }

    campaign.status = "scheduled";

    campaign.scheduledAt = scheduledAt;

    await campaign.save();

    return res.status(200).json({
      message: "Campaign scheduled successfully",
      campaign,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private/Admin
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found', success: false });
    }

    if (campaign.status === 'in-progress') {
      return res.status(400).json({
        message: 'Cannot delete a campaign that is currently sending',
        success: false,
      });
    }

    await campaign.deleteOne();

    res.status(200).json({
     message: 'Campaign deleted successfully',
      success: true 
    });

  } catch (error) {
    console.error('Delete Campaign error', error);

    res.status(500).json({
      message: 'Internal Server error', success: false });
  }
};