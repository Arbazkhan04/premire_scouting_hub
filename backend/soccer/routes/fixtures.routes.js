const express = require("express");
const { getUpcomingFixturesController, getAllLiveFixturesController } = require("../controllers/fixtures.controller");

const router = express.Router();

// ✅ Route to fetch upcoming fixtures
router.get("/upcoming", getUpcomingFixturesController);



// ✅ Route to fetch and update live fixtures
router.get("/live", getAllLiveFixturesController);




module.exports = router;
