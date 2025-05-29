import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  specialization: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  patients: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
});

export default mongoose.model("Doctor",DoctorSchema);