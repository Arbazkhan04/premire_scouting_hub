const axios = require("axios");
const CustomError = require("../../utils/customError");
const AIPrediction = require("../models/AIPredictions.model");
const Fixture = require("../models/fixtures.model");
const responseFormat = require("../../utils/soccerPredictionResponseFormat");
const { runPipeline } = require("../../AI-Assistant/soccerPredictions.service");
const calculateNextUpdateDelay = require("../../utils/calculateNextAIPredictionUpdateDelayforSoccer");
const {
  scheduleRecurringJob,
  deleteAndScheduleUniqueRecurringJob,
  soccerQueue,
} = require("../../jobs/jobQueue");
const SocketService = require("../../sockets/socket");
const { removeRecurringJob } = require("../../jobs/jobManager");

/**
 * Get AI prediction for a fixture and save it to the database.
 * @param {number} fixtureId - The fixture ID for which prediction is needed.
 * @returns {Promise<Object>} - The saved AI prediction document.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAndSaveSingleFixtureAIPrediction = async (fixtureId) => {
  try {
    // Step 1: Get AI prediction
    const predictionData = await getAIPrediction(fixtureId);

    // Step 2: Save the AI prediction to the database
    const savedPrediction = await SaveSingleFixtureAIPrediction(
      fixtureId,
      predictionData
    );

    return savedPrediction;
  } catch (error) {
    console.error("Error in getAndSaveFixtureAIPrediction:", error.message);
    throw new CustomError("Failed to get and save AI prediction", 500);
  }
};

/**
 * Get AI predictions for multiple fixtures and save them in bulk.
 * @param {number[]} fixtureIds - Array of fixture IDs for prediction.
 * @returns {Promise<Object[]>} - Array of saved AI prediction documents.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAndSaveFixtureAIPrediction = async (fixtureIds) => {
  try {
    if (!Array.isArray(fixtureIds) || fixtureIds.length === 0) {
      throw new CustomError("At least one fixture ID is required", 400);
    }

    console.log(`📌 Fetching predictions for ${fixtureIds.length} fixtures...`);

    // Split fixtureIds into chunks of 40 to respect the LLM rate limit (40/min)
    const chunkSize = 40;
    const fixtureChunks = [];
    for (let i = 0; i < fixtureIds.length; i += chunkSize) {
      fixtureChunks.push(fixtureIds.slice(i, i + chunkSize));
    }

    const allPredictions = [];

    for (const chunk of fixtureChunks) {
      // Fetch predictions concurrently for the current chunk
      const predictions = await Promise.all(
        chunk.map((fixtureId) => getAIPrediction(fixtureId))
      );
      allPredictions.push(...predictions);

      // Wait for 60 seconds if more chunks remain (rate-limiting)
      if (fixtureChunks.length > 1) {
        console.log(`⏳ Waiting to respect LLM rate limit...`);
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute
      }
    }

    console.log("✅ Predictions fetched successfully.");

    // Bulk save all predictions in one MongoDB operation
    const savedPredictions = await fetchAndSaveAIPrediction(allPredictions);

    return savedPredictions;
  } catch (error) {
    console.error("❌ Error in getAndSaveFixtureAIPrediction:", error.message);
    throw new CustomError("Failed to get and save AI predictions", 500);
  }
};

/**
 * Generate AI prediction for a fixture usin perplexity llm
 * @param {number} fixtureId - The fixture ID for which prediction is needed.
 * @returns {Promise<Object>} - The saved AI prediction document.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAIPrediction = async (fixtureId) => {
  try {
    //get the fixture from db
    const fixture = await Fixture.findOne({ fixtureId });
    if (!fixture) {
      throw new CustomError("Fixture not found", 404);
    }
    // input for the AI Model
    const input = {
      responseFormatt: `${JSON.stringify(responseFormat)}`,
      input: `${fixture.teams.home.name} vs ${fixture.teams.away.name} on ${fixture.date},${fixture.league.name} season ${fixture.league.season}`,
    };

    //run the pipeline
    const predictionDatas = await runPipeline(input);
  
    const predictionData=JSON.parse(predictionDatas)


    console.log(JSON.stringify(predictionData, null, 2));

    //prepare prediction data
    const formattedPrediction = {
      fixtureId: fixture.fixtureId,
      match: {
        homeTeam: { id: fixture.teams.home.id, name: fixture.teams.home.name },
        awayTeam: { id: fixture.teams.away.id, name: fixture.teams.away.name },
        date: fixture.date,
        league: { id: fixture.league.id, name: fixture.league?.name },
      },
      predictions: {
        matchOutcome: {
          win: {
            home: predictionData.predictions.matchOutcome.win.home,
            away: predictionData.predictions.matchOutcome.win.away,
            draw: predictionData.predictions.matchOutcome.win.draw,
          },
          correctScore: {
            home: predictionData.predictions.matchOutcome.correctScore.home,
            away: predictionData.predictions.matchOutcome.correctScore.away,
          },
          halftimeFulltime: {
            halftime:
              predictionData.predictions.matchOutcome.halftimeFulltime.halftime,
            fulltime:
              predictionData.predictions.matchOutcome.halftimeFulltime.fulltime,
          },
          firstToScore: predictionData.predictions.matchOutcome.firstToScore,
          lastToScore: predictionData.predictions.matchOutcome.lastToScore,
          marginOfVictory:
            predictionData.predictions.matchOutcome.marginOfVictory,
        },
        playerPerformance: predictionData.predictions.playerPerformance.map(
          (player) => ({
            player: {
              id: player.player.id,
              name: player.player.name,
              team: player.player.team,
            },
            goals: {
              anytime: player.goals.anytime,
              first: player.goals.first,
              last: player.goals.last,
            },
            assists: player.assists,
            shots: {
              total: player.shots.total,
              onTarget: player.shots.onTarget,
            },
            cards: {
              yellow: player.cards.yellow,
              red: player.cards.red,
            },
            manOfTheMatch: player.manOfTheMatch,
          })
        ),
        teamPerformance: {
          totalGoalsOverUnder: {
            threshold:
              predictionData.predictions.teamPerformance.totalGoalsOverUnder
                .threshold,
            over: predictionData.predictions.teamPerformance.totalGoalsOverUnder
              .over,
          },
          cleanSheet: {
            home: predictionData.predictions.teamPerformance.cleanSheet.home,
            away: predictionData.predictions.teamPerformance.cleanSheet.away,
          },
          bothTeamsToScore:
            predictionData.predictions.teamPerformance.bothTeamsToScore,
          totalCorners: predictionData.predictions.teamPerformance.totalCorners,
          totalFouls: {
            home: predictionData.predictions.teamPerformance.totalFouls.home,
            away: predictionData.predictions.teamPerformance.totalFouls.away,
          },
        },
        bettingOdds: {
          bestValueBets: predictionData.predictions.bettingOdds.bestValueBets,
          safeBets: predictionData.predictions.bettingOdds.safeBets,
          highRiskBets: predictionData.predictions.bettingOdds.highRiskBets,
          arbitrageOpportunities:
            predictionData.predictions.bettingOdds.arbitrageOpportunities,
          liveBettingSuggestions:
            predictionData.predictions.bettingOdds.liveBettingSuggestions,
        },
        gameSpecific: {
          penaltyAwarded:
            predictionData.predictions.gameSpecific.penaltyAwarded,
          penaltyConverted:
            predictionData.predictions.gameSpecific.penaltyConverted,
          substitutionImpact:
            predictionData.predictions.gameSpecific.substitutionImpact,
          injuryTimeGoalsProbability:
            predictionData.predictions.gameSpecific.injuryTimeGoalsProbability,
        },
        streakAndForm: {
          teamWinningStreak: {
            home: predictionData.predictions.streakAndForm.teamWinningStreak
              .home,
            away: predictionData.predictions.streakAndForm.teamWinningStreak
              .away,
          },
          headToHeadComparison:
            predictionData.predictions.streakAndForm.headToHeadComparison,
          homeAwayPerformance: {
            home: predictionData.predictions.streakAndForm.homeAwayPerformance
              .home,
            away: predictionData.predictions.streakAndForm.homeAwayPerformance
              .away,
          },
        },
        weatherInfluence: {
          temperature: predictionData.predictions.weatherInfluence.temperature,
          condition: predictionData.predictions.weatherInfluence.condition,
          impactOnGame:
            predictionData.predictions.weatherInfluence.impactOnGame,
        },
      },
    };

    console.log(
      "formattedPrediction",
      JSON.stringify(formattedPrediction, null, 2)
    );

    return formattedPrediction;
  } catch (error) {
    console.error("Error getting AI prediction:", error.message);
    throw new CustomError("Failed to save AI prediction", 500);
  }
};

/**
 * Bulk save AI predictions to MongoDB.
 * @param {Array} predictions - Array of AI prediction documents.
 * @returns {Promise<Array>} - Saved predictions.
 * @throws {CustomError} - Throws error if saving fails.
 */
const fetchAndSaveAIPrediction = async (predictions) => {
  if (!Array.isArray(predictions) || predictions.length === 0) {
    throw new CustomError("No predictions provided for bulk save", 400);
  }

  try {
    // Prepare bulk operations
    const bulkOps = predictions.map((prediction) => ({
      updateOne: {
        filter: { fixtureId: prediction.fixtureId },
        update: { $set: prediction },
        upsert: true,
      },
    }));

    // Perform bulk update
    const result = await AIPrediction.bulkWrite(bulkOps);

    console.log(
      `✅ Bulk save successful: ${result.modifiedCount} updated, ${result.upsertedCount} inserted.`
    );

    return result;
  } catch (error) {
    console.error("❌ Error in fetchAndSaveAIPredictionsBulk:", error.message);
    throw new CustomError("Failed to save AI predictions in bulk", 500);
  }
};

/**
 * Fetch AI prediction data from API and save it to the database.
 * @param {number} fixtureId - Fixture ID for the match prediction.
 * @param {object} predictionData - AI prediction details.
 * @returns {Promise<Object>} - The saved AI prediction document.
 * @throws {CustomError} - Throws error if request fails.
 */
const SaveSingleFixtureAIPrediction = async (fixtureId, predictionData) => {
  if (!fixtureId) {
    throw new CustomError("Fixture ID is required", 400);
  }

  try {
    const savedPrediction = await AIPrediction.findOneAndUpdate(
      { fixtureId },
      { $set: predictionData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return savedPrediction;
  } catch (error) {
    console.error("Error saving AI prediction:", error.message);
    throw new CustomError("Failed to save AI prediction", 500);
  }
};

/**
 * Get AI prediction by fixture ID.
 * @param {number} fixtureId - Fixture ID to fetch the prediction.
 * @returns {Promise<Object>} - The AI prediction document.
 */
const getAIPredictionByFixtureId = async (fixtureId) => {
  try {
    const prediction = await AIPrediction.findOne({ fixtureId });
    if (!prediction) {
      throw new CustomError("No prediction found for this fixture", 404);
    }
    return prediction;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

/**
 * Get all AI predictions.
 * @returns {Promise<Array>} - Array of AI predictions.
 */
const getAllAIPredictions = async () => {
  try {
    return await AIPrediction.find({});
  } catch (error) {
    throw new CustomError("Failed to fetch AI predictions", 500);
  }
};

/**
 * Update AI prediction by fixture ID.
 * @param {number} fixtureId - Fixture ID to update the prediction.
 * @param {object} updateData - Data to update.
 * @returns {Promise<Object>} - Updated AI prediction document.
 */
const updateAIPrediction = async (fixtureId, updateData) => {
  try {
    const updatedPrediction = await AIPrediction.findOneAndUpdate(
      { fixtureId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedPrediction) {
      throw new CustomError("No prediction found to update", 404);
    }
    return updatedPrediction;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

/**
 * Delete AI prediction by fixture ID.
 * @param {number} fixtureId - Fixture ID to delete the prediction.
 * @returns {Promise<Object>} - Deleted AI prediction document.
 */
const deleteAIPrediction = async (fixtureId) => {
  try {
    const deletedPrediction = await AIPrediction.findOneAndDelete({
      fixtureId,
    });
    if (!deletedPrediction) {
      throw new CustomError("No prediction found to delete", 404);
    }
    return deletedPrediction;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

/**
 * Get all upcoming fixture predictions where fixture date is greater than today.
 * @returns {Promise<Array>} - Array of upcoming AI predictions.
 * @throws {CustomError} - Throws error if fetching fails.
 */
const getAllUpcomingFixturesPredictions = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to 00:00:00
    // Fetch predictions where fixture date is greater than today
    const upcomingPredictions = await AIPrediction.find({
      "match.date": { $gte: today },
    });

    return upcomingPredictions;
  } catch (error) {
    console.error(
      "Error fetching upcoming fixture predictions:",
      error.message
    );
    throw new CustomError("Failed to fetch upcoming fixture predictions", 500);
  }
};

/**
 * Process AI predictions for upcoming fixtures by filtering unsaved and valid fixtures.
 * @param {Array<{fixtureId: number, startTime: Date}>} fixtureIdswithStartDate - Array of fixture IDs with start datetime.
 * @returns {Promise<Object[]>} - Saved AI prediction documents.
 * @throws {CustomError} - Throws error if processing or saving fails.
 */
const processAIPredictionsForUpcomingFixtures = async (
  fixtureIdswithStartDate
) => {
  try {
    if (
      !Array.isArray(fixtureIdswithStartDate) ||
      fixtureIdswithStartDate.length === 0
    ) {
      throw new CustomError("Fixture IDs array cannot be empty", 400);
    }

    console.log(`📊 Processing ${fixtureIdswithStartDate.length} fixtures...`);

    // Step 1: Get all AI predictions from the database
    const savedPredictions = await getAllUpcomingFixturesPredictions();

    // Step 2: Extract fixture IDs that already have predictions
    const savedFixtureIds = new Set(
      savedPredictions.map((prediction) => prediction.fixtureId)
    );

    // Step 3: Filter valid fixtures (not already saved + start time <= 10 days)
    const now = new Date();
    const tenDaysLater = new Date();
    tenDaysLater.setDate(now.getDate() + 10);

    const validFixtures = fixtureIdswithStartDate.filter(
      (fixture) =>
        !savedFixtureIds.has(fixture.fixtureId) &&
        new Date(fixture.startTime) <= tenDaysLater
    );

    console.log(`✅ Valid fixtures for prediction: ${validFixtures.length}`);

    // Step 4: If no valid fixtures, exit early
    if (validFixtures.length === 0) {
      console.log("🚫 No new AI predictions required.");
      return [];
    }

    // Step 5: Extract fixture IDs to process
    const fixtureIdsToProcess = validFixtures.map(
      (fixture) => fixture.fixtureId
    );

    // Step 6: Fetch and save predictions for valid fixtures
    //one by one save kry aur hr fixture k liay delayed job set kro agar already delayed job set hai to ignore kro
    const savedPredictionsResult = await getAndSaveFixtureAIandAddDelayedJob(
      fixtureIdsToProcess
    );

    const response = {
      success: true,
      message: "Upcoming fixtures processed successfully",
      data: savedPredictionsResult,
    };

    //emit event to all the
    SocketService.emitToAll(
      "SoccerUpcomingFixturesAIPredictions",
      response,
      (ack) => {
        console.log("📤 Acknowledgment received from clients:", ack);
      }
    );

    console.log(
      `✅ AI predictions processed for ${savedPredictionsResult.length} fixtures.`
    );
    return savedPredictionsResult;
  } catch (error) {
    console.error(
      "❌ Error in processAIPredictionsForUpcomingFixtures:",
      error.message
    );
    throw new CustomError(
      "Failed to process AI predictions for upcoming fixtures",
      500
    );
  }
};
/**
 * Get AI predictions for multiple fixtures, save them, and schedule delayed jobs.
 * @param {number[]} fixtureIds - Array of fixture IDs for which predictions are needed.
 * @returns {Promise<Object[]>} - Array of saved AI prediction documents.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAndSaveFixtureAIandAddDelayedJob = async (fixtureIds) => {
  try {
    if (!Array.isArray(fixtureIds) || fixtureIds.length === 0) {
      throw new CustomError("Fixture IDs array cannot be empty", 400);
    }

    const savedPredictions = [];

    // Loop over all fixture IDs and get/save predictions one by one
    for (const fixtureId of fixtureIds) {
      // Get the prediction and save it
      const savedPrediction = await getAndSaveSingleFixtureAIPrediction(
        fixtureId
      );
      savedPredictions.push(savedPrediction);

      // Calculate delay for the next update
      const getDelayTime = calculateNextUpdateDelay(savedPrediction.match.date);

      if (getDelayTime) {
        console.log(`⏳ Adding delayed job for fixture ID: ${fixtureId}`);

        // Schedule unique recurring job (delete existing if present)
        await deleteAndScheduleUniqueRecurringJob(
          soccerQueue,
          `fixturePrediction-${fixtureId}`, // Unique job name for each fixture
          {},
          getDelayTime
        );
      }

      console.log(
        `✅ AI prediction saved and delayed job added for fixture ID: ${fixtureId}`
      );
    }

    return savedPredictions; // Return the array of saved predictions
  } catch (error) {
    console.error(
      "❌ Error in getAndSaveFixtureAIandAddDelayedJob:",
      error.message
    );
    throw new CustomError("Failed to get and save AI predictions", 500);
  }
};
/**
 * Handles the AI Prediction job for a specific fixture.
 * 1. Checks if the fixture exists and is valid.
 * 2. Updates AI predictions and schedules the next update if applicable.
 * 3. Removes outdated jobs.
 * 4. Emits the updated AI predictions to all connected clients.
 *
 * @param {number} fixtureId - The fixture ID to process.
 * @throws {CustomError} - Throws error if the process fails.
 */
const AIPredictionJobHandler = async (fixtureId) => {
  try {
    // 1. Fetch the AI prediction for the fixture
    const fixture = await AIPrediction.findOne({ fixtureId });

    // If fixture does not exist, remove its recurring job and exit
    if (!fixture) {
      console.log(
        `🗑️ Fixture not found. Removing job for fixture ID: ${fixtureId}`
      );
      await removeRecurringJob(
        soccerQueue,
        `fixturePrediction-${fixtureId}-scheduler`
      );
      return;
    }

    // 2. Check if the fixture date is outdated
    const currentDate = new Date(); // Get current date
    const fixtureDate = new Date(fixture.match.date); // Convert stored date to Date object

    if (fixtureDate < currentDate) {
      console.log(`📅 Fixture ID: ${fixtureId} is outdated. Removing job.`);
      await removeRecurringJob(
        soccerQueue,
        `fixturePrediction-${fixtureId}-scheduler`
      );
      return;
    }

    // 3. Update the fixture AI prediction
    console.log(`🔄 Updating AI prediction for fixture ID: ${fixtureId}`);
    const savedPrediction = await getAndSaveSingleFixtureAIPrediction(
      fixtureId
    );

    // 4. Calculate delay for the next update
    const getDelayTime = calculateNextUpdateDelay(savedPrediction.match.date);

    if (getDelayTime) {
      console.log(`⏳ Adding delayed job for fixture ID: ${fixtureId}`);
      await deleteAndScheduleUniqueRecurringJob(
        soccerQueue,
        `fixturePrediction-${fixtureId}`, // Unique job name for each fixture
        { fixtureId }, // Pass fixtureId to the job payload
        getDelayTime
      );
    }

    // 5. Fetch the latest upcoming fixture AI predictions
    const allUpcomingFixturesPredictions =
      await getAllUpcomingFixturesPredictions();

    // 6. Emit the updated predictions to all connected clients
    const response = {
      success: true,
      message: "Upcoming fixture predictions updated successfully",
      data: allUpcomingFixturesPredictions,
    };

    SocketService.emitToAll(
      "SoccerUpcomingFixturesAIPredictions",
      response,
      (ack) => {
        console.log("📤 Acknowledgment received from clients:", ack);
      }
    );
  } catch (error) {
    console.error("❌ Error in AIPredictionJobHandler:", error.message);
    throw new CustomError(
      `Error in AIPredictionJobHandler: ${error.message}`,
      500
    );
  }
};

module.exports = {
  fetchAndSaveAIPrediction,
  getAIPredictionByFixtureId,
  getAllAIPredictions,
  updateAIPrediction,
  deleteAIPrediction,
  getAIPrediction,
  getAndSaveFixtureAIPrediction,
  getAllUpcomingFixturesPredictions,
  processAIPredictionsForUpcomingFixtures,
  AIPredictionJobHandler,
};
