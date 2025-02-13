const {
    addPlayerToFavorites,
    removePlayerFromFavorites,
    addTeamToFavorites,
    removeTeamFromFavorites,
    getFavoritesByUserId
  } = require("../services/favourites.service");
  const responseHandler = require("../utils/responseHandler");
  
  /**
   * Controller to add a player to the user's favorites.
   */
  const addPlayer = async (req, res, next) => {
    const userId = req.user.userId; // Extracted from auth middleware
    const { playerRef, playerId } = req.body;
  
    if (!playerRef || !playerId) {
      return responseHandler(res, 400, "PlayerRef and PlayerId are required", null);
    }
  
    try {
      const result = await addPlayerToFavorites(userId, playerRef, playerId);
      return responseHandler(res, 200, result.message, result?.favorites);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controller to remove a player from the user's favorites.
   */
  const removePlayer = async (req, res, next) => {
    const userId = req.user.userId;
    const { playerRef, playerId } = req.query;
  
    if (!playerId) {
      return responseHandler(res, 400, "PlayerId is required", null);
    }
  
    try {
      const result = await removePlayerFromFavorites(userId, playerId);
      return responseHandler(res, 200, result.message, null);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controller to add a team to the user's favorites.
   */
  const addTeam = async (req, res, next) => {
    const userId = req.user.userId;
    const { teamRef, teamId } = req.body;
  
    if (!teamRef || !teamId) {
      return responseHandler(res, 400, "TeamRef and TeamId are required", null);
    }
  
    try {
      const result = await addTeamToFavorites(userId, teamRef, teamId);
      return responseHandler(res, 200, result.message, null);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controller to remove a team from the user's favorites.
   */
  const removeTeam = async (req, res, next) => {
    const userId = req.user.userId;
    const { teamId } = req.query;
  
    if (!teamId) {
      return responseHandler(res, 400, "TeamId is required", null);
    }
  
    try {
      const result = await removeTeamFromFavorites(userId, teamId);
      return responseHandler(res, 200, result.message, null);
    } catch (error) {
      next(error);
    }
  };


  /**
 * Controller to get a user's favorites document by userId.
 */
const getFavorites = async (req, res, next) => {
  const userId = req.user.userId; // Extracted from auth middleware

  try {
    const favorites = await getFavoritesByUserId(userId);
    return responseHandler(res, 200, "User favorites retrieved successfully", favorites);
  } catch (error) {
    next(error);
  }
};
  
  module.exports = {
    addPlayer,
    removePlayer,
    addTeam,
    removeTeam,
    getFavorites
  };
  