import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  prescription: String,
  notes: String,
  date: {
    type: Date,
    default: Date.now
  },

  // 🆕 Added fields for image-based prediction
  imageUrl: {
    type: String // local file path or cloud storage URL
  },
  diagnosisResult: {
    type: String,
    enum: ["Benign", "Malignant", "Pending"],
    default: "Pending"
  },
  predictionConfidence: {
    type: Number // Example: 0.87 for 87% confidence
  },
  predictionDate: {
    type: Date
  }
});

export const MedicalRecord = mongoose.model("medicalRecord", medicalRecordSchema);
