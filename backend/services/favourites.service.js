const Favorites = require("../models/favourites.model");
const CustomError = require("../utils/customError");

/**
 * Add a player to the user's favorites list.
 * @param {string} userId - The ID of the user.
 * @param {string} playerRef - The ObjectId of the SoccerPlayer.
 * @param {string} playerId - The external API Player ID.
 */
const addPlayerToFavorites = async (userId, playerRef, playerId) => {
  try {
    let favorites = await Favorites.findOne({ userId });

    if (!favorites) {
      favorites = new Favorites({ userId, players: [{ playerRef, playerId }] });
    } else {
      const isAlreadyFavorite = favorites.players.some((p) => p.playerId === playerId);
      if (isAlreadyFavorite) {
        throw new CustomError("Player is already in favorites", 400);
      }
      favorites.players.push({ playerRef, playerId });
    }

    await favorites.save();
    return { message: "Player added to favorites successfully" ,favorites};
  } catch (error) {
    throw new CustomError(error.message || "Error adding player to favorites", error.statusCode || 500);
  }
};

/**
 * Remove a player from the user's favorites list.
 * @param {string} userId - The ID of the user.
 * @param {string} playerId - The external API Player ID.
 */
const removePlayerFromFavorites = async (userId, playerId) => {
  try {
    const favorites = await Favorites.findOne({ userId });

    if (!favorites || favorites.players.length === 0) {
      throw new CustomError("No favorite players found", 404);
    }

    const updatedPlayers = favorites.players.filter((p) => p.playerId !== playerId);

    if (updatedPlayers.length === favorites.players.length) {
      throw new CustomError("Player not found in favorites", 404);
    }

    favorites.players = updatedPlayers;
    await favorites.save();

    return { message: "Player removed from favorites successfully" };
  } catch (error) {
    throw new CustomError(error.message || "Error removing player from favorites", error.statusCode || 500);
  }
};

/**
 * Add a team to the user's favorites list.
 * @param {string} userId - The ID of the user.
 * @param {string} teamRef - The ObjectId of the Team.
 * @param {string} teamId - The external API Team ID.
 */
const addTeamToFavorites = async (userId, teamRef, teamId) => {
  try {
    let favorites = await Favorites.findOne({ userId });

    if (!favorites) {
      favorites = new Favorites({ userId, teams: [{ teamRef, teamId }] });
    } else {
      const isAlreadyFavorite = favorites.teams.some((t) => t.teamId === teamId);
      if (isAlreadyFavorite) {
        throw new CustomError("Team is already in favorites", 400);
      }
      favorites.teams.push({ teamRef, teamId });
    }

    await favorites.save();
    return { message: "Team added to favorites successfully" };
  } catch (error) {
    throw new CustomError(error.message || "Error adding team to favorites", error.statusCode || 500);
  }
};

/**
 * Remove a team from the user's favorites list.
 * @param {string} userId - The ID of the user.
 * @param {string} teamId - The external API Team ID.
 */
const removeTeamFromFavorites = async (userId, teamId) => {
  try {
    const favorites = await Favorites.findOne({ userId });

    if (!favorites || favorites.teams.length === 0) {
      throw new CustomError("No favorite teams found", 404);
    }

    const updatedTeams = favorites.teams.filter((t) => t.teamId !== teamId);

    if (updatedTeams.length === favorites.teams.length) {
      throw new CustomError("Team not found in favorites", 404);
    }

    favorites.teams = updatedTeams;
    await favorites.save();

    return { message: "Team removed from favorites successfully" };
  } catch (error) {
    throw new CustomError(error.message || "Error removing team from favorites", error.statusCode || 500);
  }
};



/**
 * Get the favorites document of a user by userId.
 * @param {string} userId - The ID of the user.
 */
const getFavoritesByUserId = async (userId) => {
  try {
    const favorites = await Favorites.findOne({ userId })
      .populate("players.playerRef", "name position photo").populate("teams.teamRef", "name code country logo")
      // .populate("teams.teamRef", "name logo");

    if (!favorites) {
      throw new CustomError("No favorites found for this user", 404);
    }

    return favorites;
  } catch (error) {
    throw new CustomError(error.message || "Error fetching favorites", error.statusCode || 500);
  }
};




module.exports = {
  addPlayerToFavorites,
  removePlayerFromFavorites,
  addTeamToFavorites,
  removeTeamFromFavorites,
  getFavoritesByUserId
};
