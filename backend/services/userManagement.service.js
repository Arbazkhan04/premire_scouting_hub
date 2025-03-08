// services/UserService.js
const User = require("../models/userModel.js");
const CustomError = require("../utils/customError.js");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Service to handle Google Authentication.
 * @param {string} token - Google ID token.
 * @returns {Promise<Object>} - User data and JWT token.
 */
const googleAuthService = async (token) => {
  let payload;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch (error) {
    throw new CustomError("Invalid Google token", 401);
  }

  const { email, name } = payload;

  // Check if the user exists in the database
  let user = await User.findOne({ email });

  // If the user does not exist, create a new one
  if (!user) {
    user = new User({ email, name });
    await user.save();
  }

  // Generate JWT token
  const authToken = user.createJWT();
  return { token: authToken, user };
};

/**
 * Register a new user.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} - Object containing the user and JWT token.
 */
const registerUser = async ({ name, email, password }) => {
  // Check if a user with the provided email already exists.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("Email already in use", 400);
  }
 

  // Create a new user.
  const user = await User.create({ name, email, password });
  const token = user.createJWT();

  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    userRole: user.userRole,
    profilePictureURL: user.profilePictureURL,
    subscriptionStatus:user?.subscriptionStatus,
    subscriptionPlan:user?.subscriptionPlan,
  token
  };
  
  return response;
};

/**
 * Login a user.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - Object containing the user and JWT token.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Invalid email", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomError("Invalid password", 401);
  }

  const token = user.createJWT();

  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    userRole: user.userRole,
    profilePictureURL: user.profilePictureURL,
    subscriptionStatus:user?.subscriptionStatus,
    subscriptionPlan:user?.subscriptionPlan
  
  };

  return { response, token };
};

/**
 * Change the password for a user.
 * @param {Object} data - { userId, currentPassword, newPassword }
 * @returns {Promise<Object>} - Success message.
 */
const changeUserPassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new CustomError("Invalid password", 401);
  }

  user.password = newPassword;
  await user.save();
  return { message: "Password changed successfully" };
};

/**
 * Update a user's username.
 * @param {Object} data - { userId, name }
 * @returns {Promise<Object>} - Success message and updated user.
 */
const updateUsername = async ({ userId, name }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  user.name = name;
  await user.save();
  return { message: "Username updated successfully", user };
};

/**
 * Update a user's profile picture.
 * @param {Object} data - { userId, profilePicture }
 * @returns {Promise<Object>} - Success message.
 */
const updateProfilePicture = async ({ userId, profilePicture }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  // Here you can add your multer/cloudinary logic if needed.
  user.profilePictureURL = profilePicture;
  await user.save();
  return { message: "Profile picture updated successfully" };
};

module.exports = {
  registerUser,
  loginUser,
  changeUserPassword,
  updateUsername,
  updateProfilePicture,
  googleAuthService,
};
