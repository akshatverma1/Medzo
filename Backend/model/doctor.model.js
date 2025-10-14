import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  days: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }]
}, { _id: false });

const degreeSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 23,
    max: 100
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
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
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0
  },
  specialization: [{
    type: String,
    required: true,
    trim: true
  }],
  shift: {
    type: shiftSchema,
    required: true
  },
  degrees: [degreeSchema],
  visitingFees: {
    type: Number,
    required: [true, 'Visiting fees is required'],
    min: 0
  },
  affiliatedHospitals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }],
  soloPractice: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create geospatial index
doctorSchema.index({ location: '2dsphere' });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;