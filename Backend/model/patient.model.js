import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 0,
    max: 150
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  diseases: [{
    name: {
      type: String,
      required: true
    },
    diagnosedDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Chronic'],
      default: 'Active'
    }
  }]
}, {
  timestamps: true
});

// Create geospatial index
patientSchema.index({ location: '2dsphere' });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;