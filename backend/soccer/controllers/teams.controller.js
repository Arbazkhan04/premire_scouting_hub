const { fetchAndSaveTeams,searchTeam,getTeamByTeamId } = require('../services/teams.service');
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


/**
 * Controller to search for teams by name.
 */
const searchTeamController = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      throw new CustomError("Search query is required", 400);
    }

    const teams = await searchTeam(query);
    if(teams==null){
    responseHandler(res, 404, "No team found", teams);

    }
    responseHandler(res, 200, "Teams found successfully", teams);
  } catch (error) {
    console.error("Error in searchTeamController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};



/**
 * Controller to fetch team data by teamId.
 */
const getTeamByTeamIdController = async (req, res, next) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      throw new CustomError("Team ID is required", 400);
    }

    const team = await getTeamByTeamId(teamId);
    responseHandler(res, 200, "Team data fetched successfully", team);
  } catch (error) {
    console.error("Error in getTeamByTeamIdController:", error.message);
        // If error is already a CustomError, pass it along, else create a new one
        next(error instanceof CustomError ? error : new CustomError("Failed to fetch team", 500));
 
  }
};

module.exports = { saveTeams ,searchTeamController,getTeamByTeamIdController};
