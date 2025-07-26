import ChatMessage from "./models/ChatMessage.js"; // import your chat model

export function socketConnection(io) {
  io.on('connection', (socket) => {
    socket.on('join_room', (room) => {
      socket.join(room);
    });

    socket.on('send_message', async (data) => {
      const { room, message, sender, senderName, timestamp } = data;

      // Emit to receiver
      io.to(room).emit('receive_message', data);

      // Save to MongoDB
      try {
        const [doctorId, patientId] = room.split('_');
        await ChatMessage.create({
          senderId: sender === 'doctor' ? doctorId : patientId,
          receiverId: sender === 'doctor' ? patientId : doctorId,
          senderRole: sender === 'doctor' ? 'Doctor' : 'Patient',
          receiverRole: sender === 'doctor' ? 'Patient' : 'Doctor',
          message,
          timestamp,
        });
      } catch (err) {
        console.error('Error saving message:', err.message);
      }
    });
  });
}
