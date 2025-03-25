const axios = require("axios");
const CustomError = require("../../utils/customError");
const AIPrediction = require("../models/AIPredictions.model");
const Fixture = require("../models/fixtures.model");
const responseFormat = require("../../utils/soccerPredictionResponseFormat");
const { runPipeline } = require("../../AI-Assistant/soccerPredictions.service");




/**
 * Get AI prediction for a fixture and save it to the database.
 * @param {number} fixtureId - The fixture ID for which prediction is needed.
 * @returns {Promise<Object>} - The saved AI prediction document.
 * @throws {CustomError} - Throws error if fetching or saving fails.
 */
const getAndSaveFixtureAIPrediction = async (fixtureId) => {
    try {
      // Step 1: Get AI prediction
      const predictionData = await getAIPrediction(fixtureId);
  
      // Step 2: Save the AI prediction to the database
      const savedPrediction = await fetchAndSaveAIPrediction(fixtureId, predictionData);
  
      return savedPrediction;
    } catch (error) {
      console.error("Error in getAndSaveFixtureAIPrediction:", error.message);
      throw new CustomError("Failed to get and save AI prediction", 500);
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
    const predictionData = await runPipeline(input);
    // console.log(predictionData);
    console.log(JSON.stringify(predictionData, null, 2));


    //prepare prediction data
    const formattedPrediction = {
      fixtureId:fixture.fixtureId,
      match: {
        homeTeam: {id:fixture.teams.home.id,name:fixture.teams.home.name},
        awayTeam: {id:fixture.teams.away.id,name:fixture.teams.away.name},
        date: fixture.date,
        league: {id:fixture.league.id,name:fixture.league?.name},
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
                halftime: predictionData.predictions.matchOutcome.halftimeFulltime.halftime,
                fulltime: predictionData.predictions.matchOutcome.halftimeFulltime.fulltime,
                },
                firstToScore: predictionData.predictions.matchOutcome.firstToScore,
                lastToScore: predictionData.predictions.matchOutcome.lastToScore,
                marginOfVictory: predictionData.predictions.matchOutcome.marginOfVictory,
            },
            playerPerformance: predictionData.predictions.playerPerformance.map((player) => ({
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
            })),
            teamPerformance: {
                totalGoalsOverUnder: {
                threshold: predictionData.predictions.teamPerformance.totalGoalsOverUnder.threshold,
                over: predictionData.predictions.teamPerformance.totalGoalsOverUnder.over,
                },
                cleanSheet: {
                home: predictionData.predictions.teamPerformance.cleanSheet.home,
                away: predictionData.predictions.teamPerformance.cleanSheet.away,
                },
                bothTeamsToScore: predictionData.predictions.teamPerformance.bothTeamsToScore,
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
                arbitrageOpportunities: predictionData.predictions.bettingOdds.arbitrageOpportunities,
                liveBettingSuggestions: predictionData.predictions.bettingOdds.liveBettingSuggestions,
            },
            gameSpecific: {
                penaltyAwarded: predictionData.predictions.gameSpecific.penaltyAwarded,
                penaltyConverted: predictionData.predictions.gameSpecific.penaltyConverted,
                substitutionImpact: predictionData.predictions.gameSpecific.substitutionImpact,
                injuryTimeGoalsProbability: predictionData.predictions.gameSpecific.injuryTimeGoalsProbability,
            },
            streakAndForm: {
                teamWinningStreak: {
                home: predictionData.predictions.streakAndForm.teamWinningStreak.home,
                away: predictionData.predictions.streakAndForm.teamWinningStreak.away,
                },
                headToHeadComparison: predictionData.predictions.streakAndForm.headToHeadComparison,
                homeAwayPerformance: {
                home: predictionData.predictions.streakAndForm.homeAwayPerformance.home,
                away: predictionData.predictions.streakAndForm.homeAwayPerformance.away,
                },
            },
            weatherInfluence: {
                temperature: predictionData.predictions.weatherInfluence.temperature,
                condition: predictionData.predictions.weatherInfluence.condition,
                impactOnGame: predictionData.predictions.weatherInfluence.impactOnGame,
            }
        }
    };

    console.log("formattedPrediction",JSON.stringify(formattedPrediction, null, 2));

    return formattedPrediction;
  } catch (error) {
    console.error("Error getting AI prediction:", error.message);
    throw new CustomError("Failed to save AI prediction", 500);
  }
};

/**
 * Fetch AI prediction data from API and save it to the database.
 * @param {number} fixtureId - Fixture ID for the match prediction.
 * @param {object} predictionData - AI prediction details.
 * @returns {Promise<Object>} - The saved AI prediction document.
 * @throws {CustomError} - Throws error if request fails.
 */
const fetchAndSaveAIPrediction = async (fixtureId, predictionData) => {
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

module.exports = {
  fetchAndSaveAIPrediction,
  getAIPredictionByFixtureId,
  getAllAIPredictions,
  updateAIPrediction,
  deleteAIPrediction,
  getAIPrediction,
  getAndSaveFixtureAIPrediction
};
