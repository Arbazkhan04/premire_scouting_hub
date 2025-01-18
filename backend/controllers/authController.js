const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');

// Normal Sign-Up
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });  
    const token = user.createJWT();
    res.status(200).json({ user, token});
  } catch (err) {
    res.status(200).json({ message: 'Error registering user', error: err.message });
  }
};

// Normal Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(200).json({ error: 'Invalid email' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(200).json({ error: 'Invalid password' });
    }
    
    const token = user.createJWT();
    res.status(200).json({ user , token});
  } catch (err) {
    res.status(200).json({ error: 'Error logging in', message: err.message });
  }
};

// Password Change
exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(200).json({ error: 'Invalid password' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(200).json({ message: err.message, error: 'Error changing password' });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.send('logout successful');
  });
};

exports.updateUsername = async (req, res) => {
  const { userId, name } = req.body;
  console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }
    user.name = name;
    await user.save();
    res.status(200).json({ message: 'Username updated successfully', user });
  }
  catch (err) {
    res.status(200).json({ message: 'Error updating username', error: err.message });
  }
};


exports.updateProfilePicture = async (req, res) => { 
  const { userId, profilePicture } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }
    // multer for image upload and cloudinary for image storage
    // will be done when given aws credentials
    user.profilePictureURL = profilePicture;
    await user.save();
    res.status(200).json({ message: 'Profile picture updated successfully' });
  }
  catch (err) {
    res.status(200).json({ message: 'Error updating profile picture', error: err.message });
  }
};