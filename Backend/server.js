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
// UPDATED SCHEMAS & MODELS
// ==========================

// Hospital Model - Updated Schema
const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['gov', 'private'], required: true },
  fullAddress: { type: String, required: true },
  geoLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  website: String,
  facilities: [String],
  equipment: [String],
  registrationId: { type: String, required: true, unique: true },
  yearOfEstablishment: { type: Number, required: true },
  staffCount: { type: Number, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Doctor Model - Updated Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  permanentAddress: { type: String, required: true },
  geoLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  experience: { type: Number, required: true }, // in years
  specialization: { type: String, required: true },
  timeShift: { type: String, required: true }, // e.g., "9AM-5PM", "Night Shift"
  degree: [String],
  visitingFees: { type: Number, required: true },
  approxPatientCount: { type: Number, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  password: { type: String, required: true },
  calendar: [{
    date: { type: Date, required: true },
    available: { type: Boolean, default: true }
  }],
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Doctor = mongoose.model('Doctor', doctorSchema);

// Patient Model - Updated Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  geoLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  medicalHistory: [String],
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  createdAt: { type: Date, default: Date.now }
});
const Patient = mongoose.model('Patient', patientSchema);

// ==========================
// OpenChat Model - New Schema
// ==========================
const openChatSchema = new mongoose.Schema({
  msg: { type: String, required: true },
  sender: { type: String }, // optional: name, email, or role
  receiver: { type: String }, // optional: name, email, or role
  createdAt: { type: Date, default: Date.now }
});
const OpenChat = mongoose.model('OpenChat', openChatSchema);

// ==========================
// ROUTES
// ==========================

// Root Route
app.get('/', (req, res) => {
  res.status(200).send("🚀 Local Backend is running successfully!");
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
  const doctors = await Doctor.find().populate('organization');
  res.json(doctors);
});

app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('organization');
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

// ========== OPEN CHAT CRUD ==========
app.post('/api/openchat', async (req, res) => {
  try {
    const chat = await OpenChat.create(req.body);
    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/openchat', async (req, res) => {
  try {
    const chats = await OpenChat.find().sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/openchat/:id', async (req, res) => {
  try {
    const chat = await OpenChat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/openchat/:id', async (req, res) => {
  try {
    const chat = await OpenChat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/openchat/:id', async (req, res) => {
  try {
    const chat = await OpenChat.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// AUTHENTICATION ROUTES (Basic)
// ==========================
app.post('/api/hospitals/login', async (req, res) => {
  try {
    const { registrationId, password } = req.body;
    const hospital = await Hospital.findOne({ registrationId });
    
    if (!hospital || hospital.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    res.json({ message: "Login successful", hospital });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/doctors/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email }).populate('organization');
    
    if (!doctor || doctor.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    res.json({ message: "Login successful", doctor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/patients/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email }).populate('assignedDoctor');
    
    if (!patient || patient.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    res.json({ message: "Login successful", patient });
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
