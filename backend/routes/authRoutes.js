// const express = require("express");
// const { OAuth2Client } = require('google-auth-library');
// const User = require("../models/userModel.js");
// const { register, login, changePassword, logout,
//     updateUsername, updateProfilePicture } = require("../controllers/authController");
// const { authenticate } = require("../middlewares/authentication.js");

// const router = express.Router();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // Normal Authentication
// router.post("/register", register);
// router.post("/login", login);

// // user management
// router.post('/changePassword', authenticate, changePassword)
// router.post('/updateUsername', authenticate, updateUsername)
// router.post('/updateProfilePicture', authenticate, updateProfilePicture)

// // Google Authentication
// router.post('/google', async (req, res) => {
//   const { token } = req.body;
//   console.log('Received token:', token);

//   let payload;
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID, // Use the environment variable
//     });
//     console.log('Verification ticket:', ticket);
//     payload = ticket.getPayload();
//     console.log('Payload:', payload);
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     return res.status(200).json({ error: 'Invalid token' });
//   }

//   const { email, name } = payload;
//   console.log('Processing user:', name);

//   try {
//     // Check if the user exists in the database
//     let user = await User.findOne({ email });

//     // If the user does not exist, create a new one
//     if (!user) {
//       user = new User({ email, name });
//       await user.save(); // Save the new user to the database
//       console.log('User created:', user);
//     } else {
//       console.log('User already exists');
//     }
//     // token
//     const token = user.createJWT();
//     const userInfo = { token, user };
//     // Send the response once
//     res.status(200).json({ message: 'User processed successfully', userInfo });
//   } catch (error) {
//     console.error('Error with Google sign-in:', error);
//     if (!res.headersSent) { // Ensure that headers haven't been sent before sending an error response
//       res.status(200).json({ error: 'Internal server error' });
//     }
//   }
// });

// // Logout
// router.get("/logout", logout);

// module.exports = router;

const express = require("express");
const {
  register,
  login,
  changePassword,
  logout,
  updateUsernameController,
  updateProfilePictureController,
  googleAuthController,
} = require("../controllers/authController");

const { auth, authorizeRoles } = require("../middlewares/authentication");

const router = express.Router();

// Normal Authentication
router.post("/register", register);
router.post("/login", login);

// User Management (Requires Authentication)
router.post("/changePassword", auth, changePassword);
router.post("/updateUsername", auth, updateUsernameController);
router.post("/updateProfilePicture", auth, updateProfilePictureController);

// Google Authentication
router.post("/google", googleAuthController);

// Logout
router.get("/logout", logout);

module.exports = router;
