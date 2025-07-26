import ChatMessage from "../models/ChatMessage.js";

export const createChat= async (req, res) => {
  try {
    const newMessage = new ChatMessage(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message saved' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getChatMessage= async (req, res) => {
  const { doctorId, patientId } = req.params;
  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: doctorId, receiverId: patientId },
        { senderId: patientId, receiverId: doctorId },
      ],
    }).sort({ timestamp: 1 }); // oldest to newest

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};