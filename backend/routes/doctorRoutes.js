import express from 'express';
import { createDoctor,getAllDoctors,getDoctorById,updateDoctor,deleteDoctor } from '../controllers/doctorController.js';

const router = express.Router();
// Define routes for doctor operations
router.get('/doctor', getAllDoctors); // Get all doctors
router.get('/doctor/:id', getDoctorById); // Get a doctor by ID
router.post('/doctor/signup', createDoctor); // Create a new doctor
router.patch('/doctor/update/:id', updateDoctor); // Update a doctor by ID
router.delete('/doctor/delete/:id', deleteDoctor); // Delete a doctor by ID

// Export the router
export default router;