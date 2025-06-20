import { getDoctorNotifications } from "../controllers/notificationController.js";
import express from "express";
import { Router } from "express";

const router=express.Router();

router.get('/notification/:doctorId', getDoctorNotifications);

export default router;