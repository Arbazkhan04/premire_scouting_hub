const express = require("express");
const { getUpcomingFixturesController, getAllLiveFixturesController, getCompletedFixturesController, getFixtureByIdController } = require("../controllers/fixtures.controller");

const router = express.Router();

// ✅ Route to fetch upcoming fixtures
router.get("/upcoming", getUpcomingFixturesController);



// ✅ Route to fetch and update live fixtures
router.get("/live", getAllLiveFixturesController);


// Route to get completed fixtures
router.get("/completed", getCompletedFixturesController);



/**
 * @route GET /api/fixtures/:fixtureId
 * @desc Get a fixture by ID
 * @access Public
 */
router.get("/fixtureById", getFixtureByIdController);


module.exports = router;
