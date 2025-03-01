const express = require("express");
const { fetchUpcomingFixtureOddsController } = require("../controllers/odds.controller");
const { getFixtureOddsByFixtureIdController } = require("../../american-Football/controllers/odds.controller");

const router = express.Router();

// ✅ Route to fetch and update odds for upcoming fixtures
router.get("/upcoming-fixtures-odds", fetchUpcomingFixtureOddsController);


router.get("/oddsByFixtureId", getFixtureOddsByFixtureIdController);

module.exports = router;
