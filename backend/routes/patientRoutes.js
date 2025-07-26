import express from "express";
import { createPatient, deleteSinglePatients, getAllPatients, getSinglePatients, imageUpload, loginPatient, updateSinglePatients, verifyPatientOtp } from "../controllers/patientController.js";
import { assignDoctor } from "../controllers/assignDoctor.js";
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.post("/patients/signup", createPatient);
router.post("/patients/verify-otp", verifyPatientOtp);
router.post("/patients/login",loginPatient);
router.post("/patients/uploadImage", verifyToken, imageUpload)
router.get("/patients",getAllPatients);
router.get("/patients/:id",getSinglePatients);
router.patch("/patients/update/:id",updateSinglePatients);
router.delete("/patients/delete/:id",deleteSinglePatients);
router.post("/patients/assigndoctor", assignDoctor);

export default router;
