import express from 'express';
import { handleIncomingWhatsApp } from '../controllers/whatsappBotController.js';

const router = express.Router();

// Twilio sends a POST request to this endpoint when a WhatsApp message is received
router.post('/whatsapp', handleIncomingWhatsApp);

export default router;
