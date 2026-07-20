import Campaign from '../models/Campaign.model.js';
import User from '../models/User.model.js';
import EmailTemplate from '../models/EmailTemplate.model.js';
import { sendEmail } from '../utils/email/sendEmail.js';
import { sendSms } from '../utils/sms/sendSms.js';

// @desc    Create a new campaign (draft)
// @route   POST /api/campaigns
// @access  Private/Admin
export const createCampaign = async (req, res) => {
  try {
    const { name, type, filters, messageContent, emailTemplateId, subject } = req.body;

    const campaign = new Campaign({
      name,
      type,
      filters: filters || {},
      messageContent,
      emailTemplateId,
      subject,
      status: 'draft',
    });

    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error: error.message });
  }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private/Admin
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).populate('emailTemplateId', 'name');
    res.status(200).json(campaigns);
  } catch (error) {
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
    const campaign = await Campaign.findById(req.params.id).populate('emailTemplateId');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status === 'completed') {
      return res.status(400).json({ message: 'Campaign has already been sent' });
    }

    // Build the query for users based on filters
    const query = {};
    if (campaign.filters.role) {
      query.role = campaign.filters.role; // e.g., 'user' or 'vendor'
    } else {
      query.role = 'user'; // Default to users
    }
    
    if (campaign.filters.isActive !== undefined) {
      query.isActive = campaign.filters.isActive;
    }
    // Add more filter logic as needed based on User schema properties (e.g. city, subscription status)

    const users = await User.find(query);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'No users match the selected filters' });
    }

    campaign.targetCount = users.length;
    campaign.status = 'scheduled'; // Or "in-progress"
    await campaign.save();

    // Start background processing so we don't block the request for a large list
    processCampaign(campaign._id, users).catch(err => console.error('Campaign background error:', err));

    res.status(200).json({ message: 'Campaign execution started', targetCount: users.length });
  } catch (error) {
    res.status(500).json({ message: 'Error executing campaign', error: error.message });
  }
};

// Background worker function to send messages
const processCampaign = async (campaignId, users) => {
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
