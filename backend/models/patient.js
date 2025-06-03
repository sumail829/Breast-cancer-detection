import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String},
    dateOfBirth: Date,
    gender: String,
    bloodGroup: String,
    phone: String,
    address: String,
    emergencyContact: String,
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor",required:false },
    medicalHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalRecord"
        }
    ],
     role: {
    type: String,
    default: "patient",
    enum: ["patient"],
  },
    createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;




























