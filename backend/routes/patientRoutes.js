import express from "express";
import { createPatient, deleteSinglePatients, getAllPatients, getSinglePatients, loginPatient, updateSinglePatients ,verifyEmail, logout, resendOtp, sendResetOtp, resetPassword , isAuthenticated} from "../controllers/patientController.js";
import { assignDoctor } from "../controllers/assignDoctor.js";import patientAuth from '../middleware/patientAuth.js'

const router = express.Router();

router.post("/patients/signup", createPatient);
router.post("/patients/login",loginPatient);
router.post('/patients/verify-account', patientAuth, verifyEmail);
router.post('/patients/logout', logout);
router.post('/patients/verify-account', patientAuth, verifyEmail);
router.post('/patients/resend-otp',resendOtp);
router.get('/patientis-auth', patientAuth, isAuthenticated);
router.post('/patients/send-reset-otp',  sendResetOtp);
router.post('/patients/reset-password',  resetPassword);
router.get("/patients",getAllPatients);
router.get("/patients/:id",getSinglePatients);
router.patch("/patients/update/:id",updateSinglePatients);
router.delete("/patients/delete/:id",deleteSinglePatients);
router.post("/patients/assigndoctor", assignDoctor);

export default router;
