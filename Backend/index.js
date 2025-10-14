import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();
// { path: path.join(__dirname, '.env') }

import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./db/db.js";
import {errorHandler, notFound} from "./middleware/error.middleware.js"

// import Routes
import hospitalRoutes from "./routes/hospital.route.js"
import doctorRoutes from "./routes/doctor.routes.js"
import patientRoutes from "./routes/patient.routes.js"
import connectionRoutes from "./routes/connection.routes.js"
import equipmentTransferRoutes from "./routes/equipment.routes.js"


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check Route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Healthcare SaaS API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/equipment-transfers', equipmentTransferRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;