const axios = require("axios");
const CustomError = require("../../utils/customError");
const AmericanFootballGameOdds = require("../models/odds.model");
const { getUpcomingGames } = require("./games.service");

const RAPID_API_KEY = process.env.AMERICAN_FOOTBALL_API_KEY;
const RAPID_API_HOST = "api-american-football.p.rapidapi.com";

/**
 * Fetch odds for a specific game from the API.
 * @param {number} gameId - The game ID.
 * @returns {Promise<Object>} - The odds data for the game.
 * @throws {CustomError} - Throws error if request fails.
 */
const fetchOddsForGame = async (gameId) => {
  if (!gameId) {
    throw new CustomError("Game ID is required", 400);
  }

  const options = {
    method: "GET",
    url: `https://${RAPID_API_HOST}/odds`,
    params: { game: gameId },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": RAPID_API_HOST,
    },
  };

  try {
    const response = await axios.request(options);

    if (!response.data || response.data.results === 0) {
      console.log(`⚠️ No odds found for game ID: ${gameId}`);
      return null;
    }

    return response.data.response;
  } catch (error) {
    console.error("❌ Error fetching odds from API:", error.message);
    throw new CustomError("Failed to fetch odds from API", 500);
  }
};

/**
 * Insert or update odds for multiple games in bulk.
 * @param {Array<Object>} oddsData - Array of odds data for games.
 * @returns {Promise<Array>} - Array of saved odds documents.
 * @throws {CustomError} - Throws error if database operation fails.
 */
const insertOrUpdateOdds = async (oddsData) => {
  try {
    if (!Array.isArray(oddsData) || oddsData.length === 0) {
      throw new CustomError("No valid odds data provided", 400);
    }

    const CHUNK_SIZE = 100;
    const promises = [];

    for (let i = 0; i < oddsData.length; i += CHUNK_SIZE) {
      const chunk = oddsData.slice(i, i + CHUNK_SIZE);
      const bulkOperations = chunk.map((odd) => ({
        updateOne: {
          filter: { gameId: odd.game.id }, // Find by Game ID
          update: {
            $set: {
              gameId: odd.game.id,
              league: odd.league,
              country: odd.country,
              update: new Date(),
              bookmakers: odd.bookmakers,
            },
          },
          upsert: true, // Insert if not exists, update if exists
        },
      }));

      // Execute bulk write operation in parallel
      promises.push(AmericanFootballGameOdds.bulkWrite(bulkOperations));
    }

    await Promise.all(promises);

    console.log(`✅ ${oddsData.length} Odds inserted/updated successfully`);
    return { success: true, updatedCount: oddsData.length };
  } catch (error) {
    console.error("❌ Error inserting/updating odds:", error.message);
    throw new CustomError("Failed to insert/update odds", 500);
  }
};

/**
 * Fetch and save odds for a list of upcoming game IDs.
 * @param {Array<number>} gameIds - List of game IDs.
 * @returns {Promise<Array>} - Array of saved odds documents.
 * @throws {CustomError} - Throws error if any step fails.
 */
const fetchAndSaveOdds = async (gameIds) => {
  try {
    if (!Array.isArray(gameIds) || gameIds.length === 0) {
      throw new CustomError("No game IDs provided", 400);
    }

    console.log(`🔄 Fetching odds for ${gameIds.length} upcoming games...`);

    // Fetch odds for all games in parallel
    const oddsPromises = gameIds.map((gameId) => fetchOddsForGame(gameId));
    const oddsResults = await Promise.allSettled(oddsPromises);

    // Extract successful results
    const validOddsData = oddsResults
      .filter((result) => result.status === "fulfilled" && result.value)
      .map((result) => result.value);

    if (validOddsData.length === 0) {
      console.log("⚠️ No valid odds data found.");
      return [];
    }

    // Save odds to the database
    const savedOdds = await insertOrUpdateOdds(validOddsData);
    console.log("✅ Odds fetched and saved successfully.");
    return savedOdds;
  } catch (error) {
    console.error("❌ Error fetching and saving odds:", error.message);
    throw new CustomError("Failed to fetch and save odds", 500);
  }
};

/**
 * Get odds for a specific game from the database.
 * @param {number} gameId - The game ID.
 * @returns {Promise<Object>} - The odds data for the game.
 * @throws {CustomError} - Throws error if no odds found or query fails.
 */
const getOddsByGameId = async (gameId) => {
  try {
    if (!gameId) {
      throw new CustomError("Game ID is required", 400);
    }

    console.log(`🔍 Fetching odds for game ID: ${gameId}`);

    // Fetch the odds from the database
    const odds = await AmericanFootballGameOdds.findOne({ gameId }).lean();

    if (!odds) {
      throw new CustomError(`No odds found for game ID: ${gameId}`, 404);
    }

    console.log("✅ Odds found:", odds);
    return odds;
  } catch (error) {
    console.error("❌ Error fetching odds by game ID:", error.message);
    throw new CustomError(
      error.message || "Failed to fetch odds by game ID",
      500
    );
  }
};

/**
 * Fetch odds for all upcoming games and return structured data grouped by league.
 * @returns {Promise<Object>} - Returns odds data grouped by league.
 * @throws {CustomError} - Throws error if any step fails.
 */
const getOddsofAllUpcomingGames = async () => {
  try {
    console.log("🔄 Fetching upcoming games...");

    // Step 1: Fetch all upcoming games
    const upcomingGamesResponse = await getUpcomingGames();

    // Log the fetched data
    console.log(
      "upcomingGamesResponse",
      JSON.stringify(upcomingGamesResponse, null, 2)
    );

    // Check if there are no leagues at all
    if (
      !Array.isArray(upcomingGamesResponse) ||
      upcomingGamesResponse.length === 0
    ) {
      console.log("⚠️ No upcoming games found. No odds will be fetched.");
      return { success: true, message: "No upcoming games found.", data: [] };
    }

    let allGameIds = [];
    let hasUpcomingGames = false; // Flag to check if there are any actual upcoming games

    // Extract game IDs from leagues that have upcoming games
    upcomingGamesResponse.forEach((league) => {
      if (league.upcomingGames && league.upcomingGames.length > 0) {
        hasUpcomingGames = true;
        const gameIds = league.upcomingGames.map((game) => game.gameId);
        allGameIds = allGameIds.concat(gameIds);
      }
    });

    // If no upcoming games were found, return early
    if (!hasUpcomingGames) {
      console.log("⚠️ No upcoming games exist. No odds will be fetched.");
      return {
        success: true,
        message: "No upcoming games available.",
        data: [],
      };
    }

    console.log(`📊 Fetching odds for ${allGameIds.length} games...`);

    // Step 2: Fetch odds for all upcoming games in parallel
    const oddsPromises = allGameIds.map((gameId) => fetchOddsForGame(gameId));
    const oddsResults = await Promise.allSettled(oddsPromises);

    // Extract successful results
    const validOddsData = oddsResults
      .filter((result) => result.status === "fulfilled" && result.value)
      .map((result) => result.value)
      .flat(); // Flatten to avoid nested arrays

    if (validOddsData.length === 0) {
      console.log("⚠️ No valid odds data found.");
      return { success: true, message: "No valid odds data found.", data: [] };
    }

    // Step 3: Save the odds data in the database
    const savedOdds = await insertOrUpdateOdds(validOddsData);
    console.log("✅ Odds fetched and saved successfully.");

    // Step 4: Organize the response by league
    let oddsByLeague = upcomingGamesResponse.map((league) => ({
      leagueName: league.leagueName,
      season: league.season,
      odds: validOddsData.filter((odd) =>
        league.upcomingGames.some((game) => game.gameId === odd.gameId)
      ),
    }));

    return {
      success: true,
      message: "Odds for upcoming games retrieved successfully.",
      data: oddsByLeague,
    };
  } catch (error) {
    console.error("❌ Error fetching odds for upcoming games:", error.message);
    throw new CustomError("Failed to fetch odds for upcoming games", 500);
  }
};

module.exports = {
  fetchOddsForGame,
  insertOrUpdateOdds,
  fetchAndSaveOdds,
  getOddsByGameId,
  getOddsofAllUpcomingGames,
};
