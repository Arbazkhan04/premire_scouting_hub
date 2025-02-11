const { fetchAndSaveTeams } = require('../services/teamManagement.service');
const responseHandler = require('../../utils/responseHandler');
const CustomError = require('../../utils/customError');

/**
 * Controller to fetch and save teams
 */
const saveTeams = async (req, res, next) => {
  try {
    const { leagueId, season } = req.query;

    // Validate input
    if (!leagueId || !season) {
      throw new CustomError("League ID and Season are required", 400);
    }

    // Fetch and save teams
    await fetchAndSaveTeams(leagueId, season);

    // Send success response
    responseHandler(res, 200, "Teams successfully fetched and saved");
  } catch (error) {
    console.error("Error in saveTeamsController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

module.exports = { saveTeams };
