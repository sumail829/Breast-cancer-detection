import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/appointments/create", createAppointment);
router.get("/appointments", getAllAppointments);
router.get("/appointments/:id", getAppointmentById);
router.patch("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

export default router;
