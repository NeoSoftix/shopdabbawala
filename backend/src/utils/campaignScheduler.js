import cron from 'node-cron';
import Campaign from '../models/Campaign.model.js';
import { processCampaign } from '../controllers/campaignController.js';
import { resolveCampaignAudience } from './campaignAudience.js';

// Checks every minute for campaigns whose scheduledAt time has passed and sends them
export const startCampaignScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const dueCampaigns = await Campaign.find({
        status: 'scheduled',
        scheduledAt: { $lte: new Date() },
      });

      for (const campaign of dueCampaigns) {
        const users = await resolveCampaignAudience(campaign.filters);

        if (users.length === 0) {
          campaign.status = 'completed';
          campaign.targetCount = 0;
          campaign.completedAt = new Date();
          await campaign.save();
          continue;
        }

        // Mark as in-progress immediately so the next tick doesn't pick it up again
        campaign.targetCount = users.length;
        campaign.status = 'in-progress';
        await campaign.save();

        processCampaign(campaign._id, users).catch((err) =>
          console.error('Scheduled campaign error:', err)
        );
      }
    } catch (error) {
      console.error('Campaign scheduler error:', error);
    }
  });

  console.log('Campaign scheduler started');
};
