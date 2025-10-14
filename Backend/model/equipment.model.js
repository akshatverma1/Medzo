import mongoose from "mongoose";

const equipmentTransferSchema = new mongoose.Schema({
  fromHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Source hospital is required']
  },
  toHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Destination hospital is required']
  },
  equipmentName: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1
  },
  status: {
    type: String,
    enum: ['Requested', 'Approved', 'Rejected', 'In-Transit', 'Completed', 'Cancelled'],
    default: 'Requested'
  },
  requestedBy: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  transferDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
equipmentTransferSchema.index({ fromHospital: 1, toHospital: 1 });
equipmentTransferSchema.index({ status: 1 });

const EquipmentTransfer = mongoose.model('EquipmentTransfer', equipmentTransferSchema);

export default EquipmentTransfer;