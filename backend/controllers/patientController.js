import Patient from "../models/patient.js";


export const createPatient = async (req, res) => {
  try {
    const {
      firstName, lastName,email,dateOfBirth,gender, bloodGroup,phone, address, emergencyContact, assignedDoctor,
    } = req.body;

    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !dateOfBirth ||
      !gender ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // Create new patient instance
    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      assignedDoctor,
    });

    // Save to DB
    const savedPatient = await newPatient.save();

    res.status(201).json({
      message: "Patient created successfully",
      patient: savedPatient,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getAllPatients = async (req, res) => {
    try {
        const patients=await Patient.find();
         if(!patients){
            return res.status(404).json({message:"No patients available"})
         }

         return res.status(200).json({message:"patients fetched successfully",patients})
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const getSinglePatients = async (req, res) => {
    try {
        const patients=await Patient.findById(req.params.id)
         if(!patients){
            return res.status(404).json({message:"No patients available"})
         }

         return res.status(200).json({message:"patients fetched successfully",patients})
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}


export const updateSinglePatients = async (req, res) => {
    try {
        const updatePatients=await Patient.findByIdAndUpdate(req.params.id,req.body,{new:true})
         if(!updatePatients){
            return res.status(404).json({message:"No patients Found"})
         }


         return res.status(200).json({message:"patients deleted successfully",updatePatients})
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}


export const deleteSinglePatients = async (req, res) => {
    try {
        const deletePatients=await Patient.findByIdAndDelete(req.params.id)
         if(!deletePatients){
            return res.status(404).json({message:"No patients Found"})
         }


         return res.status(200).json({message:"patients deleted successfully",deletePatients})
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}