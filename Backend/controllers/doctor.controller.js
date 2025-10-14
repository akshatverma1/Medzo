import Doctor from "../model/doctor.model.js";

// @desc    Register a new doctor
// @route   POST /api/doctors/register
// @access  Public
export const registerDoctor = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      res.status(400);
      throw new Error('Doctor with this email already exists');
    }

    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        visitingFees: doctor.visitingFees,
        createdAt: doctor.createdAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login doctor
// @route   POST /api/doctors/login
// @access  Public
export const loginDoctor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const doctor = await Doctor.findOne({ email }).populate('affiliatedHospitals', 'name type address');

    if (!doctor || doctor.password !== password) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        affiliatedHospitals: doctor.affiliatedHospitals,
        createdAt: doctor.createdAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
      .select('-password')
      .populate('affiliatedHospitals', 'name type address');

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private
export const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password').populate('affiliatedHospitals', 'name type address');

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private
export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
