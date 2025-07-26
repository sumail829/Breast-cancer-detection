import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentByDoctorId,
  acceptAppointmentRequest,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/appointments/create", createAppointment);
router.get("/appointments", getAllAppointments);
router.get("/appointments/:id", getAppointmentById);
router.patch("/appointments/:id", updateAppointment);
router.delete("/appointments/delete/:id", deleteAppointment);
router.get("/appointments/doctor/:doctorId",getAppointmentByDoctorId)
router.post("/appointments/accept", acceptAppointmentRequest);


export default router;
