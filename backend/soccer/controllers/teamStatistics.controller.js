const {
  processTeamStatistics,
  fetchandSaveAllTeamsStatistics,
} = require("../services/teamStatistics.service");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler"); // Ensure this utility is correctly imported

/**
 * Controller to process team statistics
 */
const processTeamStatisticsController = async (req, res, next) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      throw new CustomError("Team ID is required", 400);
    }

    const result = await processTeamStatistics(teamId);

    responseHandler(res, 200, "Team statistics processed successfully", result);
  } catch (error) {
    console.error("Error in processTeamStatisticsController:", error.message);
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to process team statistics
 */
const fetchandSaveAllTeamsStatisticsController = async (req, res, next) => {
  try {
    const { leagueId } = req.query;

    if (!leagueId) {
      throw new CustomError("League ID is required", 400);
    }

    const result = await fetchandSaveAllTeamsStatistics(leagueId);

    responseHandler(res, 200, result.message, result);
  } catch (error) {
    console.error(
      "Error in fetchandSaveAllTeamsStatistics controller:",
      error.message
    );
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};







module.exports = {
  processTeamStatisticsController,
  fetchandSaveAllTeamsStatisticsController,
};
