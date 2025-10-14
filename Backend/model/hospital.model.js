import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  inUse: {
    type: Number,
    required: true,
    default: 0
  },
  free: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Hospital type is required'],
    enum: ['Government', 'Private', 'Trust', 'Corporate', 'Clinic', 'Multi-Specialty', 'Super-Specialty']
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
  website: {
    type: String,
    trim: true
  },
  facilities: [{
    type: String,
    trim: true
  }],
  equipments: [equipmentSchema],
  hospitalRegistrationId: {
    type: String,
    required: [true, 'Hospital registration ID is required'],
    unique: true,
    trim: true
  },
  establishedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  }
}, {
  timestamps: true
});

// Create geospatial index
hospitalSchema.index({ location: '2dsphere' });

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;