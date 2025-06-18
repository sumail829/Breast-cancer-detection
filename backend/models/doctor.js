import mongoose from "mongoose";
import Counter from "./counterModel.js"; // Import the counter model

const DoctorSchema = new mongoose.Schema({
  doctorId: { type: Number, unique: true }, // Auto-incremented
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: ' ' },
  resetOtpExpireAt: { type: Number, default: 0 },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  role: {
    type: String,
    default: "doctor",
    enum: ["doctor"],
  },
}, { timestamps: true });

// Pre-save middleware to auto-increment doctorId
DoctorSchema.pre("save", async function (next) {
  if (this.isNew && !this.doctorId) {
    const counter = await Counter.findOneAndUpdate(
      { id: "doctorId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // If new document created and seq was undefined, initialize manually
    if (counter.seq === 1) {
      // Manually update it to 9999 so next will be 10000
      counter.seq = 9999;
      await counter.save();
      this.doctorId = 10000;
    } else {
      this.doctorId = counter.seq;
    }
  }
  next();
});


export default mongoose.model("Doctor", DoctorSchema);
