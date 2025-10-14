import express from "express"
const router = express.Router();


import {
  registerDoctor,
  loginDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor
} from "../controllers/doctor.controller.js";

// POST /api/doctors/register - Register new doctor
router.post('/register', registerDoctor);

// POST /api/doctors/login - Login doctor
router.post('/login', loginDoctor);

// GET /api/doctors - Get all doctors
router.get('/', getAllDoctors);

// PUT /api/doctors/:id - Update doctor
router.put('/:id', updateDoctor);

// DELETE /api/doctors/:id - Delete doctor
router.delete('/:id', deleteDoctor);

export default router;