const { fetchAndSaveLeague } = require("../services/leagues.service");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * Controller to fetch and save league data.
 */
const fetchAndSaveLeagueController = async (req, res, next) => {
  try {
    const { leagueId } = req.query;
    
    if (!leagueId) {
      throw new CustomError("League ID is required", 400);
    }

    const result = await fetchAndSaveLeague(leagueId);
    responseHandler(res, 200, "League data fetched and saved successfully", result);
  } catch (error) {
    console.error("Error in fetchAndSaveLeagueController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

module.exports = { fetchAndSaveLeagueController };
