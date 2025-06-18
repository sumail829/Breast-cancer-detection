import express from 'express';
import {
  createDoctor,getAllDoctors,getDoctorById,updateDoctor,deleteDoctor,loginDoctor,logout,sendResetOtp,verifyEmail,isAuthenticated,resetPassword,sendVerifyOtp }
from '../controllers/doctorController.js';
import doctorAuth from '../middleware/doctorAuth.js';

const router = express.Router();

router.get('/doctor', getAllDoctors);
router.get('/doctor/:id', getDoctorById);
router.post('/doctor/signup', createDoctor);
router.post('/doctor/login', loginDoctor);
router.post('/doctor/logout', logout);
router.post('/doctor/send-verify-otp', doctorAuth, sendVerifyOtp);
router.post('/doctor/verify-account', doctorAuth, verifyEmail);
router.get('/doctoris-auth', doctorAuth, isAuthenticated);
router.post('/doctor/send-reset-otp',  sendResetOtp);
router.post('/doctor/reset-password',  resetPassword);
router.patch('/doctor/update/:id', updateDoctor);
router.delete('/doctor/delete/:id', deleteDoctor);



export default router;
