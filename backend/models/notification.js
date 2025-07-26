import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, enum: ['appointment','notification'], default: 'appointment' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);
