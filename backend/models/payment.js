import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  amount: { type: Number, required: true }, // in paisa
  transactionId: { type: String },
  status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  paymentDate: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', paymentSchema);
