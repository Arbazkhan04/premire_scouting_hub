const {
    fetchAndSaveAllPlayersOfTeam,
    searchPlayers,
    getPlayerById,
    fetchAndSaveAllPlayersForAllLeagues
  } = require("../services/player.service");
  
  const CustomError = require("../../utils/customError");
  const responseHandler = require("../../utils/responseHandler");
  
  /**
   * Controller to fetch and save all players of a team for a given season.
   */
  const fetchAndSaveAllPlayersOfTeamController = async (req, res, next) => {
    try {
      const { teamId, season } = req.query;
  
      if (!teamId || !season) {
        throw new CustomError("teamId and season parameters are required", 400);
      }
     
  
      const savedPlayers = await fetchAndSaveAllPlayersOfTeam(Number(teamId), Number(season));
      responseHandler(res, 200, "Players fetched and saved successfully", savedPlayers);
    } catch (error) {
      console.error("Error in fetchAndSaveAllPlayersOfTeamController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to search players by name.
   */
  const searchPlayersController = async (req, res, next) => {
    try {
      const { query } = req.query;
      fetchAndSaveAllPlayersForAllLeagues
      if (!query) {
        throw new CustomError("query parameter is required", 400);
      }
  
      const players = await searchPlayers(query);
      responseHandler(res, 200, "Players retrieved successfully", players);
    } catch (error) {
      console.error("Error in searchPlayersController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };
  
  /**
   * Controller to get a player by their playerId.
   */
  const getPlayerByIdController = async (req, res, next) => {
    try {
      const { playerId } = req.query;
  
      if (!playerId) {
        throw new CustomError("playerId parameter is required", 400);
      }
  
      const player = await getPlayerById(Number(playerId));
      responseHandler(res, 200, "Player retrieved successfully", player);
    } catch (error) {
      console.error("Error in getPlayerByIdController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };



  /**
 * Controller to fetch and save all players for all teams in all leagues.
 */
const fetchAndSaveAllPlayersForAllLeaguesController = async (req, res, next) => {
  try {
    const savedPlayers = await fetchAndSaveAllPlayersForAllLeagues();
    responseHandler(res, 200, "All players fetched and saved successfully for all leagues", savedPlayers);
  } catch (error) {
    console.error("Error in fetchAndSaveAllPlayersForAllLeaguesController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};
  
  module.exports = {
    fetchAndSaveAllPlayersOfTeamController,
    searchPlayersController,
    getPlayerByIdController,
    fetchAndSaveAllPlayersForAllLeaguesController
  };
  