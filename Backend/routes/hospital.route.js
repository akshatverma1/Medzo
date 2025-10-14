// const express = require('express');
// const router = express.Router();
// import {
//   registerHospital,
//   loginHospital,
//   getAllHospitals,
//   updateHospital,
//   deleteHospital
// } from "../controllers/hospital.controller.js";

// // POST /api/hospitals/register - Register new hospital
// router.post('/register', registerHospital);

// // POST /api/hospitals/login - Login hospital
// router.post('/login', loginHospital);

// // GET /api/hospitals - Get all hospitals
// router.get('/', getAllHospitals);

// // PUT /api/hospitals/:id - Update hospital
// router.put('/:id', updateHospital);

// // DELETE /api/hospitals/:id - Delete hospital
// router.delete('/:id', deleteHospital);

// export default router;

import express from 'express';
import {
  registerHospital,
  loginHospital,
  getAllHospitals,
  updateHospital,
  deleteHospital
} from '../controllers/hospital.controller.js';

const router = express.Router();

// POST /api/hospitals/register - Register new hospital
router.post('/register', registerHospital);

// POST /api/hospitals/login - Login hospital
router.post('/login', loginHospital);

// GET /api/hospitals - Get all hospitals
router.get('/', getAllHospitals);

// PUT /api/hospitals/:id - Update hospital
router.put('/:id', updateHospital);

// DELETE /api/hospitals/:id - Delete hospital
router.delete('/:id', deleteHospital);

export default router;