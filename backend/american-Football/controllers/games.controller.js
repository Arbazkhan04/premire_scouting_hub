const { fetchAndSaveGames,getUpcomingGames, getCompletedGames,processLiveGames } = require("../services/games.service");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * Controller to fetch and save all games to the database.
 */
const fetchAndSaveGamesController = async (req, res, next) => {
  try {
    const savedGames = await fetchAndSaveGames();
    responseHandler(res, 200, "Games fetched and saved successfully", savedGames);
  } catch (error) {
    console.error("Error in fetchAndSaveGamesController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

/**
 * Controller to get upcoming games for all leagues.
 */
const getUpcomingGamesController = async (req, res, next) => {
  try {
    const upcomingGames = await getUpcomingGames();
    responseHandler(res, 200, "Upcoming games retrieved successfully", upcomingGames);
  } catch (error) {
    console.error("Error in getUpcomingGamesController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

/**
 * Controller to get the last 10 completed games for each league.
 */
const getCompletedGamesController = async (req, res, next) => {
  try {
    const completedGames = await getCompletedGames();
    responseHandler(res, 200, "Completed games retrieved successfully", completedGames);
  } catch (error) {
    console.error("Error in getCompletedGamesController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};



/**
 * Controller to fetch and return live games for all leagues.
 */
const getLiveGamesController = async (req, res, next) => {
  try {
    const liveGames = await processLiveGames();
    responseHandler(res, 200, "Live games retrieved successfully", liveGames);
  } catch (error) {
    console.error("Error in getLiveGamesController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};



module.exports = {
  getUpcomingGamesController,
  getCompletedGamesController,
  fetchAndSaveGamesController,
  getLiveGamesController
};



