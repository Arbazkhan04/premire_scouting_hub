const {
    fetchLeaguesFromAPI,
    saveLeagueToDB,
    fetchAndSaveLeagues,
    getAllLeagues,
    getLeagueById,
    updateLeagueTeams,
    getAllLeaguesStandings,
  } = require("../services/leagues.service");
  
  const CustomError = require("../../utils/customError");
  const responseHandler = require("../../utils/responseHandler");
  
  /**
   * Controller to fetch leagues from the API.
   */
  const fetchLeaguesFromAPIController = async (req, res, next) => {
    try {
      const leagues = await fetchLeaguesFromAPI();
      responseHandler(res, 200, "Leagues fetched successfully from API", leagues);
    } catch (error) {
      console.error("Error in fetchLeaguesFromAPIController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to fetch and save all leagues to the database.
   */
  const fetchAndSaveLeaguesController = async (req, res, next) => {
    try {
      const savedLeagues = await fetchAndSaveLeagues();
      responseHandler(res, 200, "Leagues fetched and saved successfully", savedLeagues);
    } catch (error) {
      console.error("Error in fetchAndSaveLeaguesController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to get all leagues from the database.
   */
  const getAllLeaguesController = async (req, res, next) => {
    try {
      const leagues = await getAllLeagues();
      if (!leagues || leagues.length === 0) {
        throw new CustomError("No leagues found in the database", 404);
      }
      responseHandler(res, 200, "Leagues retrieved successfully", leagues);
    } catch (error) {
      console.error("Error in getAllLeaguesController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to get a single league by leagueId.
   */
  const getLeagueByIdController = async (req, res, next) => {
    try {
      const { leagueId } = req.query;
  
      if (!leagueId) {
        throw new CustomError("leagueId parameter is required", 400);
      }
  
      const league = await getLeagueById(leagueId);
      if (!league) {
        throw new CustomError(`No league found with ID: ${leagueId}`, 404);
      }
  
      responseHandler(res, 200, "League retrieved successfully", league);
    } catch (error) {
      console.error("Error in getLeagueByIdController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to update a league by adding a team to its teams array.
   */
  const updateLeagueTeamsController = async (req, res, next) => {
    try {
      const { leagueId } = req.params;
      const { _id, teamId } = req.body;
  
      if (!leagueId) {
        throw new CustomError("leagueId parameter is required", 400);
      }
      if (!_id) {
        throw new CustomError("_id (team document ID) is required", 400);
      }
      if (!teamId) {
        throw new CustomError("teamId (API team ID) is required", 400);
      }
  
      const updatedLeague = await updateLeagueTeams(leagueId, { _id, teamId });
      if (!updatedLeague) {
        throw new CustomError(`No league found with ID: ${leagueId}`, 404);
      }
  
      responseHandler(res, 200, "Team added to league successfully", updatedLeague);
    } catch (error) {
      console.error("Error in updateLeagueTeamsController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };





/**
 * Controller to get standings for all leagues.
 */
const getAllLeaguesStandingsController = async (req, res, next) => {
  try {
    const standings = await getAllLeaguesStandings()

    responseHandler(res, 200, "Standings retrieved successfully", standings);
  } catch (error) {
    console.error("Error in getAllLeaguesStandingsController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

  
  module.exports = {
    fetchLeaguesFromAPIController,
    fetchAndSaveLeaguesController,
    getAllLeaguesController,
    getLeagueByIdController,
    updateLeagueTeamsController,
    getAllLeaguesStandingsController
  };
  