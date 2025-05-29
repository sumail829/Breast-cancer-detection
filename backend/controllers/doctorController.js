import Doctor from "../models/doctor.js";

// ✅ CREATE a doctor
export const createDoctor = async (req, res) => {
  try {
    const { specialization, department, phone, patient } = req.body;

    if (!specialization || !department || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDoctor = new Doctor({
      specialization,
      department,
      phone,
      patients: patient ? [patient] : [],
    });

    const doctor = await newDoctor.save();

    res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ READ all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ READ one doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("patients");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE doctor
export const updateDoctor = async (req, res) => {
  try {
    const { specialization, department, phone, patients } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { specialization, department, phone, patients },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE doctor
export const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
