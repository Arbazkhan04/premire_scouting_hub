const { getOddsByGameId, getOddsofAllUpcomingGames } = require("../services/odds.service");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const { getFixtureOddsByFixtureIdFromDB } = require("../../soccer/services/odds.service");

/**
 * Controller to get odds for a specific game.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function to pass the error.
 */
const getOddsByGameIdController = async (req, res, next) => {
  try {
    const { gameId } = req.query;

    if (!gameId) {
      return responseHandler(res, 400, "Game ID is required", null);
    }

    // Fetch odds from the service
    const odds = await getOddsByGameId(gameId);

    // Return success response
    return responseHandler(
      res,
      200,
      "Odds fetched successfully",
      odds
    );
  } catch (error) {
    console.error("❌ Error in getOddsByGameIdController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};





/**
 * Controller to handle fetching odds for all upcoming games.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function to pass the error to.
 */
const getOddsForUpcomingGamesController = async (req, res, next) => {
    try {
      const oddsData = await getOddsofAllUpcomingGames();
  
      return responseHandler(
        res,
        200,
        oddsData.message,
        oddsData.data
      );
    } catch (error) {
      console.error("❌ Error in getOddsForUpcomingGamesController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };


  /**
 * Controller to get fixture odds from the database by fixture ID.
 */
const getFixtureOddsByFixtureIdController = async (req, res, next) => {
  try {
    const {fixtureId} = req.query; // Convert to number
    if (!fixtureId)  {
      throw new CustomError("fixture Id required", 400);
    }

    const fixtureOdds = await getFixtureOddsByFixtureIdFromDB(fixtureId);
    
    responseHandler(res, 200, "Fixture odds retrieved successfully", fixtureOdds);
  } catch (error) {
    console.error("❌ Error in getFixtureOddsByFixtureIdController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};


module.exports = {
  getOddsByGameIdController,
  getOddsForUpcomingGamesController,
  getFixtureOddsByFixtureIdController
};
