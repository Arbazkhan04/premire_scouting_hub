// const User = require('../models/userModel.js');
// const bcrypt = require('bcryptjs');

// // Normal Sign-Up
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(200).json({ message: 'Email already in use' });
//     }

//     const user = await User.create({ name, email, password });  
//     const token = user.createJWT();
//     res.status(200).json({ user, token});
//   } catch (err) {
//     res.status(200).json({ message: 'Error registering user', error: err.message });
//   }
// };

// // Normal Login
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {

//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(200).json({ error: 'Invalid email' });
//     }
    
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(200).json({ error: 'Invalid password' });
//     }
    
//     const token = user.createJWT();
//     res.status(200).json({ user , token});
//   } catch (err) {
//     res.status(200).json({ error: 'Error logging in', message: err.message });
//   }
// };

// // Password Change
// exports.changePassword = async (req, res) => {
//   const { userId, currentPassword, newPassword } = req.body;
//   try {
//     const user = await User.findById(userId).select('+password');
//     if (!user) {
//       return res.status(200).json({ error: 'User not found' });
//     }

//     const isMatch = await user.comparePassword(currentPassword);
//     if (!isMatch) {
//       return res.status(200).json({ error: 'Invalid password' });
//     }

//     user.password = newPassword;
//     await user.save();
//     res.status(200).json({ message: 'Password changed successfully' });
//   } catch (err) {
//     res.status(200).json({ message: err.message, error: 'Error changing password' });
//   }
// };

// exports.logout = (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).send('Error logging out');
//     res.send('logout successful');
//   });
// };

// exports.updateUsername = async (req, res) => {
//   const { userId, name } = req.body;
//   console.log(req.body);
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({ message: 'User not found' });
//     }
//     user.name = name;
//     await user.save();
//     res.status(200).json({ message: 'Username updated successfully', user });
//   }
//   catch (err) {
//     res.status(200).json({ message: 'Error updating username', error: err.message });
//   }
// };


// exports.updateProfilePicture = async (req, res) => { 
//   const { userId, profilePicture } = req.body;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({ message: 'User not found' });
//     }
//     // multer for image upload and cloudinary for image storage
//     // will be done when given aws credentials
//     user.profilePictureURL = profilePicture;
//     await user.save();
//     res.status(200).json({ message: 'Profile picture updated successfully' });
//   }
//   catch (err) {
//     res.status(200).json({ message: 'Error updating profile picture', error: err.message });
//   }
// };








// controllers/UserController.js
const {
  registerUser,
  loginUser,
  changeUserPassword,
  updateUsername,
  updateProfilePicture,
} = require('../services/userManagement.service.js');
const responseHandler = require('../utils/responseHandler.js');
const CustomError = require('../utils/customError.js');

/**
 * Controller to register a new user.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser({ name, email, password });
    responseHandler(res, 200, 'User registered successfully', result);
  } catch (error) {
    console.error('Error in register controller:', error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

/**
 * Controller to login a user.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    responseHandler(res, 200, 'User logged in successfully', result);
  } catch (error) {
    console.error('Error in login controller:', error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

/**
 * Controller to change a user's password.
 */
const changePassword = async (req, res, next) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const result = await changeUserPassword({ userId, currentPassword, newPassword });
    responseHandler(res, 200, result.message);
  } catch (error) {
    console.error('Error in changePassword controller:', error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

/**
 * Controller to update a user's username.
 */
const updateUsernameController = async (req, res, next) => {
  try {
    const { userId, name } = req.body;
    const result = await updateUsername({ userId, name });
    responseHandler(res, 200, result.message, result.user);
  } catch (error) {
    console.error('Error in updateUsername controller:', error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

/**
 * Controller to update a user's profile picture.
 */
const updateProfilePictureController = async (req, res, next) => {
  try {
    const { userId, profilePicture } = req.body;
    const result = await updateProfilePicture({ userId, profilePicture });
    responseHandler(res, 200, result.message);
  } catch (error) {
    console.error('Error in updateProfilePicture controller:', error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

/**
 * Controller to logout a user.
 * Note: Assuming PassportJS-style logout. Adjust according to your auth implementation.
 */
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Error in logout controller:', err.message);
      return next(new CustomError('Error logging out', 500));
    }
    responseHandler(res, 200, 'Logout successful');
  });
};



/**
 * Controller to handle Google Authentication.
 */
const googleAuthController = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await googleAuthService(token);
    responseHandler(res, 200, "User authenticated successfully via Google", result);
  } catch (error) {
    console.error("Error in Google Authentication:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};





module.exports = {
  register,
  login,
  changePassword,
  logout,
  updateUsernameController,
  updateProfilePictureController,
  googleAuthController
};
