import express from "express";
import { createPatient, deleteSinglePatients, getAllPatients, getSinglePatients, updateSinglePatients } from "../controllers/patientController.js";


const router = express.Router();

router.post("/patients/signup", createPatient);
router.get("/patients",getAllPatients);
router.get("/patients/:id",getSinglePatients);
router.patch("/patients/update/:id",updateSinglePatients);
router.delete("/patients/delete/:id",deleteSinglePatients);

export default router;
