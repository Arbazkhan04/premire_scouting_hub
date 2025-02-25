const express = require("express");
const router = express.Router();
const { fetchAndSaveGamesController, getUpcomingGamesController, getCompletedGamesController, getLiveGamesController } = require("../controllers/games.controller");

/**
 * @route GET /api/games/fetch-and-save
 * @desc Fetch and save all games to the database
 * @access Public
 */
router.get("/fetch-and-save", fetchAndSaveGamesController);




/**
 * @route GET /api/games/upcoming
 * @desc Get upcoming games for all leagues
 * @access Public
 */
router.get("/upcoming", getUpcomingGamesController);

/**
 * @route GET /api/games/completed
 * @desc Get last 10 completed games for each league
 * @access Public
 */
router.get("/completed", getCompletedGamesController);



/**
 * @route GET /api/games/live
 * @desc Fetch and return live games for all leagues
 * @access Public
 */
router.get("/live", getLiveGamesController);

module.exports = router;
