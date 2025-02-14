const Favorites = require("../models/favourites.model");
const CustomError = require("../utils/customError");



/**
 * Add a player to the user's favorites list for a specific sport.
 * @param {string} userId - The ID of the user.
 * @param {string} playerRef - The ObjectId of the Player.
 * @param {string} playerId - The external API Player ID.
 * @param {string} sportName - The name of the sport.
 */
const addPlayerToFavorites = async (userId, playerRef, playerId, sportName) => {
  try {
    let favorites = await Favorites.findOne({ userId });

    if (!favorites) {
      favorites = new Favorites({
        userId,
        favourites: [
          {
            sportName,
            players: [{ playerRef, playerId }],
            teams: [],
          },
        ],
      });
    } else {
      let sportEntry = favorites.favourites.find((fav) => fav.sportName === sportName);

      if (!sportEntry) {
        favorites.favourites.push({
          sportName,
          players: [{ playerRef, playerId }],
          teams: [],
        });
      } else {
        const isAlreadyFavorite = sportEntry.players.some((p) => p.playerId === playerId);
        if (isAlreadyFavorite) {
          throw new CustomError("Player is already in favorites", 400);
        }
        sportEntry.players.push({ playerRef, playerId });
      }
    }

    await favorites.save();
    return { message: "Player added to favorites successfully", favorites };
  } catch (error) {
    throw new CustomError(error.message || "Error adding player to favorites", error.statusCode || 500);
  }
};


// /**
//  * Add a player to the user's favorites list.
//  * @param {string} userId - The ID of the user.
//  * @param {string} playerRef - The ObjectId of the SoccerPlayer.
//  * @param {string} playerId - The external API Player ID.
//  */
// const addPlayerToFavorites = async (userId, playerRef, playerId,sportName) => {
//   try {
//     let favorites = await Favorites.findOne({ userId });

//     if (!favorites) {
//       favorites = new Favorites({ userId, players: [{ playerRef, playerId }] });
//     } else {
//       const isAlreadyFavorite = favorites.players.some((p) => p.playerId === playerId);
//       if (isAlreadyFavorite) {
//         throw new CustomError("Player is already in favorites", 400);
//       }
//       favorites.players.push({ playerRef, playerId });
//     }

//     await favorites.save();
//     return { message: "Player added to favorites successfully" ,favorites};
//   } catch (error) {
//     throw new CustomError(error.message || "Error adding player to favorites", error.statusCode || 500);
//   }
// };

/**
 * Remove a player from the user's favorites list for a specific sport.
 * @param {string} userId - The ID of the user.
 * @param {string} playerId - The external API Player ID.
 * @param {string} sportName - The name of the sport.
 */
const removePlayerFromFavorites = async (userId, playerId, sportName) => {
  try {
    const favorites = await Favorites.findOne({ userId });

    if (!favorites) {
      throw new CustomError("No favorites found", 404);
    }

    const sportFavorites = favorites.favourites.find(fav => fav.sportName === sportName);

    if (!sportFavorites || sportFavorites.players.length === 0) {
      throw new CustomError(`No favorite players found for ${sportName}`, 404);
    }

    const updatedPlayers = sportFavorites.players.filter((p) => p.playerId !== playerId);

    if (updatedPlayers.length === sportFavorites.players.length) {
      throw new CustomError("Player not found in favorites", 404);
    }

    sportFavorites.players = updatedPlayers;
    await favorites.save();

    return { message: "Player removed from favorites successfully" };
  } catch (error) {
    throw new CustomError(error.message || "Error removing player from favorites", error.statusCode || 500);
  }
};

/**
 * Add a team to the user's favorites list for a specific sport.
 * @param {string} userId - The ID of the user.
 * @param {string} teamRef - The ObjectId of the Team.
 * @param {string} teamId - The external API Team ID.
 * @param {string} sportName - The name of the sport.
 */
const addTeamToFavorites = async (userId, teamRef, teamId, sportName) => {
  try {
    let favorites = await Favorites.findOne({ userId });

    if (!favorites) {
      favorites = new Favorites({
        userId,
        favourites: [{ sportName, teams: [{ teamRef, teamId }] }],
      });
    } else {
      let sportFavorites = favorites.favourites.find(fav => fav.sportName === sportName);

      if (!sportFavorites) {
        favorites.favourites.push({ sportName, teams: [{ teamRef, teamId }] });
      } else {
        const isAlreadyFavorite = sportFavorites.teams.some((t) => t.teamId === teamId);
        if (isAlreadyFavorite) {
          throw new CustomError("Team is already in favorites", 400);
        }
        sportFavorites.teams.push({ teamRef, teamId });
      }
    }

    await favorites.save();
    return { message: "Team added to favorites successfully" };
  } catch (error) {
    throw new CustomError(error.message || "Error adding team to favorites", error.statusCode || 500);
  }
};

/**
 * Remove a team from the user's favorites list for a specific sport.
 * @param {string} userId - The ID of the user.
 * @param {string} teamId - The external API Team ID.
 * @param {string} sportName - The name of the sport.
 */
const removeTeamFromFavorites = async (userId, teamId, sportName) => {
  try {
    const favorites = await Favorites.findOne({ userId });

    if (!favorites) {
      throw new CustomError("No favorites found", 404);
    }

    const sportFavorites = favorites.favourites.find(fav => fav.sportName === sportName);

    if (!sportFavorites || sportFavorites.teams.length === 0) {
      throw new CustomError(`No favorite teams found for ${sportName}`, 404);
    }

    const updatedTeams = sportFavorites.teams.filter((t) => t.teamId !== teamId);

    if (updatedTeams.length === sportFavorites.teams.length) {
      throw new CustomError("Team not found in favorites", 404);
    }

    sportFavorites.teams = updatedTeams;
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
      .populate("favourites.players.playerRef", "name position photo")
      .populate("favourites.teams.teamRef", "name code country logo");

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
