import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: Date,
    gender: String,
    bloodGroup: String,
    phone: String,
    address: String,
    emergencyContact: String,
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    medicalHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalRecord"
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
