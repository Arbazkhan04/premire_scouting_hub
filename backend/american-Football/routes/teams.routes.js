const express = require("express");
const {
  fetchAndSaveAllTeamsOfLeagueController,
  searchTeamsController,
  getTeamByIdController,
  getStatsSummaryOfTeamController,
} = require("../controllers/teams.controller");

const router = express.Router();

// Route to fetch and save all teams of a league for a given season
router.get("/fetch-and-save", fetchAndSaveAllTeamsOfLeagueController);

// Route to search teams by name
router.get("/search", searchTeamsController);

// Route to get a team by its ID
router.get("/getTeam", getTeamByIdController);



/**
 * @route GET /api/american-football/teams/stats/summary
 * @desc Get stats summary of a team in its latest season
 * @queryParam {number} teamId - Team ID
 * @access Public
 */
router.get("/statsSummary", getStatsSummaryOfTeamController);

module.exports = router;
