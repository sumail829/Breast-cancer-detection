import { Appointment } from "../models/appointment.js"

import { Notification } from "../models/notification.js";
export const createAppointment = async (req, res) => {
  try {
    console.log("📥 Incoming request:", req.body); // 👈 Add this
    const { patientId, doctorId, date, notes } = req.body;

    if (!patientId || !doctorId || !date) {
      return res.status(400).json({ message: "Patient ID, Doctor ID, and Date are required." });
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      notes
    });

    const savedAppointment = await newAppointment.save();

    // 👇 Wait for notification before sending response
    await Notification.create({
      recipient: doctorId,
      sender: patientId,
      type: 'appointment',
      message: `New appointment request on ${date}`
    });

    return res.status(201).json({ message: "Appointment created and notification sent", appointment: savedAppointment });

  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Accept Appointment Request
export const acceptAppointmentRequest = async (req, res) => {
  try {
    const { doctorId, patientId, originalNotificationId } = req.body;

    if (!doctorId || !patientId || !originalNotificationId) {
      return res.status(400).json({ message: "doctorId, patientId and originalNotificationId are required" });
    }

    // 1. Delete the original notification (sent to doctor)
    await Notification.findByIdAndDelete(originalNotificationId);

    // 2. Create a new notification to notify the patient
    const acceptedNotification = new Notification({
      sender: doctorId,
      recipient: patientId,
      type: "notification",
      message: "Your appointment request has been accepted by the doctor.",
      status: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await acceptedNotification.save();

    return res.status(200).json({ message: "Notification sent to patient successfully" });
  } catch (error) {
    console.error("Error accepting appointment request:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// READ All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name email specialization");

    // Add dynamic status based on current date
    const todayNepal = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kathmandu' }); // YYYY-MM-DD


    const updatedAppointments = appointments.map(app => {
      const appointmentNepal = new Date(app.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kathmandu' });

      let status;
      if (appointmentNepal < todayNepal) status = "completed";
      else if (appointmentNepal === todayNepal) status = "ongoing";
      else status = "upcoming";

      return {
        ...app._doc,
        status
      };
    });

    res.status(200).json({ message: "Appointments fetched", appointments: updatedAppointments });

  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// READ Single Appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "firstName lastName phone email age gender")
      .populate("doctorId", "fullName email specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment fetched", appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAppointmentByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const getDoctor = await Appointment.find({ doctorId })
      .populate("patientId", "firstName lastName phone age gender email")
      .populate("doctorId", "firstName lastName email specialization");
    return res.status(200).json({ message: "appointment by doctorId fetched successfully ", DoctorAppo: getDoctor })
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// UPDATE Appointment
export const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated", appointment: updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE Appointment
// DELETE Appointment with Notification
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Store appointment details before deletion
    const appointmentData = {
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      status: appointment.status,
      // Add other relevant fields you want to include in notification
    };

    console.log('Appointment data before deletion:', appointmentData);

    // Delete the appointment
    await Appointment.findByIdAndDelete(req.params.id);

    // Create notification for appointment rejection
    await createNotification({
      recipient: appointmentData.patientId, // Patient receives the notification
      sender: appointmentData.doctorId, // Doctor is rejecting the appointment
      type: 'appointment',
      message: `Your appointment scheduled for ${new Date(appointmentData.date).toLocaleDateString()} has been rejected.`,
    });

    res.status(200).json({ message: "Appointment deleted and notification sent" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to create notification
const createNotification = async (notificationData) => {
  try {
    console.log('Creating notification with data:', notificationData);

    const notification = new Notification({
      recipient: notificationData.recipient,
      sender: notificationData.sender,
      type: notificationData.type,
      message: notificationData.message,
      read: false,
      createdAt: new Date()
    });

    const savedNotification = await notification.save();
    console.log('Notification created successfully:', savedNotification);
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw error here to prevent deletion rollback
  }
};