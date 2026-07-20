import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  sendCampaign,
} from '../controllers/campaignController.js';
import { verifyToken, allowedRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(verifyToken, allowedRoles('admin'), createCampaign)
  .get(verifyToken, allowedRoles('admin'), getCampaigns);

router.route('/:id')
  .get(verifyToken, allowedRoles('admin'), getCampaignById);

router.post('/:id/send', verifyToken, allowedRoles('admin'), sendCampaign);

export default router;
