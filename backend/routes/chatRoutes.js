import express from 'express'
import { createChat, getChatMessages, getPatientDoctorPartners } from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat/sent',createChat);
router.get('/chat/history/:doctorId/:patientId',getChatMessages)
router.get('/chat/partners/patient/:patientId', getPatientDoctorPartners);



export default router;