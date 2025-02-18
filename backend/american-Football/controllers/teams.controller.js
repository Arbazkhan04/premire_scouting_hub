const {
    fetchAndSaveAllTeamsOfLeague,
    searchTeams,
    getTeamById,
  } = require("../services/teams.service");
  
  const CustomError = require("../../utils/customError");
  const responseHandler = require("../../utils/responseHandler");
  
  /**
   * Controller to fetch and save all teams of a league for a given season.
   */
  const fetchAndSaveAllTeamsOfLeagueController = async (req, res, next) => {
    try {
      const { leagueId, season } = req.query;
  
      if (!leagueId || !season) {
        throw new CustomError("leagueId and season parameter is required", 400);
      }
      
  
      const savedTeams = await fetchAndSaveAllTeamsOfLeague(Number(leagueId), Number(season));
      responseHandler(res, 200, "Teams fetched and saved successfully", savedTeams);
    } catch (error) {
      console.error("Error in fetchAndSaveAllTeamsOfLeagueController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to search teams by name.
   */
  const searchTeamsController = async (req, res, next) => {
    try {
      const { query } = req.query;
  
      if (!query) {
        throw new CustomError("query parameter is required", 400);
      }
  
      const teams = await searchTeams(query);
      responseHandler(res, 200, "Teams retrieved successfully", teams);
    } catch (error) {
      console.error("Error in searchTeamsController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to get a team by its teamId.
   */
  const getTeamByIdController = async (req, res, next) => {
    try {
      const { teamId } = req.query;
  
      if (!teamId) {
        throw new CustomError("teamId parameter is required", 400);
      }
  
      const team = await getTeamById(Number(teamId));
      responseHandler(res, 200, "Team retrieved successfully", team);
    } catch (error) {
      console.error("Error in getTeamByIdController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  module.exports = {
    fetchAndSaveAllTeamsOfLeagueController,
    searchTeamsController,
    getTeamByIdController,
  };
  