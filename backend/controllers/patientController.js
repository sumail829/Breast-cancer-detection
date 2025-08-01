import Patient from "../models/patient.js";
import cloudinary from "cloudinary"
import multer from "multer";
const upload = multer({ dest: 'uploads/' })
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import 'dotenv/config';
import nodemailer from "nodemailer";
import otpStore from "../utils/otpStore.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // your project email
    pass: process.env.EMAIL_PASS, // app password
  },
});
export const createPatient = async (req, res) => {
  try {

    const {
      firstName, lastName, age, email, dateOfBirth, gender,
      bloodGroup, phone, address, emergencyContact, password, confirmPassword
    } = req.body;

    // ✅ Strict required field check
    if (
      !firstName || !lastName || !age || !email || !dateOfBirth || !gender ||
      !phone || !address || !password || !confirmPassword || !bloodGroup
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // ✅ Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ Check for existing patient
    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Patient already exists with that email" });
    }

    // ✅ Generate OTP only if all checks pass
    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      data: req.body,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // ✅ Send OTP
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP - Breast Cancer Detection",
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });

    return res.status(200).json({ message: "OTP sent to your email. Please verify to complete signup." });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPatientOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email);
    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    const data = record.data;
    otpStore.delete(email);

    // 🛡️ Defensive check: ensure no doctor-related fields leak in
    if (data.role && data.role !== 'patient') {
      delete data.role;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // ✅ Safely create Patient by explicitly listing fields
    const newPatient = new Patient({
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      phone: data.phone,
      address: data.address,
      emergencyContact: data.emergencyContact,
      password: hashedPassword,
      assignedDoctor: data.assignedDoctor || null,
    });

    const savedPatient = await newPatient.save();

    return res.status(201).json({ message: "Patient verified and registered", patient: savedPatient });

  } catch (error) {
    console.error("OTP Verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }
    const patient = await Patient.findOne({ email: email })
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credential" })
    }
    const token = jwt.sign({ id: patient._id, role: patient.role }, process.env.JWT_SECRET, { expiresIn: "30d" })
    const { password: _, ...patientWithoutPassword } = patient._doc;
    return res.status(200).json({ message: "Login successful", token, patient: patientWithoutPassword })

  } catch (error) {
    console.error("Error logging in patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const imageUpload = [
  upload.single('imageUrl'),
  async (req, res) => {
    
    try {
     const patientId = req.user.id;
      const img = req.file;

      if (!img) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const response = await cloudinary.uploader.upload(img.path);
      console.log(response, "cloudinary response");

      const updatedRecord = await Patient.findOneAndUpdate(
   { _id: patientId },    
        { imageUrl: response.secure_url },
        { new: true }
      );

      if (!updatedRecord) {
        return res.status(404).json({ message: "Patient record not found for this patient" });
      }

      // Call FastAPI predict endpoint
      const predictionResponse = await axios.post("http://localhost:8000/predict", {
        image_url: response.secure_url
      });

      return res.status(200).json({
        message: "Image uploaded, record updated, and prediction done",
        record: updatedRecord,
        prediction: predictionResponse.data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error uploading image or updating record' });
    }
  }
];



export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients available" });
    }

    return res.status(200).json({ message: "patients fetched successfully", patients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}

export const getSinglePatients = async (req, res) => {
  try {
    const patients = await Patient.findById(req.params.id)
    if (!patients) {
      return res.status(404).json({ message: "No patients available" })
    }

    return res.status(200).json({ message: "patients fetched successfully", patients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server errors" });

  }
}


export const updateSinglePatients = async (req, res) => {
  try {
    const updatePatients = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatePatients) {
      return res.status(404).json({ message: "No patients Found" })
    }


    return res.status(200).json({ message: "patients deleted successfully", updatePatients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}


export const deleteSinglePatients = async (req, res) => {
  try {
    const deletePatients = await Patient.findByIdAndDelete(req.params.id)
    if (!deletePatients) {
      return res.status(404).json({ message: "No patients Found" })
    }


    return res.status(200).json({ message: "patients deleted successfully", deletePatients })
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}