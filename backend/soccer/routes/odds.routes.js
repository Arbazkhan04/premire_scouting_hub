const express = require("express");
const { fetchUpcomingFixtureOddsController } = require("../controllers/odds.controller");

const router = express.Router();

// ✅ Route to fetch and update odds for upcoming fixtures
router.get("/upcoming-fixtures-odds", fetchUpcomingFixtureOddsController);

module.exports = router;
