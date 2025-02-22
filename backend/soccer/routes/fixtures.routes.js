const express = require("express");
const { getUpcomingFixturesController, getAllLiveFixturesController, getCompletedFixturesController } = require("../controllers/fixtures.controller");

const router = express.Router();

// ✅ Route to fetch upcoming fixtures
router.get("/upcoming", getUpcomingFixturesController);



// ✅ Route to fetch and update live fixtures
router.get("/live", getAllLiveFixturesController);


// Route to get completed fixtures
router.get("/completed", getCompletedFixturesController);


module.exports = router;
