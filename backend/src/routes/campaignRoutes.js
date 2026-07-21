import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  scheduleCampaign,
  searchAudienceUsers,
  previewCampaignAudience,
} from '../controllers/campaignController.js';
import { verifyToken, allowedRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(verifyToken, allowedRoles('admin'), createCampaign)
  .get(verifyToken, allowedRoles('admin'), getCampaigns);

// Must be registered before /:id so "audience" isn't swallowed as an id param
router.get('/audience/search', verifyToken, allowedRoles('admin'), searchAudienceUsers);
router.post('/audience/preview', verifyToken, allowedRoles('admin'), previewCampaignAudience);

router.route('/:id')
  .get(verifyToken, allowedRoles('admin'), getCampaignById)
  .put(verifyToken, allowedRoles('admin'), updateCampaign)
  .delete(verifyToken, allowedRoles('admin'), deleteCampaign);

router.post('/:id/send', verifyToken, allowedRoles('admin'), sendCampaign);
router.post('/schedule', verifyToken, allowedRoles('admin'), scheduleCampaign);

export default router;
