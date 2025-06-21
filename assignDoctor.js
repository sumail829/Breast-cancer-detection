import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";

export const assignDoctor = async (req, res) => {
  const { doctorId, patientId } = req.body;

  if (!doctorId || !patientId) {
    return res.status(400).json({ message: "Doctor ID and Patient ID are required" });
  }

  try {
    // Update patient's assigned doctor
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { assignedDoctor: doctorId },
      { new: true }
    );

    // Update doctor's patient list
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { patients: patientId } },
      { new: true }
    );

    res.status(200).json({
      message: "Doctor assigned to patient successfully",
      patient: updatedPatient,
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error("Error assigning doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
