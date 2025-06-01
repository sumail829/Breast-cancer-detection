import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  diagnosis: { type: String, required: true },
  prescription: String,
  notes: String,
  date: { type: Date, default: Date.now }
});

export const MedicalRecord = mongoose.model("medicalRecord", medicalRecordSchema);
