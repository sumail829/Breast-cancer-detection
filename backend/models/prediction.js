import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  result: { type: String, enum: ['benign', 'malignant', 'pending'], required: true },
  confidence: Number,
  notes: String,
  date: { type: Date, default: Date.now }
});

export const BreastCancerPrediction = mongoose.model("BreastCancerPrediction", predictionSchema);