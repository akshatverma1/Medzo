import Hospital from "../model/hospital.model.js";
import EquipmentTransfer from "../model/equipment.model.js";

// @desc    Request equipment transfer
// @route   POST /api/equipment-transfers
// @access  Public
export const createTransferRequest = async (req, res, next) => {
  try {
    const { fromHospital, toHospital, equipmentName, quantity } = req.body;

    if (!fromHospital || !toHospital) {
      res.status(400);
      throw new Error('Both source and destination hospitals are required');
    }

    if (fromHospital === toHospital) {
      res.status(400);
      throw new Error('Source and destination hospitals cannot be the same');
    }

    // Check if source hospital has the equipment
    const sourceHospital = await Hospital.findById(fromHospital);
    if (!sourceHospital) {
      res.status(404);
      throw new Error('Source hospital not found');
    }

    const equipment = sourceHospital.equipments.find(
      eq => eq.name.toLowerCase() === equipmentName.toLowerCase()
    );

    if (!equipment || equipment.free < quantity) {
      res.status(400);
      throw new Error('Insufficient equipment available for transfer');
    }

    const transfer = await EquipmentTransfer.create(req.body);

    const populatedTransfer = await EquipmentTransfer.findById(transfer._id)
      .populate('fromHospital', 'name type address')
      .populate('toHospital', 'name type address');

    res.status(201).json({
      success: true,
      message: 'Equipment transfer request created successfully',
      data: populatedTransfer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all equipment transfers
// @route   GET /api/equipment-transfers
// @access  Public
export const getAllTransfers = async (req, res, next) => {
  try {
    const { status, fromHospital, toHospital } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (fromHospital) filter.fromHospital = fromHospital;
    if (toHospital) filter.toHospital = toHospital;

    const transfers = await EquipmentTransfer.find(filter)
      .populate('fromHospital', 'name type address')
      .populate('toHospital', 'name type address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment transfer (approve/reject)
// @route   PUT /api/equipment-transfers/:id
// @access  Private
export const updateTransfer = async (req, res, next) => {
  try {
    const transfer = await EquipmentTransfer.findById(req.params.id);

    if (!transfer) {
      res.status(404);
      throw new Error('Equipment transfer not found');
    }

    // If approving, update equipment counts
    if (req.body.status === 'Approved' && transfer.status === 'Requested') {
      const sourceHospital = await Hospital.findById(transfer.fromHospital);
      const destinationHospital = await Hospital.findById(transfer.toHospital);

      // Find equipment in source hospital
      const sourceEquipment = sourceHospital.equipments.find(
        eq => eq.name.toLowerCase() === transfer.equipmentName.toLowerCase()
      );

      if (sourceEquipment && sourceEquipment.free >= transfer.quantity) {
        // Update source hospital equipment
        sourceEquipment.free -= transfer.quantity;
        sourceEquipment.total -= transfer.quantity;
        await sourceHospital.save();

        // Update destination hospital equipment
        const destEquipment = destinationHospital.equipments.find(
          eq => eq.name.toLowerCase() === transfer.equipmentName.toLowerCase()
        );

        if (destEquipment) {
          destEquipment.free += transfer.quantity;
          destEquipment.total += transfer.quantity;
        } else {
          destinationHospital.equipments.push({
            name: transfer.equipmentName,
            total: transfer.quantity,
            inUse: 0,
            free: transfer.quantity
          });
        }
        await destinationHospital.save();

        req.body.transferDate = new Date();
      } else {
        res.status(400);
        throw new Error('Insufficient equipment available');
      }
    }

    const updatedTransfer = await EquipmentTransfer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('fromHospital', 'name type address')
      .populate('toHospital', 'name type address');

    res.status(200).json({
      success: true,
      message: 'Equipment transfer updated successfully',
      data: updatedTransfer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment transfer
// @route   DELETE /api/equipment-transfers/:id
// @access  Private
export const deleteTransfer = async (req, res, next) => {
  try {
    const transfer = await EquipmentTransfer.findById(req.params.id);

    if (!transfer) {
      res.status(404);
      throw new Error('Equipment transfer not found');
    }

    await EquipmentTransfer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Equipment transfer deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

