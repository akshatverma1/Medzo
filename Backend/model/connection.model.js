import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  }
}, { _id: false });

const connectionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient reference is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor reference is required']
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  preferredSlots: [slotSchema],
  scheduledSlot: {
    type: slotSchema,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Closed'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
connectionSchema.index({ patient: 1, doctor: 1 });
connectionSchema.index({ status: 1 });

const Connection = mongoose.model('Connection', connectionSchema);

export default Connection;