
import Doctor from "../models/doctor.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config';

// ✅ CREATE a doctor
export const createDoctor = async (req, res) => {
  try {
    const { specialization, department, phone, patient, email, password, firstName, lastName } = req.body;

    if (!specialization || !department || !phone || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const doctorExists = await Doctor.findOne({ email: email })
    if (doctorExists) {
      return res.status(400).json({ message: "Doctor already exists" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const newDoctor = new Doctor({
      specialization,
      firstName,
      lastName,
      email,
      password: hashedpassword,
      department,
      phone,
      patients: patient ? [patient.fullName] : [],
    });

    const doctor = await newDoctor.save();

    res.status(201).json({
      message: "Doctor created successfully",
      doctor
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }
    const doctor = await Doctor.findOne({ email: email })
    if (!doctor) {
      return res.status(404).json({ message: "No doctor found" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credential" });
    }
    const token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
    const { password: _, ...doctorWithoutPassword } = doctor._doc; // Exclude password from response
    return res.status(200).json({ message: "Login successful",token, doctor:doctorWithoutPassword });
  } catch (error) {
    console.error("Error Login doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ READ all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    if(!doctors){
      return res.status(404).json({message:"No doctor found"})
    }
    res.status(200).json({message:"doctor fetched successfully",doctors});
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
