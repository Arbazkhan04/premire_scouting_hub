const axios = require("axios");
const CustomError = require("../../utils/customError");
const AmericanFootballPrediction = require("../models/AIPrediction.model");
const Game = require("../models/game.model");
const responseFormat = require("../../utils/americanFootballPredictionResponseFormat");
const { runPipeline } = require("../../AI-Assistant/americanFootballPredictions.service");
const calculateNextUpdateDelay = require("../../utils/calculateNextAIPredictionUpdateDelayforSoccer");
const { scheduleRecurringJob, deleteAndScheduleUniqueRecurringJob } = require("../../jobs/jobQueue");
const SocketService = require("../../sockets/socket");
const { removeRecurringJob } = require("../../jobs/jobManager");

/**
 * Get AI prediction for a single American football game and save it to the database.
 * @param {number} gameId - The game ID for which prediction is needed.
 * @returns {Promise<Object>} - The saved AI prediction document.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAndSaveSingleGameAIPrediction = async (gameId) => {
  try {
    // Step 1: Get AI prediction
    const predictionData = await getAIPrediction(gameId);

    // Step 2: Save AI prediction to the database
    const savedPrediction =await fetchAndSaveAIPredictions([predictionData]);
    // const savedPrediction = await saveSingleGameAIPrediction(gameId, predictionData);

    return savedPrediction;
  } catch (error) {
    console.error("❌ Error in getAndSaveSingleGameAIPrediction:", error.message);
    throw new CustomError("Failed to get and save AI prediction", 500);
  }
};

/**
 * Get AI predictions for multiple American football games and save them in bulk.
 * @param {number[]} gameIds - Array of game IDs for prediction.
 * @returns {Promise<Object[]>} - Array of saved AI prediction documents.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAndSaveGameAIPredictions = async (gameIds) => {
  try {
    if (!Array.isArray(gameIds) || gameIds.length === 0) {
      throw new CustomError("At least one game ID is required", 400);
    }

    console.log(`📌 Fetching predictions for ${gameIds.length} games...`);

    // Split gameIds into chunks of 40 (rate limit 40/min)
    const chunkSize = 40;
    const gameChunks = [];
    for (let i = 0; i < gameIds.length; i += chunkSize) {
      gameChunks.push(gameIds.slice(i, i + chunkSize));
    }

    const allPredictions = [];

    for (const chunk of gameChunks) {
      // Fetch predictions concurrently for the current chunk
      const predictions = await Promise.all(chunk.map((gameId) => getAIPrediction(gameId)));
      allPredictions.push(...predictions);

      // Wait for 60 seconds if more chunks remain (rate-limiting)
      if (gameChunks.length > 1) {
        console.log(`⏳ Waiting to respect LLM rate limit...`);
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute
      }
    }

    console.log("✅ Predictions fetched successfully.");

    // Bulk save all predictions in one MongoDB operation
    const savedPredictions = await fetchAndSaveAIPredictions(allPredictions);

    return savedPredictions;
  } catch (error) {
    console.error("❌ Error in getAndSaveGameAIPredictions:", error.message);
    throw new CustomError("Failed to get and save AI predictions", 500);
  }
};

/**
 * Generate AI prediction for an American football game.
 * @param {number} gameId - The game ID for which prediction is needed.
 * @returns {Promise<Object>} - The formatted AI prediction document.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAIPrediction = async (gameId) => {
  try {
    // Get the game from the database
    const game = await Game.findOne({ gameId });
    if (!game) {
      throw new CustomError("Game not found", 404);
    }

    // Input for the AI Model
    const input = {
      responseFormat: `${JSON.stringify(responseFormat)}`,
      input: `${game.teams.home.name} vs ${game.teams.away.name} on ${game.date}, ${game.league.name} season ${game.league.season}`,
    };

    // Run the AI pipeline
    const predictionData = await runPipeline(input);
    console.log(JSON.stringify(predictionData, null, 2));

    // Prepare formatted prediction data
    // const formattedPrediction = {
    //   gameId: game.gameId,
    //   match: {
    //     homeTeam: { id: game.teams.home.id, name: game.teams.home.name },
    //     awayTeam: { id: game.teams.away.id, name: game.teams.away.name },
    //     date: game.date.date,
    //     league: { id: game.league.id, name: game.league.name },
    //   },
    //   predictions: {
    //     matchOutcome: {
    //       win: {
    //         home: predictionData.predictions.matchOutcome.win.home,
    //         away: predictionData.predictions.matchOutcome.win.away,
    //       },
    //       correctScore: {
    //         home: predictionData.predictions.matchOutcome.correctScore.home,
    //         away: predictionData.predictions.matchOutcome.correctScore.away,
    //       },
    //       halftimeFulltime: {
    //         halftime: predictionData.predictions.matchOutcome.halftimeFulltime.halftime,
    //         fulltime: predictionData.predictions.matchOutcome.halftimeFulltime.fulltime,
    //       },
    //       firstToScore: predictionData.predictions.matchOutcome.firstToScore,
    //       marginOfVictory: predictionData.predictions.matchOutcome.marginOfVictory,
    //       spreadBetting: predictionData.predictions.matchOutcome.spreadBetting,
    //       overUnderTotalPoints: predictionData.predictions.matchOutcome.overUnderTotalPoints,
    //     },
    //     playerPerformance: predictionData.predictions.playerPerformance.map((player) => ({
    //       player: {
    //         id: player.player.id,
    //         name: player.player.name,
    //         team: player.player.team,
    //         position: player.player.position,
    //       },
    //       stats: player.stats,
    //     })),
    //     teamPerformance: predictionData.predictions.teamPerformance,
    //   },
    // };



    const formattedPrediction = {
      gameId: game.gameId,
      match: {
        homeTeam: { id: game.teams.home.id, name: game.teams.home.name },
        awayTeam: { id: game.teams.away.id, name: game.teams.away.name },
        date: game.date.date,
        league: { id: game.league.id, name: game.league.name },
      },
      predictions: {
        matchOutcome: {
          win: {
            home: predictionData.predictions.matchOutcome.win.home,
            away: predictionData.predictions.matchOutcome.win.away,
          },
          correctScore: {
            home: predictionData.predictions.matchOutcome.correctScore.home,
            away: predictionData.predictions.matchOutcome.correctScore.away,
          },
          halftimeFulltime: {
            halftime: predictionData.predictions.matchOutcome.halftimeFulltime.halftime,
            fulltime: predictionData.predictions.matchOutcome.halftimeFulltime.fulltime,
          },
          firstToScore: predictionData.predictions.matchOutcome.firstToScore,
          marginOfVictory: predictionData.predictions.matchOutcome.marginOfVictory,
          spreadBetting: predictionData.predictions.matchOutcome.spreadBetting,
          overUnderTotalPoints: predictionData.predictions.matchOutcome.overUnderTotalPoints,
        },
        playerPerformance: predictionData.predictions.playerPerformance.map((player) => ({
          player: {
            id: player.player.id,
            name: player.player.name,
            team: player.player.team,
            position: player.player.position,
          },
          stats: player.stats,
        })),
        teamPerformance: predictionData.predictions.teamPerformance,
        bettingOdds: {
          bestValueBets: predictionData.predictions.bettingOdds.bestValueBets,
          safeBets: predictionData.predictions.bettingOdds.safeBets,
          highRiskBets: predictionData.predictions.bettingOdds.highRiskBets,
          arbitrageOpportunities: predictionData.predictions.bettingOdds.arbitrageOpportunities,
          liveBettingSuggestions: predictionData.predictions.bettingOdds.liveBettingSuggestions,
        },
        gameSpecific: {
          penalties: predictionData.predictions.gameSpecific.penalties,
          challenges: {
            total: predictionData.predictions.gameSpecific.challenges.total,
            successful: predictionData.predictions.gameSpecific.challenges.successful,
          },
          fourthDownConversions: predictionData.predictions.gameSpecific.fourthDownConversions,
          successfulOnsideKicks: predictionData.predictions.gameSpecific.successfulOnsideKicks,
          injuryImpact: predictionData.predictions.gameSpecific.injuryImpact,
        },
        streakAndForm: {
          teamWinningStreak: {
            home: predictionData.predictions.streakAndForm.teamWinningStreak.home,
            away: predictionData.predictions.streakAndForm.teamWinningStreak.away,
          },
          headToHeadComparison: predictionData.predictions.streakAndForm.headToHeadComparison,
          homeAwayPerformance: predictionData.predictions.streakAndForm.homeAwayPerformance,
        },
        weatherInfluence: {
          temperature: predictionData.predictions.weatherInfluence.temperature,
          condition: predictionData.predictions.weatherInfluence.condition,
          impactOnGame: predictionData.predictions.weatherInfluence.impactOnGame,
        },
      },
    };
    

    console.log("✅ Formatted Prediction:", JSON.stringify(formattedPrediction, null, 2));

    return formattedPrediction;
  } catch (error) {
    console.error("❌ Error getting AI prediction:", error.message);
    throw new CustomError("Failed to save AI prediction", 500);
  }
};

/**
 * Bulk save AI predictions to MongoDB.
 * @param {Array} predictions - Array of AI prediction documents.
 * @returns {Promise<Array>} - Saved predictions.
 * @throws {CustomError} - Throws error if saving fails.
 */
const fetchAndSaveAIPredictions = async (predictions) => {
  if (!Array.isArray(predictions) || predictions.length === 0) {
    throw new CustomError("No predictions provided for bulk save", 400);
  }

  try {
    // Prepare bulk operations
    const bulkOps = predictions.map((prediction) => ({
      updateOne: {
        filter: { gameId: prediction.gameId },
        update: { $set: prediction },
        upsert: true,
      },
    }));

    // Perform bulk update
    const result = await AmericanFootballPrediction.bulkWrite(bulkOps);

    console.log(
      `✅ Bulk save successful: ${result.modifiedCount} updated, ${result.upsertedCount} inserted.`
    );

    return result;
  } catch (error) {
    console.error("❌ Error in fetchAndSaveAIPredictions:", error.message);
    throw new CustomError("Failed to save AI predictions in bulk", 500);
  }
};

module.exports = {
  getAndSaveSingleGameAIPrediction,
  getAndSaveGameAIPredictions,
};
