// ==========================
// Backend Setup: Node.js + Express + Mongoose
// ==========================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// ==========================
// MIDDLEWARE
// ==========================

// ✅ Fix CORS for all localhost origins
app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// MONGODB CONNECTION
// ==========================
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medzo';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Local MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Failed:", err));

// ==========================
// SCHEMAS & MODELS
// ==========================

// Doctor Model
const doctorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  specialty: String,
  qualifications: [String],
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  createdAt: { type: Date, default: Date.now }
});
const Doctor = mongoose.model('Doctor', doctorSchema);

// Patient Model
const patientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  age: Number,
  gender: String,
  address: {
    city: String,
    state: String,
    country: String,
  },
  medicalHistory: [String],
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  createdAt: { type: Date, default: Date.now }
});
const Patient = mongoose.model('Patient', patientSchema);

// Hospital Model
const hospitalSchema = new mongoose.Schema({
  name: String,
  address: {
    city: String,
    state: String,
    country: String
  },
  phone: String,
  email: String,
  capacityBeds: Number,
  ventilatorCount: Number,
  equipment: [String],
  createdAt: { type: Date, default: Date.now }
});
const Hospital = mongoose.model('Hospital', hospitalSchema);

// ==========================
// ROUTES
// ==========================

// Root Route
app.get('/', (req, res) => {
  res.status(200).send("🚀 Local Backend is running successfully!");
});


// ========== DOCTOR CRUD ==========
app.post('/api/doctors', async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  const doctors = await Doctor.find().populate('hospital');
  res.json(doctors);
});

app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospital');
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ========== PATIENT CRUD ==========
app.post('/api/patients', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/patients', async (req, res) => {
  const patients = await Patient.find().populate('assignedDoctor');
  res.json(patients);
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('assignedDoctor');
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ========== HOSPITAL CRUD ==========
app.post('/api/hospitals', async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json(hospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/hospitals', async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

app.get('/api/hospitals/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/hospitals/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/hospitals/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });
    res.json({ message: "Hospital deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Server running on http://127.0.0.1:${PORT}`);
});
