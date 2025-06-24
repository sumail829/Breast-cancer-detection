import mongoose from "mongoose";
import Counter from "./counterModel.js"; // Import the counter model

const patientSchema = new mongoose.Schema({
     patientId: { type: Number, unique: true }, // Auto-incremented
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    dateOfBirth: { type: Date, required: true },
    gender: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
       
    },
    phone: {
  type: String,
  required: true,
  match: /^[0-9]{10}$/  // For 10-digit phone numbers (Nepal format, etc.)
},
    address: {type : String, required: true},
    emergencyContact: {type:  String},
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: false },

     verifyOtp: { type: String, default: '' },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: ' ' },
  resetOtpExpireAt: { type: Number, default: 0 },
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


// Pre-save middleware to auto-increment patientId
patientSchema.pre("save", async function (next) {
  if (this.isNew && !this.patientId) {
    const counter = await Counter.findOneAndUpdate(
      { id: "patientId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // If new document created and seq was undefined, initialize manually
    if (counter.seq === 1) {
      // Manually update it to 9999 so next will be 10000
      counter.seq = 9999;
      await counter.save();
      this.patientId = 10000;
    } else {
      this.patientId = counter.seq;
    }
  }
  next();
});


const Patient = mongoose.model("Patient", patientSchema);
export default Patient;




























