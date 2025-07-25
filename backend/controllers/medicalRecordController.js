import { config } from "dotenv";
import { MedicalRecord } from "../models/medicalRecord.js";


// 1. Create Medical Record
export const createMedicalReport = async (req, res) => {
    try {
        const {
            doctorId,
            patientId,
            diagnosis,
            prescription,
            notes,
            diagnosisResult,
            predictionConfidence,
            predictionDate
        } = req.body;

        if (!doctorId || !patientId || !diagnosis || !prescription || !notes) {
            return res.status(400).json({ message: "All fields must be filled" });
        }

        const newMedicalReport = new MedicalRecord({
            doctorId,
            patientId,
            diagnosis,
            prescription,
            notes,
            diagnosisResult,
            predictionConfidence,
            predictionDate: predictionDate ? new Date(predictionDate) : undefined
        });

        const savedReport = await newMedicalReport.save(); // ✅ fixed

        res.status(201).json({ message: "Medical record created", record: savedReport });

    } catch (error) {
        console.error("Error creating medical record:", error);
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};


// export const imageUpload = [upload.single('imageUrl'), async (req, res) => {    
//     try {
//         const recordId = req.params.id;
//         const img = req.file;
//         if (!img) return res.status(400).json({ message: "No image file uploaded" });
//         console.log(req.file, "file");
//          const response = await cloudinary.uploader.upload(req.file.path);
//       console.log(response, "response");

//       // Update existing record with image URL
//       const updatedRecord = await MedicalRecord.findByIdAndUpdate(
//         recordId,
//         {
//           imageUrl: response.secure_url
//         },
//         { new: true }
//       );

//       if (!updatedRecord) {
//         return res.status(404).json({ message: "Medical record not found" });
//       }

//       return res.status(200).json({
//         message: "Image uploaded and record updated",
//         record: updatedRecord
//       });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error uploading image or updating record' });
//     }
// }
// ]




// 2. Get All Medical Records
export const getAllMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find().populate('doctorId').populate('patientId');
        res.status(200).json({ records });
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3. Get Medical Records by Patient ID
export const getRecordsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const records = await MedicalRecord.find({ patientId }).populate('doctorId').sort({ createdAt: -1 });;
        res.status(200).json({ records });
    } catch (error) {
        console.error("Error fetching patient records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 4. Get Medical Records by Doctor ID
export const getRecordsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const records = await MedicalRecord.find({ doctorId }).populate('patientId');
        res.status(200).json({ records });
    } catch (error) {
        console.error("Error fetching doctor records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 5. Get Single Record by ID
export const getSingleRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await MedicalRecord.findById(id).populate('doctorId patientId');
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ record });
    } catch (error) {
        console.error("Error fetching record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 6. Update Record
export const updateMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await MedicalRecord.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ message: "Record updated", updated });
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 7. Delete Record
export const deleteMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await MedicalRecord.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ message: "Record deleted", deleted });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
