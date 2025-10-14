// import Hospital from "../model/hospital.model.js";

// // @desc    Register a new hospital
// // @route   POST /api/hospitals/register
// // @access  Public
// const registerHospital = async (req, res, next) => {
//   try {
//     const { email, hospitalRegistrationId } = req.body;

//     // Check if hospital already exists
//     const existingHospital = await Hospital.findOne({ 
//       $or: [{ email }, { hospitalRegistrationId }] 
//     });

//     if (existingHospital) {
//       res.status(400);
//       throw new Error('Hospital with this email or registration ID already exists');
//     }

//     const hospital = await Hospital.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: 'Hospital registered successfully',
//       data: {
//         id: hospital._id,
//         name: hospital.name,
//         email: hospital.email,
//         type: hospital.type,
//         hospitalRegistrationId: hospital.hospitalRegistrationId,
//         createdAt: hospital.createdAt
//       },
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Login hospital
// // @route   POST /api/hospitals/login
// // @access  Public
// const loginHospital = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       res.status(400);
//       throw new Error('Please provide email and password');
//     }

//     const hospital = await Hospital.findOne({ email });

//     if (!hospital || hospital.password !== password) {
//       res.status(401);
//       throw new Error('Invalid email or password');
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         id: hospital._id,
//         name: hospital.name,
//         email: hospital.email,
//         type: hospital.type,
//         hospitalRegistrationId: hospital.hospitalRegistrationId,
//         createdAt: hospital.createdAt
//       },
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all hospitals
// // @route   GET /api/hospitals
// // @access  Public
// const getAllHospitals = async (req, res, next) => {
//   try {
//     const hospitals = await Hospital.find().select('-password');

//     res.status(200).json({
//       success: true,
//       count: hospitals.length,
//       data: hospitals,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update hospital
// // @route   PUT /api/hospitals/:id
// // @access  Private
// const updateHospital = async (req, res, next) => {
//   try {
//     const hospital = await Hospital.findById(req.params.id);

//     if (!hospital) {
//       res.status(404);
//       throw new Error('Hospital not found');
//     }

//     const updatedHospital = await Hospital.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.status(200).json({
//       success: true,
//       message: 'Hospital updated successfully',
//       data: updatedHospital,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Delete hospital
// // @route   DELETE /api/hospitals/:id
// // @access  Private
// const deleteHospital = async (req, res, next) => {
//   try {
//     const hospital = await Hospital.findById(req.params.id);

//     if (!hospital) {
//       res.status(404);
//       throw new Error('Hospital not found');
//     }

//     await Hospital.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: 'Hospital deleted successfully',
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export default {
//   registerHospital,
//   loginHospital,
//   getAllHospitals,
//   updateHospital,
//   deleteHospital
// };

import Hospital from "../model/hospital.model.js";

// @desc    Register a new hospital
// @route   POST /api/hospitals/register
// @access  Public
export const registerHospital = async (req, res, next) => {
  try {
    const { email, hospitalRegistrationId } = req.body;

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ 
      $or: [{ email }, { hospitalRegistrationId }] 
    });

    if (existingHospital) {
      res.status(400);
      throw new Error('Hospital with this email or registration ID already exists');
    }

    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully',
      data: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        type: hospital.type,
        hospitalRegistrationId: hospital.hospitalRegistrationId,
        createdAt: hospital.createdAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login hospital
// @route   POST /api/hospitals/login
// @access  Public
export const loginHospital = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const hospital = await Hospital.findOne({ email });

    if (!hospital || hospital.password !== password) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        type: hospital.type,
        hospitalRegistrationId: hospital.hospitalRegistrationId,
        createdAt: hospital.createdAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
export const getAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find().select('-password');

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hospital
// @route   PUT /api/hospitals/:id
// @access  Private
export const updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      res.status(404);
      throw new Error('Hospital not found');
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Hospital updated successfully',
      data: updatedHospital,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hospital
// @route   DELETE /api/hospitals/:id
// @access  Private
export const deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      res.status(404);
      throw new Error('Hospital not found');
    }

    await Hospital.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hospital deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};