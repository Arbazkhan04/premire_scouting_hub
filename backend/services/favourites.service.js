const Favorites = require("../models/favourites.model");
const {
  getFilteredLeagueStandings,
} = require("../soccer/services/leagueStandings.service");
const {
  getPlayerStatsSummary,
} = require("../soccer/services/playerStatistics.service");
const {
  getTeamStatsOfSeason,
} = require("../soccer/services/teamStatistics.service");
const CustomError = require("../utils/customError");
const AmericanFootballFavorites = require("../american-Football/models/favourites.model");

/**
 * Get the correct model based on the sport name.
 * @param {string} sportName - The name of the sport.
 * @returns {Model} - The correct Mongoose model.
 */
const getFavoritesModel = (sportName) => {
  if (sportName === "american-football") {
    return AmericanFootballFavorites;
  } else if (sportName === "soccer") {
    return Favorites;
  } else {
    throw new CustomError("Invalid sport name", 400);
  }
};

/**
 * Add a player to the user's favorites list for a specific sport.
 * @param {string} userId - The ID of the user.
 * @param {string} playerRef - The ObjectId of the Player.
 * @param {string} playerId - The external API Player ID.
 * @param {string} sportName - The name of the sport.
 */
const addPlayerToFavorites = async (userId, playerRef, playerId, sportName) => {
  try {
    const FavoritesModel = getFavoritesModel(sportName);
    let favorites = await FavoritesModel.findOne({ userId });

    if (!favorites) {
      favorites = new FavoritesModel({
        userId,
        favourites: [
          { sportName, players: [{ playerRef, playerId }], teams: [] },
        ],
      });
    } else {
      let sportEntry = favorites.favourites.find(
        (fav) => fav.sportName === sportName
      );

      if (!sportEntry) {
        favorites.favourites.push({
          sportName,
          players: [{ playerRef, playerId }],
          teams: [],
        });
      } else {
        const isAlreadyFavorite = sportEntry.players.some(
          (p) => p.playerId === playerId
        );
        if (isAlreadyFavorite) {
          throw new CustomError("Player is already in favorites", 400);
        }
        sportEntry.players.push({ playerRef, playerId });
      }
    }

    await favorites.save();
    return { message: "Player added to favorites successfully", favorites };
  } catch (error) {
    throw new CustomError(
      error.message || "Error adding player to favorites",
      error.statusCode || 500
    );
  }
};

/**
 * Remove a player from the user's favorites list for a specific sport.
 * @param {string} userId - The ID of the user.
 * @param {string} playerId - The external API Player ID.
 * @param {string} sportName - The name of the sport.
 */
const removePlayerFromFavorites = async (userId, playerId, sportName) => {
  try {
    const FavoritesModel = getFavoritesModel(sportName);
    const favorites = await FavoritesModel.findOne({ userId });

    if (!favorites) {
      throw new CustomError("No favorites found", 404);
    }

    const sportFavorites = favorites.favourites.find(
      (fav) => fav.sportName === sportName
    );
    if (!sportFavorites || sportFavorites.players.length === 0) {
      throw new CustomError(`No favorite players found for ${sportName}`, 404);
    }

    const updatedPlayers = sportFavorites.players.filter(
      (p) => p.playerId !== playerId
    );
    if (updatedPlayers.length === sportFavorites.players.length) {
      throw new CustomError("Player not found in favorites", 404);
    }

    sportFavorites.players = updatedPlayers;
    await favorites.save();

    return { message: "Player removed from favorites successfully" };
  } catch (error) {
    throw new CustomError(
      error.message || "Error removing player from favorites",
      error.statusCode || 500
    );
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
    const FavoritesModel = getFavoritesModel(sportName);
    let favorites = await FavoritesModel.findOne({ userId });

    if (!favorites) {
      favorites = new FavoritesModel({
        userId,
        favourites: [{ sportName, teams: [{ teamRef, teamId }] }],
      });
    } else {
      let sportFavorites = favorites.favourites.find(
        (fav) => fav.sportName === sportName
      );

      if (!sportFavorites) {
        favorites.favourites.push({ sportName, teams: [{ teamRef, teamId }] });
      } else {
        const isAlreadyFavorite = sportFavorites.teams.some(
          (t) => t.teamId === teamId
        );
        if (isAlreadyFavorite) {
          throw new CustomError("Team is already in favorites", 400);
        }
        sportFavorites.teams.push({ teamRef, teamId });
      }
    }

    await favorites.save();
    return { message: "Team added to favorites successfully" };
  } catch (error) {
    throw new CustomError(
      error.message || "Error adding team to favorites",
      error.statusCode || 500
    );
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
    const FavoritesModel = getFavoritesModel(sportName);
    const favorites = await FavoritesModel.findOne({ userId });

    if (!favorites) {
      throw new CustomError("No favorites found", 404);
    }

    const sportFavorites = favorites.favourites.find(
      (fav) => fav.sportName === sportName
    );
    if (!sportFavorites || sportFavorites.teams.length === 0) {
      throw new CustomError(`No favorite teams found for ${sportName}`, 404);
    }

    const updatedTeams = sportFavorites.teams.filter(
      (t) => t.teamId !== teamId
    );
    if (updatedTeams.length === sportFavorites.teams.length) {
      throw new CustomError("Team not found in favorites", 404);
    }

    sportFavorites.teams = updatedTeams;
    await favorites.save();

    return { message: "Team removed from favorites successfully" };
  } catch (error) {
    throw new CustomError(
      error.message || "Error removing team from favorites",
      error.statusCode || 500
    );
  }
};

// const getFavoritesByUserId = async (userId) => {
//   try {
//     const favorites = await Favorites.findOne({ userId })
//       .populate("favourites.players.playerRef", "name position photo seasons")
//       .populate("favourites.teams.teamRef", "name code country logo seasons");

//     if (!favorites) {
//       throw new CustomError("No favorites found for this user", 404);
//     }
//     console.log("Favorites:", JSON.stringify(favorites, null, 2));

//     // Filter only seasons where stats === true
//     favorites.favourites.teams.forEach(team => {
//       // console.log(team.)
//       if (team.teamRef) {
//         team.teamRef.seasons = team.teamRef.seasons.filter(season => season.stats === true);
//       }
//     });

//     return favorites;
//   } catch (error) {
//     throw new CustomError(error.message || "Error fetching favorites", error.statusCode || 500);
//   }
// };

/**
 * Get the favourite highlights stats.
 * @param {string} userId - The ID of the user.
 */
const favouriteHighlights = async (userId, sportName) => {
  try {
    //Step 1: get favourites by userId
    const userFavourites = await getSoccerFavourites(userId);

    // Step 2: Find the sportName favorites
    const sportFavorites = userFavourites.favourites.find(
      (fav) => fav.sportName === sportName
    );
    if (!sportFavorites) {
      throw new CustomError(
        `No favorites found for the sport: ${sportName}`,
        404
      );
    }
    //for soccersport data use this if condition
    if (sportName == "soccer") {
      // Step 3: Prepare results for players and teams
      const playerHighlights = [];
      const teamHighlights = [];
      let leagueHighlights;

      // Step 4: Fetch player stats for the sport
      for (let player of sportFavorites.players) {
        const playerId = player.playerId; // Assuming playerRef contains the player data
        const seasons = player?.playerRef?.seasons;
        if (seasons.length < 1) {
          playerHighlights.push({
            playerId: playerId,
            playerName: player.playerRef.name,
            photo: player.playerRef.photo,
            season: null,
            position: player.playerRef.position,
            statsSummary: null,
          });
          continue;
        }
        // Get the latest season stats for this player
        const latestSeason = player.playerRef.seasons.sort((a, b) => b - a)[0];

        const playerSummary = await getPlayerStatsSummary(
          playerId,
          latestSeason
        );

        playerHighlights.push({
          playerId: playerId,
          playerName: player.playerRef.name,
          photo: player.playerRef.photo,
          season: latestSeason,
          position: player.playerRef.position,
          statsSummary: playerSummary,
        });
      }

      // Step 5: Fetch team stats for the sport
      for (let team of sportFavorites.teams) {
        const teamId = team.teamId;
        console.log(team.teamRef.seasons);
        // Get the latest season stats for this team
        const latestSeason = team.teamRef.seasons.sort(
          (a, b) => b.year - a.year
        )[0]?.year;

        const teamStats = await getTeamStatsOfSeason(teamId, latestSeason);
        const organizedStats = [];
        for (stats of teamStats) {
          const setStats = {
            matchesPlayed: stats.fixtures?.played?.total || 0,
            wins: stats?.fixtures?.wins?.total || 0,
            loses: stats?.fixtures?.loses?.total || 0,
            form: stats?.form,
            leagueId: stats?.league,
          };
          organizedStats.push(setStats);
        }
        teamHighlights.push({
          team: team.teamRef.name,
          teamId: teamStats[0]?.team,
          code: team.teamRef.code,
          season: latestSeason,
          logo: team.teamRef.logo,
          statsSummary: organizedStats,
        });

        //leagueStats (standings and top scorer)
        const getAllLeagueStandings = await getFilteredLeagueStandings();

        leagueHighlights = getAllLeagueStandings;
      }

      // Return combined highlights
      return {
        players: playerHighlights,
        teams: teamHighlights,
        leagues: leagueHighlights,
      };
    }
  } catch (error) {
    throw new CustomError(
      error.message || "Error fetching favorites",
      error.statusCode || 500
    );
  }
};

/**
 * Get Soccer favorites of a user by userId.
 * @param {string} userId - The ID of the user.
 */
const getSoccerFavourites = async (userId) => {
  try {
    const favorites = await Favorites.findOne({ userId })
      .populate("favourites.players.playerRef", "name position photo seasons")
      .populate("favourites.teams.teamRef", "name code country logo seasons");

    if (!favorites) {
      throw new CustomError("No soccer favorites found for this user", 404);
    }

    console.log("Soccer Favorites:", JSON.stringify(favorites, null, 2));

    // Check if favourites and teams exist before filtering
    if (favorites.favourites && Array.isArray(favorites.favourites)) {
      favorites.favourites.forEach((fav) => {
        if (
          fav.sportName === "soccer" &&
          fav.teams &&
          Array.isArray(fav.teams)
        ) {
          fav.teams.forEach((team) => {
            if (team.teamRef && Array.isArray(team.teamRef.seasons)) {
              // Filter seasons where stats === true
              team.teamRef.seasons = team.teamRef.seasons.filter(
                (season) => season.stats === true
              );
            }
          });
        }
      });
    }

    return favorites;
  } catch (error) {
    throw new CustomError(
      error.message || "Error fetching soccer favorites",
      error.statusCode || 500
    );
  }
};

/**
 * Get American Football favorites of a user by userId.
 * @param {string} userId - The ID of the user.
 */
const getAmericanFootballFavourites = async (userId) => {
  try {
    const favorites = await AmericanFootballFavorites.findOne({ userId })
    .populate("favourites.players.playerRef", "group image name number position") // ✅ Populate favorite players
    .populate({
      path: "favourites.teams.teamRef",
      select: "name code country logo players", // ✅ Select only necessary fields
      populate: {
        path: "players.roster.playerRefId", // ✅ Deep populate nested roster array
        model: "AmericanFootballPlayer", // ✅ Ensure correct reference model
        select: "group image name number position", // ✅ Select only required fields
      },
    });
  
    if (!favorites) {
      throw new CustomError(
        "No American Football favorites found for this user",
        404
      );
    }

    console.log(
      "American Football Favorites:",
      JSON.stringify(favorites, null, 2)
    );

    return favorites;
  } catch (error) {
    throw new CustomError(
      error.message || "Error fetching American Football favorites",
      error.statusCode || 500
    );
  }
};

/**
 * Get favorites based on sport name.
 * @param {string} userId - The ID of the user.
 * @param {string} sportName - The name of the sport.
 */
const getFavourites = async (userId, sportName) => {
  try {
    if (!sportName) {
      throw new CustomError("Sport name is required", 400);
    }

    if (sportName === "soccer") {
      return await getSoccerFavourites(userId);
    } else if (sportName === "american-football") {
      return await getAmericanFootballFavourites(userId);
    } else {
      throw new CustomError("Invalid sport name", 400);
    }
  } catch (error) {
    throw new CustomError(
      error.message || "Error fetching favorites",
      error.statusCode || 500
    );
  }
};

module.exports = {
  addPlayerToFavorites,
  removePlayerFromFavorites,
  addTeamToFavorites,
  removeTeamFromFavorites,
  getSoccerFavourites,
  getAmericanFootballFavourites,
  getFavourites,
  favouriteHighlights,
};
