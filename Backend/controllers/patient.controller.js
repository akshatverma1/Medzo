import Patient from "../model/patient.model.js";

// @desc    Register a new patient
// @route   POST /api/patients/register
// @access  Public
export const registerPatient = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      res.status(400);
      throw new Error('Patient with this email already exists');
    }

    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        gender: patient.gender,
        age: patient.age,
        mobile: patient.mobile,
        createdAt: patient.createdAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login patient
// @route   POST /api/patients/login
// @access  Public
export const loginPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const patient = await Patient.findOne({ email });

    if (!patient || patient.password !== password) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        gender: patient.gender,
        age: patient.age,
        diseases: patient.diseases,
        createdAt: patient.createdAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public
export const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().select('-password');

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};