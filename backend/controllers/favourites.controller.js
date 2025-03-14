const {
  addPlayerToFavorites,
  removePlayerFromFavorites,
  addTeamToFavorites,
  removeTeamFromFavorites,
  getFavourites,
  favouriteHighlights,
  americanFootbalFavouriteHighlights,
} = require("../services/favourites.service");
const CustomError = require("../utils/customError");
const responseHandler = require("../utils/responseHandler");

/**
 * Controller to add a player to the user's favorites.
 */
const addPlayer = async (req, res, next) => {
  try {

  const userId = req.user.userId; // Extracted from auth middleware
  const { playerRef, playerId, sportName } = req.body;

  if (!playerRef || !playerId || !sportName) {
    return responseHandler(
      res,
      400,
      "PlayerRef,PlayerId and sportName are required",
      null
    );
  }

    const result = await addPlayerToFavorites(
      userId,
      playerRef,
      playerId,
      sportName
    );
    return responseHandler(res, 200, result.message, result?.favorites);
  } catch (error) {
    // next(error);
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to remove a player from the user's favorites for a specific sport.
 */
const removePlayer = async (req, res, next) => {
  try {

  const userId = req.user.userId;
  const { playerId, sportName } = req.query;

  if (!playerId || !sportName) {
    return responseHandler(
      res,
      400,
      "PlayerId and sportName are required",
      null
    );
  }

    const result = await removePlayerFromFavorites(userId, playerId, sportName);
    return responseHandler(res, 200, result.message, null);
  } catch (error) {
    // next(error);
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to add a team to the user's favorites for a specific sport.
 */
const addTeam = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { teamRef, teamId, sportName } = req.body;

    if (!teamRef || !teamId || !sportName) {
      return responseHandler(
        res,
        400,
        "TeamRef, TeamId, and SportName are required",
        null
      );
    }

    const result = await addTeamToFavorites(userId, teamRef, teamId, sportName);
    return responseHandler(res, 200, result.message, null);
  } catch (error) {
    // next(error);
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to remove a team from the user's favorites for a specific sport.
 */
const removeTeam = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { teamId, sportName } = req.query;

    if (!teamId || !sportName) {
      return responseHandler(
        res,
        400,
        "TeamId and SportName are required",
        null
      );
    }

    const result = await removeTeamFromFavorites(userId, teamId, sportName);
    return responseHandler(res, 200, result.message, null);
  } catch (error) {
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );

    // next(error);
  }
};

/**
 * Controller to get a user's favorites document by userId.
 */
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.userId; // Extracted from auth middleware
    const { sportName } = req.query;
    if (!userId || !sportName) {
      throw new CustomError("sportName is required", 400);
    }
    const favorites = await getFavourites(userId, sportName);
    return responseHandler(
      res,
      200,
      "User favorites retrieved successfully",
      favorites
    );
  } catch (error) {
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );

    // next(error);
  }
};

/**
 * Controller to get a user's favorite highlights for a given sport.
 */
const getFavoriteHighlights = async (req, res, next) => {
  try {
    const userId = req.user.userId; // Extracted from auth middleware
    const { sportName } = req.query; // Get sportName from request params
    if (!sportName) {
      return responseHandler(res, 400, "SportName are required", null);
    }

    // Call the service method to get the favourite highlights

    let highlights;
    if(sportName==="soccer"){
       highlights = await favouriteHighlights(userId, sportName);

    }

    if(sportName==="american-football"){
     highlights = await americanFootbalFavouriteHighlights(userId)

    }


    return responseHandler(
      res,
      200,
      "User favorite highlights retrieved successfully",
      highlights
    );
  } catch (error) {
    // next(error);
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

module.exports = {
  addPlayer,
  removePlayer,
  addTeam,
  removeTeam,
  getFavorites,
  getFavoriteHighlights,
};
