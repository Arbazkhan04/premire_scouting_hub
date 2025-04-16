// services/UserService.js
const User = require("../models/userModel.js");
const { createStripeCustomer } = require("../stripe/stripe.service.js");
const CustomError = require("../utils/customError.js");
const { OAuth2Client } = require("google-auth-library");
const { getExpiryDate } = require("../utils/expiryDate.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Service to handle Google Authentication.
 * @param {string} token - Google ID token.
 * @returns {Promise<Object>} - User data and JWT token.
 */
// const googleAuthService = async (token) => {
//   let payload;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     payload = ticket.getPayload();
//   } catch (error) {
//     throw new CustomError("Invalid Google token", 401);
//   }

//   const { email, name } = payload;

//   // Check if the user exists in the database
//   let user = await User.findOne({ email });

//   // If the user does not exist, create a new one
//   if (!user) {
//     //create stripe costumer
//     const customer = await createStripeCustomer(email);
//     const stripeCustomerId = customer?.id;

//     const trialExpiry=getExpiryDate("trial")

//     // // Set trial expiry date (7 days from now)
//     // const trialExpiry = new Date();
//     // trialExpiry.setDate(trialExpiry.getDate() + 7);

//     // Create a new user.
//     user = new User({
//       name,
//       email,
//       stripeCustomerId,
//       subscriptionStatus: "active",
//       subscriptionPlan: "trial",
//       subscriptionPlanExpiry: trialExpiry,
//       autoRenewal: false,
//     });
//     await user.save();
//   }

//   // Generate JWT token
//   const authToken = user.createJWT();

//   const response = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     userRole: user.userRole,
//     profilePictureURL: user.profilePictureURL,
//     subscriptionStatus: user?.subscriptionStatus,
//     subscriptionPlan: user?.subscriptionPlan,
//     subscriptionPlanExpiry: user?.subscriptionPlanExpiry,
//     token: authToken,
//   };

//   return response;

//   // return { token: authToken, user };
// };


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

  const { email, name, sub: googleId, picture: profilePictureURL } = payload;

  // Check if the user exists in the database
  let user = await User.findOne({ email });

  // If the user does not exist, create a new one
  if (!user) {
    const customer = await createStripeCustomer(email);
    const stripeCustomerId = customer?.id;
    const trialExpiry = getExpiryDate("trial");

    user = new User({
      name,
      email,
      googleId, // Save Google ID here ✅
      profilePictureURL, // Optional, if you want to store it
      stripeCustomerId,
      subscriptionStatus: "active",
      subscriptionPlan: "trial",
      subscriptionPlanExpiry: trialExpiry,
      autoRenewal: false,
    });

    await user.save();
  }else if (!user.googleId) {
    // ✅ If existing user logged in via email earlier, now logging via Google, add the googleId
    user.googleId = googleId;
    await user.save();
  }

  // Generate JWT token
  const authToken = user.createJWT();

  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    googleId:user.googleId,
    userRole: user.userRole,
    profilePictureURL: user.profilePictureURL,
    subscriptionStatus: user?.subscriptionStatus,
    subscriptionPlan: user?.subscriptionPlan,
    subscriptionPlanExpiry: user?.subscriptionPlanExpiry,
    token: authToken,
  };

  return response;
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

  //create stripe costumer
  const customer = await createStripeCustomer(email);
  const stripeCustomerId = customer?.id;

  // // Set trial expiry date (7 days from now)
  // const trialExpiry = new Date();
  // trialExpiry.setDate(trialExpiry.getDate() + 7);
  const trialExpiry=getExpiryDate("trial")
  // Create a new user.
  const user = await User.create({
    name,
    email,
    password,
    stripeCustomerId,
    subscriptionStatus: "active",
    subscriptionPlan: "trial",
    subscriptionPlanExpiry: trialExpiry,
    autoRenewal: false,
  });
  const token = user.createJWT();

  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    userRole: user.userRole,
    profilePictureURL: user.profilePictureURL,
    subscriptionStatus: user?.subscriptionStatus,
    subscriptionPlan: user?.subscriptionPlan,
    subscriptionPlanExpiry: user?.subscriptionPlanExpiry,
    token,
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
    googleId:user.googleId,
    userRole: user.userRole,
    profilePictureURL: user.profilePictureURL,
    subscriptionStatus: user?.subscriptionStatus,
    subscriptionPlan: user?.subscriptionPlan,
    subscriptionPlanExpiry: user?.subscriptionPlanExpiry,
    token,
  };

  return response;
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


/**
 * Update any field of the user profile
 * @param {*} payload 
 * @returns 
 */
const updateProfile = async (payload) => {
  try {
    const { userId, ...updateData } = payload;

    const allowedFields = ['name', 'profilePictureURL']; // Allowed fields only
    const incomingFields = Object.keys(updateData);

    // Check for any disallowed fields
    const invalidFields = incomingFields.filter(key => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
      throw new CustomError(`Invalid field(s): ${invalidFields.join(', ')}`, 400);
    }

    // Filter only valid fields with non-null values
    const updateFields = incomingFields.reduce((acc, key) => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        acc[key] = updateData[key];
      }
      return acc;
    }, {});

    if (Object.keys(updateFields).length === 0) {
      throw new CustomError('No valid fields provided to update', 400);
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      googleId:user.googleId,
      userRole: user.userRole,
      profilePictureURL: user.profilePictureURL,
      subscriptionStatus: user?.subscriptionStatus,
      subscriptionPlan: user?.subscriptionPlan,
      subscriptionPlanExpiry: user?.subscriptionPlanExpiry,
     
    };
  
    return response;

  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw new CustomError(
      error.message || "Error updating user profile",
      error.statusCode || 500
    );
  }
};

module.exports = {
  registerUser,
  loginUser,
  changeUserPassword,
  updateUsername,
  updateProfilePicture,
  googleAuthService,
  updateProfile
};
