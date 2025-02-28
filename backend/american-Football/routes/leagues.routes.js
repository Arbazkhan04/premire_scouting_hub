const express = require("express");
const {
  fetchLeaguesFromAPIController,
  fetchAndSaveLeaguesController,
  getAllLeaguesController,
  getLeagueByIdController,
  updateLeagueTeamsController,
  getAllLeaguesStandingsController,
} = require("../controllers/leagues.controller");

const router = express.Router();

// Route to fetch leagues from API (without saving to DB)
router.get("/fetch-from-api", fetchLeaguesFromAPIController);

// Route to fetch leagues from API and save to DB
router.get("/fetch-and-save", fetchAndSaveLeaguesController);

// Route to get all leagues from the database
router.get("/getAllLeagues", getAllLeaguesController);

// Route to get a league by its ID
router.get("/getLeague", getLeagueByIdController);

// Route to update league teams (add a team to a league)
router.put("/:leagueId/update-teams", updateLeagueTeamsController);


// Get standings for all leagues
router.get("/allLeaguesStandings", getAllLeaguesStandingsController);

module.exports = router;
