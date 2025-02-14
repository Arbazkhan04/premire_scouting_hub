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





const getPlayerAggregatedStats = async (playerId) => {
  try {
    // Fetch all statistics for the player
    const playerStatsDocs = await PlayerStatistic.find({ playerId });

    if (!playerStatsDocs.length) {
      throw new CustomError(`No statistics found for player ID: ${playerId}`, 404);
    }

    // Initialize an empty object to store aggregated stats
    const aggregatedStats = {};

    // Iterate through all documents
    for (const doc of playerStatsDocs) {
      const season = doc.season;

      // If season is not already in the aggregatedStats, initialize it
      if (!aggregatedStats[season]) {
        aggregatedStats[season] = {
          playerId,  // Include player ID in each season's stats
          season,
          totalGoals: 0,
          totalFouls: 0,
          cards: { yellow: 0, yellowred: 0, red: 0 },
          penalty: { won: 0, scored: 0, missed: 0, saved: 0 },
          lineups:0,
          totalMinutesPlayed:0,
          // rating:0,
          shots:0,
          passes:0,
          tackles:0,
          duels:0,
          dribbles:0,
          leaguesandTeams:[],
          

        };
      }

      // Iterate through all statistics for this season
      for (const stat of doc.statistics) {
        aggregatedStats[season].totalGoals += stat.goals?.total || 0;
        aggregatedStats[season].totalFouls += stat.fouls?.committed || 0;

        // Aggregate cards
        aggregatedStats[season].cards.yellow += stat.cards?.yellow || 0;
        aggregatedStats[season].cards.yellowred += stat.cards?.yellowred || 0;
        aggregatedStats[season].cards.red += stat.cards?.red || 0;

        // Aggregate penalties
        aggregatedStats[season].penalty.won += stat.penalty?.won || 0;
        aggregatedStats[season].penalty.scored += stat.penalty?.scored || 0;
        aggregatedStats[season].penalty.missed += stat.penalty?.missed || 0;
        aggregatedStats[season].penalty.saved += stat.penalty?.saved || 0;


        //leagues and teams in which player play
        aggregatedStats[season].leaguesandTeams.push({league:stat.league?.name,team:stat.team?.name})

        aggregatedStats[season].lineups += stat.games?.lineups;
        aggregatedStats[season].totalMinutesPlayed += stat.games?.minutes;
        // aggregatedStats[season].rating += stat.games?.rating;
        aggregatedStats[season].shots += stat.shots?.total;
        aggregatedStats[season].passes += stat.passes?.total;
        aggregatedStats[season].tackles += stat.tackles?.total;
        aggregatedStats[season].duels += stat.duels?.total;
        aggregatedStats[season].dribbles += stat.dribbles?.success;




        console.log(aggregatedStats[2024])
      }
    }

    // Convert aggregatedStats object into an array for frontend usage
    return Object.values(aggregatedStats);
  } catch (error) {
    console.error("Error fetching player statistics:", error);
    throw new CustomError(error.message || "Failed to fetch player statistics", error.statusCode || 500);
  }
};


// const getPlayerAggregatedStats = async (playerId) => {
//   try {
//     const playerStatsDocs = await PlayerStatistic.find({ playerId });

//     // Custom error if no documents are found for the player
//     if (!playerStatsDocs.length) {
//       throw new CustomError(`No statistics found for player ID: ${playerId}`, 404);
//     }

//     // Initialize an object to hold the aggregated stats per season
//     const seasonStats = {};

//     // Loop through each player's stats document
//     playerStatsDocs.forEach((doc) => {
//       // Loop through each entry in the statistics array
//       doc.statistics.forEach((stat) => {
//         const season = stat.league?.season; // Get the season for this entry
//         if (!season) return; // Skip if no season is provided

//         if (!seasonStats[season]) {
//           seasonStats[season] = {
//             playerId,
//             season,
//             totalLineups: 0,
//             totalGoals: 0,
//             totalAssists: 0,
//             totalMinutesPlayed: 0,
//             totalShots: 0,
//             totalPasses: 0,
//             totalYellowCards: 0,
//             totalRedCards: 0,
//             totalFoulsDrawn: 0,
//             totalFoulsCommitted: 0,
//             totalTackles: 0,
//             totalDuels: 0,
//             totalDuelsWon: 0,
//             totalDribblesAttempted: 0,
//             totalDribblesSuccess: 0,
//             totalPenaltiesScored: 0,
//             totalPenaltiesMissed: 0,
//           };
//         }

//         const games = stat.games;
//         if (!games) {
//           throw new CustomError(`Games data is missing for player ID: ${playerId} in season: ${season}`, 400);
//         }

//         // Aggregate data for this season
//         seasonStats[season].totalLineups += games.lineups || 0;
//         seasonStats[season].totalGoals += games.goals?.total || 0;
//         seasonStats[season].totalAssists += games.goals?.assists || 0;
//         seasonStats[season].totalMinutesPlayed += games.minutes || 0;
//         seasonStats[season].totalShots += games.shots?.total || 0;
//         seasonStats[season].totalPasses += games.passes?.total || 0;
//         seasonStats[season].totalYellowCards += games.cards?.yellow || 0;
//         seasonStats[season].totalRedCards += games.cards?.red || 0;
//         seasonStats[season].totalFoulsDrawn += games.fouls?.drawn || 0;
//         seasonStats[season].totalFoulsCommitted += games.fouls?.committed || 0;
//         seasonStats[season].totalTackles += games.tackles?.total || 0;
//         seasonStats[season].totalDuels += games.duels?.total || 0;
//         seasonStats[season].totalDuelsWon += games.duels?.won || 0;
//         seasonStats[season].totalDribblesAttempted += games.dribbles?.attempts || 0;
//         seasonStats[season].totalDribblesSuccess += games.dribbles?.success || 0;
//         seasonStats[season].totalPenaltiesScored += games.penalty?.scored || 0;
//         seasonStats[season].totalPenaltiesMissed += games.penalty?.missed || 0;
//       });
//     });

//     // Convert the stats object into an array and return
//     return Object.values(seasonStats);
//   } catch (error) {
//     console.error(error);
//     // Handle errors with your custom error handler
//     if (error instanceof CustomError) {
//       throw error; // Re-throw custom error
//     }
//     throw new CustomError(`Error retrieving season statistics: ${error.message}`, 500);
//   }
// };


const getPlayerStatsSummary = async (playerId, season) => {
  try {
    // Fetch player statistics for the given season
    const playerStats = await PlayerStatistic.findOne({ playerId, season });

    if (!playerStats) {
      throw new CustomError(`No statistics found for player ID: ${playerId} in season ${season}`, 404);
    }

    // Initialize summary object
    const statsSummary = {
      season,
      totalGoals: 0,
      totalFouls: 0,
      totalPasses: 0,
      totalMatchesPlayed: 0,
      totalMinutesPlayed: 0,
    };

    // Aggregate stats from all records for the season
    for (const stat of playerStats.statistics) {
      statsSummary.totalGoals += stat.goals?.total || 0;
      statsSummary.totalFouls += stat.fouls?.committed || 0;
      statsSummary.totalPasses += stat.passes?.total || 0;
      statsSummary.totalMatchesPlayed += stat.games?.lineups || 0;
      statsSummary.totalMinutesPlayed += stat.games?.minutes || 0;
    }

    return statsSummary;
  } catch (error) {
    console.error("Error fetching player stats summary:", error);
    throw new CustomError(error.message || "Failed to fetch player stats summary", error.statusCode || 500);
  }
};


module.exports = {
  fetchPlayerStatisticsByPlayerId,
  savePlayerStatistics,
  fetchAndSaveAllPlayerStatistics,
  getPlayerAggregatedStats,
  getPlayerStatsSummary
};
