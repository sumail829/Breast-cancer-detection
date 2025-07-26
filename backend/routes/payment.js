import express from 'express';
import { initiatePayment, verifyKhaltiPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate-payment', initiatePayment);
router.post('/khalti/verify', verifyKhaltiPayment); // ✅ POST

export default router;
