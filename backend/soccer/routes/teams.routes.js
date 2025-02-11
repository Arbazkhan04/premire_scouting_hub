const express = require('express');
const router = express.Router();
const { saveTeams } = require('../controllers/teams.controller');

// Route for fetching and saving teams
router.get('/fetchandSaveAllTeams', saveTeams);

module.exports = router;
