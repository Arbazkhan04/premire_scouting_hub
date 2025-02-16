const express = require("express");
const {
  fetchAndSaveLeagueController,
} = require("../controllers/leagues.controller");
const {
  fetchLeagueStandings,
  fetchAndStoreLeagueStandings,
  getAllStandings,
  getStandingsBySeason,
} = require("../controllers/leagueStandings.controller");
const { fetchAndSaveTopScorers, getStoredTopScorers } = require("../controllers/leagueTopScorer.controller");

const { auth } = require("../../middlewares/authentication");
const router = express.Router();

router.post("/fetchandSaveLeague", fetchAndSaveLeagueController);

/** League Standings Routes  */

// Route to fetch league standings from API
router.get("/fetch", fetchLeagueStandings);

// Route to fetch and save league standings
router.get("/fetch-and-save", fetchAndStoreLeagueStandings);

// Route to get all league standings from DB
router.get("/getAllLeagueStandings", getAllStandings);

// Route to get league standings of a specific season
router.get("/getLeagueStandingsbySeason", getStandingsBySeason);



/** League Top Scorers Routes  */



router.get("/fetchAndSaveLeagueTopScorers", fetchAndSaveTopScorers);
router.get("/getLeagueTopScorers", getStoredTopScorers);

module.exports = router;




module.exports = router;
