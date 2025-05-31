import express from "express";
import { createPatient, deleteSinglePatients, getAllPatients, getSinglePatients, loginPatient, updateSinglePatients } from "../controllers/patientController.js";
import { assignDoctor } from "../controllers/assignDoctor.js";

const router = express.Router();

router.post("/patients/signup", createPatient);
router.post("/patients/login",loginPatient);
router.get("/patients",getAllPatients);
router.get("/patients/:id",getSinglePatients);
router.patch("/patients/update/:id",updateSinglePatients);
router.delete("/patients/delete/:id",deleteSinglePatients);
router.post("/patients/assigndoctor", assignDoctor);

export default router;
