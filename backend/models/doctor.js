import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  role: {
    type: String,
    default: "doctor",
    enum: ["doctor"],
  },
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);
