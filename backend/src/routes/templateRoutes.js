import express from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController.js';
import { verifyToken, allowedRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(verifyToken, allowedRoles('admin'), createTemplate)
  .get(verifyToken, allowedRoles('admin'), getTemplates);

router.route('/:id')
  .get(verifyToken, allowedRoles('admin'), getTemplateById)
  .put(verifyToken, allowedRoles('admin'), updateTemplate)
  .delete(verifyToken, allowedRoles('admin'), deleteTemplate);

export default router;
