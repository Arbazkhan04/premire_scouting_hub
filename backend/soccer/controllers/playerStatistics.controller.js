const {
  fetchPlayerStatisticsByPlayerId,
  savePlayerStatistics,
  fetchAndSaveAllPlayerStatistics,
  getPlayerAggregatedStats
} = require("../services/playerStatistics.service");
const CustomError = require("../../utils/customError"); // Using your custom error handler
const responseHandler = require("../../utils/responseHandler"); // Using your custom response handler

/**
 * Controller to handle fetching and saving player statistics for all seasons.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function to pass the error to.
 */
const fetchAndSavePlayerStatisticsController = async (req, res, next) => {
  const { playerId } = req.query; 

  // Validate input data
  if (!playerId) {
    return responseHandler(res, 400, "Player ID is required", null);
  }

  try {
    // Call the service method to fetch and save statistics for all seasons
    const result=await fetchAndSaveAllPlayerStatistics(playerId);

    // Return a custom success response
    return responseHandler(
        res,
        200,
        result.message,
        true
      );

  } catch (error) {
    // Handle errors using your custom error handler and pass the error to the next middleware
    console.error(
      "Error in fetchAndSavePlayerStatisticsController:",
      error.message
    );
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to handle the fetching of player statistics by playerId and season.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getPlayerStatistics = async (req, res, next) => {
  const { playerId, season } = req.params; // Player ID and season passed as parameters from the request

  if (!playerId || !season) {
    return responseHandler(res, 400, "Player ID and season are required", null);
  }

  try {
    // Call the service method to fetch player statistics
    const playerStatistics = await fetchPlayerStatisticsByPlayerId(
      playerId,
      season
    );

    // Return a custom success response
    return responseHandler(
      res,
      200,
      "Player statistics fetched successfully",
      playerStatistics
    );
  } catch (error) {
    // Handle errors using your custom error handler and pass the error to the next middleware
    console.error("Error in getplayerStatistics:", error.message);
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};



/**
 * Controller to get aggregated statistics for a player.
 */
const getPlayerAggregatedStatsController = async (req, res, next) => {
  try {
    const { playerId } = req.query;

    if (!playerId) {
      return responseHandler(res, 400, "Player ID and season are required", null);
    }

    // Get the aggregated stats for the player
    const aggregatedStats = await getPlayerAggregatedStats(playerId);

    // Respond with the aggregated stats
    responseHandler(res, 200, "Player aggregated statistics retrieved successfully", aggregatedStats);
  } catch (error) {
    console.error("Error in getPlayerAggregatedStatsController:", error.message);
    next(error instanceof customError ? error : new customError(error.message, 500));
  }
};

module.exports = {
  getPlayerStatistics,
  fetchAndSavePlayerStatisticsController,
  getPlayerAggregatedStatsController
};
