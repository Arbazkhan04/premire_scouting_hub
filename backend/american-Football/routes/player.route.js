const express = require("express");
const router = express.Router();
const {
  fetchAndSaveAllPlayersOfTeamController,
  searchPlayersController,
  getPlayerByIdController,
  fetchAndSaveAllPlayersForAllLeaguesController,
} = require("../controllers/player.controller");

router.get("/fetch-and-save", fetchAndSaveAllPlayersOfTeamController);

router.get("/search", searchPlayersController);

router.get("/getPlayer", getPlayerByIdController);


/**
 * @route GET /api/football/players/fetch-and-save-all-leagues
 * @desc Fetch and save all players for all teams in all leagues
 * @access Public
 */
router.get("/fetch-and-save-all-leagues-teams-player", fetchAndSaveAllPlayersForAllLeaguesController);

module.exports = router;
