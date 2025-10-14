import Connection from "../model/connection.model.js";

// @desc    Create appointment request
// @route   POST /api/connections
// @access  Public
export const createConnection = async (req, res, next) => {
  try {
    const { patient, doctor } = req.body;

    if (!patient || !doctor) {
      res.status(400);
      throw new Error('Patient and Doctor references are required');
    }

    const connection = await Connection.create(req.body);

    const populatedConnection = await Connection.findById(connection._id)
      .populate('patient', 'name email mobile age')
      .populate('doctor', 'name email specialization visitingFees')
      .populate('hospital', 'name type address');

    res.status(201).json({
      success: true,
      message: 'Appointment request created successfully',
      data: populatedConnection,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all connections
// @route   GET /api/connections
// @access  Public
export const getAllConnections = async (req, res, next) => {
  try {
    const { status, patient, doctor } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;

    const connections = await Connection.find(filter)
      .populate('patient', 'name email mobile age')
      .populate('doctor', 'name email specialization visitingFees')
      .populate('hospital', 'name type address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: connections.length,
      data: connections,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update connection (schedule slot or change status)
// @route   PUT /api/connections/:id
// @access  Private
export const updateConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      res.status(404);
      throw new Error('Connection not found');
    }

    // If scheduling a slot, update status to Scheduled
    if (req.body.scheduledSlot && !req.body.status) {
      req.body.status = 'Scheduled';
    }

    const updatedConnection = await Connection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient', 'name email mobile age')
      .populate('doctor', 'name email specialization visitingFees')
      .populate('hospital', 'name type address');

    res.status(200).json({
      success: true,
      message: 'Connection updated successfully',
      data: updatedConnection,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete connection
// @route   DELETE /api/connections/:id
// @access  Private
export const deleteConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      res.status(404);
      throw new Error('Connection not found');
    }

    await Connection.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Connection deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
