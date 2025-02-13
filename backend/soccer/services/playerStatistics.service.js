const axios = require("axios");
const SoccerProfile = require("../models/player.model");
const PlayerStatistic = require("../models/playerStatistics.model");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

/**
 * Fetch and save player statistics for all seasons from the soccerProfile model.
 * @param {string} playerId - The ID of the player whose statistics are to be fetched.
 */
const fetchAndSaveAllPlayerStatistics = async (playerId) => {
  try {
    // Fetch the player's profile from the database
    const playerProfile = await SoccerProfile.findOne({ playerId });

    if (
      !playerProfile ||
      !playerProfile.seasons ||
      playerProfile.seasons.length === 0
    ) {
      return { message: "No season found for this player" };

      // throw new CustomError('No seasons found for this player', 404);
    }

    // Sort the seasons array in descending order (top years to lower)
    const sortedSeasons = playerProfile.seasons
      .sort((a, b) => b - a)
      .slice(0, 5);

    // Fetch and save statistics for all seasons in parallel
    await Promise.all(
      sortedSeasons.map(async (season) => {
        const statistics = await fetchPlayerStatisticsByPlayerId(
          playerId,
          season
        );
        return savePlayerStatistics(playerId, season, statistics);
      })
    );

    // // Loop through the sorted seasons and fetch and save statistics for each season
    // for (const season of sortedSeasons) {
    //   // Fetch player statistics for the current season
    //   const statistics = await fetchPlayerStatisticsByPlayerId(playerId, season);

    //   // Save or update the player statistics in the database
    //   await savePlayerStatistics(playerId, season, statistics);
    // }

    return {
      message: "Player statistics for all seasons saved/updated successfully",
    };
  } catch (error) {
    throw new CustomError(
      error.message || "Error processing player statistics",
      error.statusCode || 500
    );
  }
};

/**
 * Fetch player statistics by playerId and season.
 * @param {string} playerId - The ID of the player.
 * @param {string} season - The season for which to fetch the statistics.
 */
const fetchPlayerStatisticsByPlayerId = async (playerId, season) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/players",
    params: {
      id: playerId,
      season: season,
    },
    headers: {
      "x-rapidapi-key": process.env.SOCCER_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const data = response.data;

    // Check if response data is available and return it in the custom format
    if (!data || !data.response) {
      throw new CustomError(
        `Player statistics not found for playerId ${playerId} season ${season}`,
        404
      );
    }

    return data?.response[0]?.statistics; // return the actual data to be processed by the controller
  } catch (error) {
    // Handle the error using the custom error handler
    throw new CustomError(
      error.message || "Error fetching player statistics",
      error.response ? error.response.status : 500
    );
  }
};

/**
 * Save or update player statistics for a given playerId and season.
 * @param {number} playerId - The ID of the player.
 * @param {number} season - The season for which the statistics are provided.
 * @param {Array} statistics - Array of statistics objects to be saved or updated.
 */
const savePlayerStatistics = async (playerId, season, statistics) => {
  try {
    // Prepare the document to be saved or updated
    const playerStatsDocument = {
      playerId: playerId,
      season: season,
      statistics: statistics,
    };

    // Use findOneAndUpdate with upsert true to save or update player statistics
    const savedPlayerStats = await PlayerStatistic.findOneAndUpdate(
      { playerId: playerId, season: season }, // Filter criteria
      { $set: playerStatsDocument }, // Update or insert the full document
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options
    );

    return savedPlayerStats; // Return the saved or updated statistics
  } catch (error) {
    throw new Error(
      `Error saving or updating player statistics: ${error.message}`
    ); // Propagate error to be handled in the controller
  }
};

module.exports = {
  fetchPlayerStatisticsByPlayerId,
  savePlayerStatistics,
  fetchAndSaveAllPlayerStatistics,
};
