import express from 'express'
import { createChat, getChatMessage } from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat/sent',createChat);
router.get('/chat/history/:doctorId/:patientId',getChatMessage)


export default router;