import express from "express";
import {
    createMedicalReport,
    getAllMedicalRecords,
    getRecordsByPatient,
    getRecordsByDoctor,
    getSingleRecord,
    updateMedicalRecord,
    deleteMedicalRecord
} from "../controllers/medicalRecordController.js";

const router = express.Router();

router.post("/records/create", createMedicalReport);
router.get("/records", getAllMedicalRecords);
router.get("/records/patient/:patientId", getRecordsByPatient);
router.get("/records/doctor/:doctorId", getRecordsByDoctor);
router.get("/records/:id", getSingleRecord);
router.patch("/records/update/:id", updateMedicalRecord);
router.delete("/records/delete/:id", deleteMedicalRecord);

export default router;
