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
      return res.status(200).json({ message: 'Invalid email' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(200).json({ message: 'Invalid password' });
    }
    
    const token = user.createJWT();
    res.status(200).json({ user , token});
  } catch (err) {
    res.status(200).json({ message: 'Error logging in', error: err.message });
  }
};

// Password Change
exports.changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password', error: err.message });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.send('logout successful');
  });
};