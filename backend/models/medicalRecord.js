import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  diagnosis: { type: String, required: true },
  prescription: String,
  notes: String,
  date: { type: Date, default: Date.now },
  diagnosisResult: { type: String, enum: ["Benign", "Malignant", "Pending"], default: "Pending" },
  predictionConfidence: Number,
  predictionDate: Date
}, { timestamps: true });

export const MedicalRecord = mongoose.model("medicalRecord", medicalRecordSchema);
