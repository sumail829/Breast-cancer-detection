import Patient from "../models/patient.js";
import cloudinary from "cloudinary"
import multer from "multer";
const upload = multer({ dest: 'uploads/' })
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


cloudinary.config({
    cloud_name: "dnhun2a8m",
    api_key: "418397955729357",
    api_secret: "-4W76HpN8R9DU03vEabY9BgfuMM"
})

export const createPatient = async (req, res) => {
  try {
    const {
      firstName, lastName, age, email, dateOfBirth, gender, bloodGroup, phone, address, emergencyContact, assignedDoctor, password, confirmPassword
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !age || !email || !dateOfBirth || !gender || !phone || !address || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    } 
    const patientExist=await Patient.find({email:email});
    if(!patientExist){
      return res.status(400).json({message:"Patient already exist with that email"})
    }
     const salt=await bcrypt.genSalt(10);
    const hassedPassword=await bcrypt.hash(password,salt)

    // Create new patient instance
    const newPatientData = {
      firstName,
      lastName,
      age,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      password:hassedPassword,
      confirmPassword,
    };

    if (assignedDoctor && mongoose.Types.ObjectId.isValid(assignedDoctor)) {
      newPatientData.assignedDoctor = assignedDoctor;
    }
    if(password!==confirmPassword){
      return res.status(400).json({message:"password and confirmPassword are not same"})
    }

    const newPatient = new Patient(newPatientData);
     
    // Save to DB
    const savedPatient = await newPatient.save();

    res.status(201).json({
      message: "Patient created successfully",
      patient: savedPatient,
    });
  } catch (error) {
    console.error("Error creating patients:", error);
    res.status(500).json({ message: "Internal server error" });
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
   const isMatch=await bcrypt.compare(password,patient.password);
   if(!isMatch){
    return res.status(401).json({message:"Invalid credential"})
   }
   const token=jwt.sign({id:patient._id,role:patient.role},process.env.JWT_SECRET,{expiresIn:"30d"})
   const {password:_,...patientWithoutPassword}=patient._doc;
    return res.status(200).json({ message: "Login successful",token, patient:patientWithoutPassword })

  } catch (error) {
    console.error("Error logging in patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const imageUpload = [
  upload.single('imageUrl'),
  async (req, res) => {
    try {
      const { patientId } = req.body;
      const img = req.file;

      if (!img) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const response = await cloudinary.uploader.upload(img.path);
      console.log(response, "cloudinary response");

      const updatedRecord = await Patient.findOneAndUpdate(
        { patientId },
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
    if (!patients) {
      return res.status(404).json({ message: "No patients available" })
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