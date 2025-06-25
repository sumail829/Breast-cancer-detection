import express from 'express';
import { createDoctor,getAllDoctors,getDoctorById,updateDoctor,deleteDoctor, loginDoctor } from '../controllers/doctorController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();
// Define routes for doctor operations
router.get('/doctor',verifyToken,authorizeRoles("doctor","patient"), getAllDoctors); // Get all doctors
router.get('/doctor/:id', getDoctorById); // Get a doctor by ID
router.post('/doctor/signup', createDoctor); // Create a new doctor
router.post('/doctor/login',loginDoctor);//login doctor
router.patch('/doctor/update/:id', updateDoctor); // Update a doctor by ID
router.delete('/doctor/delete/:id', deleteDoctor); // Delete a doctor by ID


// Export the router
export default router;