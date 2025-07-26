// models/ChatMessage.js
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderRole' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverRole' },
  senderRole: { type: String, enum: ['Doctor', 'Patient'], required: true },
  receiverRole: { type: String, enum: ['Doctor', 'Patient'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

export default mongoose.model('ChatMessage', chatMessageSchema);
