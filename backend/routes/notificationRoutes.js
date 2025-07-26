import { getDoctorNotifications,createNotification, getPatientNotifications } from "../controllers/notificationController.js";
import express from "express";
import { Router } from "express";

const router=express.Router();

router.get('/notification/:doctorId', getDoctorNotifications);
router.get('/notification/patient/:patientId', getPatientNotifications);
router.post("/notification", createNotification);

export default router;