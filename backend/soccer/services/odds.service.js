const axios = require("axios");
const SoccerFixturesOdds = require("../models/odds.model");
const CustomError = require("../../utils/customError");
const { getAllUpcomingFixtures } = require("./fixtures.service");

/**
 * Fetch odds by fixtureId from the API
 * @param {number} fixtureId - The ID of the fixture
 * @returns {Promise<Object>} - Returns the fetched odds data
 */
const getOddsByFixtureId = async (fixtureId) => {
  try {
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/odds",
      params: { fixture: fixtureId },
      headers: {
        "x-rapidapi-key": process.env.SOCCER_API_KEY, // Store API Key in .env
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    
    if (!response.data || !response.data.response) {
      throw new CustomError("No odds data found", 404);
    }

    return response.data.response;
  } catch (error) {
    console.error("❌ Error fetching odds:", error.message);
    throw new CustomError(error.message || "Failed to fetch odds", 500);
  }
};

/**
 * Insert or update odds in the database
 * @param {Array<Object>} oddsArray - List of odds objects
 * @returns {Promise<Object>} - Returns bulk write result
 */
const insertOrUpdateOdds = async (oddsArray) => {
  try {
    if (!oddsArray || oddsArray.length === 0) {
      throw new CustomError("No odds data provided", 400);
    }

    // Use bulk operations for efficiency
    const bulkOperations = oddsArray.map((odds) => ({
      updateOne: {
        filter: { fixtureId: odds.fixture.id }, // Find by fixture ID
        update: {
          $set: {
            fixtureId: odds.fixture.id,
            league: odds.league,
            fixture: {
              timezone: odds.fixture.timezone,
              date: odds.fixture.date,
              timestamp: odds.fixture.timestamp,
            },
            update: odds.update,
            bookmakers: odds.bookmakers.map((bookmaker) => ({
              id: bookmaker.id,
              name: bookmaker.name,
              bets: bookmaker.bets.map((bet) => ({
                id: bet.id,
                name: bet.name,
                values: bet.values.map((value) => ({
                  value: value.value,
                  odd: value.odd,
                })),
              })),
            })),
          },
        },
        upsert: true, // Insert if not exists, update if exists
      },
    }));

    // Execute bulk write operation
    const result = await SoccerFixturesOdds.bulkWrite(bulkOperations);

    console.log("✅ Odds inserted/updated:", result);
    return result;
  } catch (error) {
    console.error("❌ Error inserting/updating odds:", error.message);
    throw new CustomError(error.message || "Failed to insert/update odds", 500);
  }
};


/**
 * Fetch odds for all upcoming fixtures and update the database.
 * 
 * This method performs the following steps:
 * 1. Retrieves all upcoming fixtures using `getAllUpcomingFixtures()`.
 * 2. Fetches odds for each fixture by calling `getOddsByFixtureId(fixtureId)`.
 * 3. Inserts or updates the fetched odds data using `insertOrUpdateOdds(oddsArray)`.
 * 4. Returns the updated odds for all upcoming fixtures.
 * 
 * If no upcoming fixtures are found, an empty array is returned.
 * If fetching odds for a fixture fails, the error is logged but does not stop the process.
 * 
 * @returns {Promise<Array>} - Returns an array of updated odds data for upcoming fixtures.
 * @throws {CustomError} - Throws an error if any critical operation fails.
 */
const fetchUpcomingFixtureOdds = async () => {
  try {
    console.log("🔄 Fetching upcoming fixtures...");
    
    // Step 1: Get all upcoming fixtures
    const upcomingFixtures = await getAllUpcomingFixtures();

    // If no upcoming fixtures are found, return an empty array
    if (!upcomingFixtures || upcomingFixtures.length === 0) {
      console.log("⚠️ No upcoming fixtures found.");
      return [];
    }

    console.log(`📊 Found ${upcomingFixtures.length} upcoming fixtures. Fetching odds...`);

    let allOdds = [];

    // Step 2: Fetch odds for each upcoming fixture
    for (const fixture of upcomingFixtures) {
      try {
        console.log(`⚽ Fetching odds for fixture ID: ${fixture.fixtureId}...`);

        // Fetch odds from API
        const oddsData = await getOddsByFixtureId(fixture.fixtureId);

        if (oddsData.length > 0) {
          allOdds.push(...oddsData);
        }

      } catch (error) {
        console.error(`❌ Failed to fetch odds for fixture ID ${fixture.fixtureId}:`, error.message);
      }
    }

    // Step 3: Insert or update odds in the database
    if (allOdds.length > 0) {
      console.log(`💾 Updating odds for ${allOdds.length} fixtures...`);
      await insertOrUpdateOdds(allOdds);
    } else {
      console.log("⚠️ No odds data available to update.");
    }

    // Step 4: Return the updated odds from the database
    console.log("✅ Returning updated odds for upcoming fixtures.");
    return allOdds;

  } catch (error) {
    console.error("❌ Error fetching upcoming fixture odds:", error.message);
    throw new CustomError(error.message || "Failed to fetch and update odds for upcoming fixtures", 500);
  }
};





/**
 * Process upcoming fixture odds, update them in the database, and emit the results to all connected clients.
 *
 * This method performs the following steps:
 * 1. Calls `fetchUpcomingFixtureOdds()` to fetch and update odds data for all upcoming fixtures.
 * 2. Emits the updated odds data using `SocketService.emitToAll()`.
 *
 * If no odds are found, an empty array is returned.
 * If emitting fails, an error is logged but does not stop the process.
 *
 * @throws {CustomError} - Throws an error if updating or emitting fails.
 */
const processUpcomingFixturesOddsAndEmit = async () => {
  try {
    console.log("🔄 Processing upcoming fixture odds...");

    // Step 1: Fetch and update odds for upcoming fixtures
    const updatedOdds = await fetchUpcomingFixtureOdds();

    if (!updatedOdds || updatedOdds.length === 0) {
      console.log("⚠️ No odds data available to emit.");
      return [];
    }

    console.log(`📢 Broadcasting odds for ${updatedOdds.length} fixtures to all clients...`);

    // Step 2: Emit the updated odds data using WebSockets
    const response = {
      success: true,
      message: "Upcoming fixture odds processed successfully",
      data: updatedOdds,
    };

    SocketService.emitToAll("soccerupcomingFixtureOdds", response, (ack) => {
      console.log("✅ Acknowledgment received from clients:", ack);
    });

    return updatedOdds;
  } catch (error) {
    console.error("❌ Error processing and emitting fixture odds:", error.message);
    throw new CustomError(error.message || "Failed to process and emit fixture odds", 500);
  }
};





/**
 * Fetch live in-play odds by fixture ID from the API.
 * @param {number} fixtureId - The ID of the fixture.
 * @returns {Promise<Object>} - Returns the fetched live odds data.
 */
const getInPlayOdds = async (fixtureId) => {
  try {
    console.log(`🔄 Fetching live in-play odds for fixture ID: ${fixtureId}...`);

    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/odds/live",
      params: { fixture: fixtureId },
      headers: {
        "x-rapidapi-key": process.env.SOCCER_API_KEY, // Secure API Key
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    if (!response.data || !response.data.response) {
      console.log(`⚠️ No live odds data found for fixture ID: ${fixtureId}`);
      return null;
    }

    console.log(`✅ Live in-play odds fetched successfully for fixture ID: ${fixtureId}`);
    return response.data.response;
  } catch (error) {
    console.error(`❌ Error fetching live in-play odds for fixture ID ${fixtureId}:`, error.message);
    throw new CustomError(error.message || "Failed to fetch live in-play odds", 500);
  }
};







module.exports = {
  getOddsByFixtureId,
  insertOrUpdateOdds,
  fetchUpcomingFixtureOdds,
  processUpcomingFixturesOddsAndEmit,
  getInPlayOdds
};



