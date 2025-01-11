const express = require('express');
const passport = require('passport');
const {register, login, changePassword, googleSignIn, logout} = require('../controllers/authController');

const router = express.Router();

// Normal Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/change-password', changePassword);

// Google Sign-In
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleSignIn);

// Logout
router.get('/logout', logout);

module.exports = router;
