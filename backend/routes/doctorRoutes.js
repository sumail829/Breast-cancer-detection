import express from 'express';
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  loginDoctor
} from '../controllers/doctorController.js';

const router = express.Router();

router.get('/doctor', getAllDoctors);
router.get('/doctor/:id', getDoctorById);
router.post('/doctor/signup', createDoctor);
router.post('/doctor/login', loginDoctor);
router.patch('/doctor/update/:id', updateDoctor);
router.delete('/doctor/delete/:id', deleteDoctor);



export default router;
