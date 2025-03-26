const express = require("express");
const { getUpcomingFixturesController, getAllLiveFixturesController, getCompletedFixturesController, getFixtureByIdController, processUpcomingFixturesAndEmitController } = require("../controllers/fixtures.controller");

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


/**
 * @route GET /api/v1/fixtures/upcoming
 * @desc Process and emit upcoming fixtures
 */
router.get("/processUpcomingFixturesandEmit", processUpcomingFixturesAndEmitController);


module.exports = router;
