import ChatMessage from "../models/ChatMessage.js";
import doctor from "../models/doctor.js";

export const createChat = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const newMessage = new ChatMessage(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message saved' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getChatMessages = async (req, res) => {
  const { doctorId, patientId } = req.params;

  if (!doctorId || !patientId) {
    return res.status(400).json({ success: false, error: 'Missing doctorId or patientId' });
  }

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: doctorId, receiverId: patientId },
        { senderId: patientId, receiverId: doctorId },
      ],
    }).sort({ timestamp: 1 }); 

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getPatientDoctorPartners = async (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ success: false, error: 'Missing patientId' });
  }

  try {
    const doctorIds = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { senderId: mongoose.Types.ObjectId(patientId), senderRole: 'Patient' },
            { receiverId: mongoose.Types.ObjectId(patientId), receiverRole: 'Patient' },
          ],
        },
      },
      {
        $project: {
          doctorId: {
            $cond: [
              { $eq: ['$senderRole', 'Doctor'] },
              '$senderId',
              '$receiverId',
            ],
          },
        },
      },
      {
        $group: { _id: '$doctorId' },
      },
    ]);

    const doctorIdsArray = doctorIds.map((d) => d._id);

    const doctors = await Doctor.find({ _id: { $in: doctorIdsArray } }).select('_id firstName lastName specialization');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};