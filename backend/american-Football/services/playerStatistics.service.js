const AmericanFootballPlayerStatistics = require("../models/playerStatistics.model");
const AmericanFootballPlayer = require("../models/player.model");
const AmericanFootballTeam = require("../models/teams.model");
const { apiRequest } = require("../../utils/apiRequest");
const CustomError = require("../../utils/customError");

/**
 * Fetch player statistics from API.
 * @param {number} playerId - Player ID from API.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - Player statistics.
 */
const fetchPlayerStatistics = async (playerId, season) => {
  if (!playerId) throw new CustomError("playerId parameter is required", 400);
  if (!season) throw new CustomError("season parameter is required", 400);

  try {
    const response = await apiRequest(
      "https://api-american-football.p.rapidapi.com/players/statistics",
      { id: playerId, season: season },
      {
        "x-rapidapi-key": process.env.AMERICAN_FOOTBALL_API_KEY,
        "x-rapidapi-host": "api-american-football.p.rapidapi.com",
      }
    );

    if (!response || response.results === 0) {
      throw new CustomError("No statistics found for the given player and season", 404);
    }

    return response.response;
  } catch (error) {
    console.error("Error fetching player statistics:", error.message);
    throw new CustomError("Failed to fetch player statistics", 500);
  }
};

/**
 * Save player statistics in bulk.
 * @param {Array} statsData - Array of player statistics data.
 * @returns {Promise<Array>} - Saved statistics.
 */
const savePlayerStatistics = async (statsData) => {
  if (!Array.isArray(statsData) || statsData.length === 0) {
    throw new CustomError("No player statistics data provided", 400);
  }

  try {
    const bulkOps = statsData.map((stat) => ({
      updateOne: {
        filter: { playerId: stat.playerId, season: stat.season },
        update: { $set: stat },
        upsert: true,
      },
    }));

    await AmericanFootballPlayerStatistics.bulkWrite(bulkOps);
    return statsData;
  } catch (error) {
    console.error("Error saving player statistics:", error.message);
    throw new CustomError("Failed to save player statistics", 500);
  }
};

/**
 * Update player statistics reference in the player model.
 * @param {Array} statsData - Array of statistics data.
 */
const updatePlayerStatisticsReference = async (statsData) => {
  try {
    const bulkOps = statsData.map((stat) => ({
      updateOne: {
        filter: { playerId: stat.playerId },
        update: {
          $addToSet: {
            statistics: { season: stat.season, statDocRefId: stat._id },
          },
        },
      },
    }));

    await AmericanFootballPlayer.bulkWrite(bulkOps);
  } catch (error) {
    console.error("Error updating player statistics reference:", error.message);
    throw new CustomError("Failed to update player statistics reference", 500);
  }
};


/**
 * Fetch and save all statistics of given players for a season (Parallel Execution).
 * @param {Array} playerIds - Array of player IDs.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - Saved player statistics.
 */
const fetchAndSaveAllPlayerStatistics = async (playerIds, season) => {
    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      throw new CustomError("playerIds parameter must be a non-empty array", 400);
    }
    if (!season) throw new CustomError("season parameter is required", 400);
  
    try {
      console.log(`Fetching stats for ${playerIds.length} players in parallel...`);
  
      // Parallel API calls using Promise.all()
      const statsResponses = await Promise.all(
        playerIds.map((playerId) =>
          fetchPlayerStatistics(playerId, season).catch((error) => {
            console.warn(`Failed to fetch stats for player ${playerId}: ${error.message}`);
            return null; // Continue processing other players
          })
        )
      );
  
      // Process API responses
      const allStats = statsResponses
        .filter((stats) => stats && stats.length > 0)
        .flatMap((stats) =>
          stats.map((stat) => ({
            playerId: stat.player.id,
            season,
            teamId: stat.teams[0]?.team.id,
            teamName: stat.teams[0]?.team.name,
            teamLogo: stat.teams[0]?.team.logo,
            statistics: stat.teams[0]?.groups.map((group) => ({
              category: group.name,
              stats: group.statistics,
            })),
          }))
        );
  
      // Save stats in bulk
      if (allStats.length > 0) {
        const savedStats = await savePlayerStatistics(allStats);
        await updatePlayerStatisticsReference(savedStats);
        return savedStats;
      }
  
      return [];
    } catch (error) {
      console.error("Error fetching and saving all player statistics:", error.message);
      throw new CustomError("Failed to fetch and save player statistics", 500);
    }
  };
  

/**
 * Fetch and save all player statistics of all teams for a given season.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - List of saved player statistics.
 */
const fetchAndSaveAllTeamPlayerStatistics = async (season) => {
  if (!season) throw new CustomError("season parameter is required", 400);

  try {
    // Fetch all teams from the database
    const teams = await AmericanFootballTeam.find({});

    if (!teams || teams.length === 0) {
      throw new CustomError("No teams found in the database", 404);
    }

    // Collect all team player IDs for the given season
    const teamPlayerRequests = teams.map(async (team) => {
      const seasonData = team.players.find((entry) => entry.season ===Number(season));

      if (!seasonData || !seasonData.roster) {
        console.warn(`No players found for team ID: ${team.teamId} in season ${season}`);
        return [];
      }

      const playerIds = seasonData.roster.map((player) => player.playerId);
      console.log(`Fetching stats for team ID: ${team.teamId}, players: ${playerIds.length}`);

      return fetchAndSaveAllPlayerStatistics(playerIds, season);
    });

    // Execute all API calls in parallel
    const allTeamPlayerStats = await Promise.all(teamPlayerRequests);

    // Flatten the results since `Promise.all()` returns an array of arrays
    return allTeamPlayerStats.flat();
  } catch (error) {
    console.error("Error fetching and saving all team player statistics:", error.message);
    throw new CustomError("Failed to fetch and save all team player statistics", 500);
  }
};


module.exports = {
  fetchPlayerStatistics,
  savePlayerStatistics,
  updatePlayerStatisticsReference,
  fetchAndSaveAllPlayerStatistics,
  fetchAndSaveAllTeamPlayerStatistics,
};
