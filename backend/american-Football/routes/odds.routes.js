const express = require("express");
const { getOddsByGameIdController, getOddsForUpcomingGamesController } = require("../controllers/odds.controller");

const router = express.Router();

/**
 * @route GET /api/american-football/odds/:gameId
 * @desc Fetch odds for a specific game
 * @access Public
 */
router.get("/getOddsbyGameID", getOddsByGameIdController);




/**
 * @route GET /api/american-football/odds/upcoming
 * @desc Fetch odds for all upcoming games
 * @access Public
 */
router.get("/oddsOfAllUpcomingGames", getOddsForUpcomingGamesController);

module.exports = router;
