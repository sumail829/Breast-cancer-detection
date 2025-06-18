import express from 'express'
import doctorAuth from '../middleware/doctorAuth.js';
import { getdoctorData } from '../controllers/doctorController.js';


const router = express.Router();

router.get('/data',doctorAuth, getdoctorData);

export default router;