const express = require("express");
const router = express.Router();
const {
  fetchAndSaveAllPlayersOfTeamController,
  searchPlayersController,
  getPlayerByIdController,
  fetchAndSaveAllPlayersForAllLeaguesController,
} = require("../controllers/player.controller");


const {
    fetchAndSaveAllPlayerStatisticsController,
    fetchAndSaveAllTeamPlayerStatisticsController,
  } = require("../controllers/playerStatistics.controller");
  

router.get("/fetch-and-save", fetchAndSaveAllPlayersOfTeamController);

router.get("/search", searchPlayersController);

router.get("/getPlayer", getPlayerByIdController);


/**
 * @route GET /api/football/players/fetch-and-save-all-leagues
 * @desc Fetch and save all players for all teams in all leagues
 * @access Public
 */
router.get("/fetch-and-save-all-leagues-teams-player", fetchAndSaveAllPlayersForAllLeaguesController);






/**
 * @route POST /api/player-statistics/fetch-and-save
 * @desc Fetch and save statistics for multiple players.
 * @access Public
 */
router.post("/fetch-and-save-player-statistics", fetchAndSaveAllPlayerStatisticsController);

/**
 * @route POST /api/player-statistics/fetch-and-save-team-players
 * @desc Fetch and save statistics for all team players of a season.
 * @access Public
 */
router.post("/fetch-and-save-team-players-statistics", fetchAndSaveAllTeamPlayerStatisticsController);



module.exports = router;
