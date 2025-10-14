import express from "express"
const router = express.Router();
import {
  registerPatient,
  loginPatient,
  getAllPatients,
  updatePatient,
  deletePatient
} from "../controllers/patient.controller.js";

// POST /api/patients/register - Register new patient
router.post('/register', registerPatient);

// POST /api/patients/login - Login patient
router.post('/login', loginPatient);

// GET /api/patients - Get all patients
router.get('/', getAllPatients);

// PUT /api/patients/:id - Update patient
router.put('/:id', updatePatient);

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', deletePatient);

export default router;