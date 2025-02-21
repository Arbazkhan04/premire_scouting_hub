const axios = require("axios");
const CustomError = require("../utils/CustomError");
const SoccerFixture= require("../models/fixtures.model")
const soccerLeagues = require("../../utils/soccerLeagues"); 

const RAPIDAPI_KEY = process.env.SOCCER_API_KEY ; // Secure API Key




/**
 * Fetch live games from API and return fixture IDs.
 * @param {string} leagueIds - Comma-separated league IDs (e.g., "39,15,253,2").
 * @returns {Promise<Array>} - Array of fixture IDs.
 * @throws {CustomError} - Throws error if request fails or no fixtures found.
 */
const getLiveGamesFixtureIds = async (leagueIds = "39-15-2-253") => {
  try {
    // API request options
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      params: {
        live: leagueIds, // Pass the league IDs
      },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY, 
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    // Fetch live games
    const response = await axios.request(options);

    // Check if response has valid data
    if (!response.data || response.data.results === 0) {
    //   throw new CustomError(
    //     "No live games found for the provided leagues",
    //     404
    //   );

      return []
    }

    // Extract fixture IDs
    const fixtureIds = response.data.response.map((game) => game.fixture.id);

    return fixtureIds;
  } catch (error) {
    console.error("Error fetching live games:", error.message);
    throw new CustomError(error.message || "Failed to fetch live games", 500);
  }
};



/**
 * Fetch fixture details for multiple fixture IDs in parallel.
 * @param {Array<number>} fixtureIds - List of fixture IDs.
 * @returns {Promise<Array>} - Array of fixture data.
 * @throws {CustomError} - Throws error if API call fails.
 */
const getFixtureDetails = async (fixtureIds) => {
  try {
    if (!fixtureIds || fixtureIds.length === 0) {
      throw new CustomError("No fixture IDs provided", 400);
    }

    // Create API requests for all fixture IDs
    const requests = fixtureIds.map((id) =>
      axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures", {
        params: { id },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        },
      })
    );

    // Execute all requests in parallel
    const responses = await Promise.all(requests);

    // Extract fixture data from responses
    const fixturesData = responses.map((response) => response.data.response[0]);

    return fixturesData;
  } catch (error) {
    console.error("Error fetching fixture details:", error.message);
    throw new CustomError(error.message || "Failed to fetch fixture details", 500);
  }
};








/**
 * Insert or update fixtures in the database.
 * @param {Array<Object>|Object} fixtureData - Single or multiple fixture objects.
 * @returns {Promise<Array>} - Array of saved fixture documents.
 * @throws {CustomError} - Throws error if database operation fails.
 */
const insertOrUpdateFixtures = async (fixtureData) => {
  try {
    if (!fixtureData) {
      throw new CustomError("No fixture data provided", 400);
    }

    // Convert single fixture object into an array for bulk processing
    const fixturesArray = Array.isArray(fixtureData) ? fixtureData : [fixtureData];

    // Use bulk operations for efficiency
    const bulkOperations = fixturesArray.map((fixture) => ({
      updateOne: {
        filter: { fixtureId: fixture.fixture.id }, // Find by fixture ID
        update: {
          $set: {
            fixtureId: fixture.fixture.id,
            date: fixture.fixture.date,
            venue: fixture.fixture.venue,
            status: fixture.fixture.status,
            league: fixture.league,
            teams: fixture.teams,
            goals: fixture.goals,
            score: fixture.score,
            events: fixture.events,
            statistics: fixture.statistics,
            players: fixture.players,
          },
        },
        upsert: true, // Insert if not exists, update if exists
      },
    }));

    // Execute bulk write operation
    const result = await SoccerFixture.bulkWrite(bulkOperations);

    console.log("Fixtures inserted/updated:", result);
    return result;
  } catch (error) {
    console.error("Error inserting/updating fixtures:", error.message);
    throw new CustomError(error.message || "Failed to insert/update fixtures", 500);
  }
};



/**
 * Fetch upcoming 10 fixtures for given league IDs.
 * @returns {Promise<Array>} - Combined list of upcoming fixtures.
 */
const getUpcomingFixtures = async () => {
  try {
    const leagueIds = Object.values(soccerLeagues); // Extract league IDs
    if (leagueIds.length === 0) {
      throw new Error("No leagues found in mapping.");
    }

    // Create API requests for each league
    const requests = leagueIds.map((leagueId) =>
      axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures", {
        params: { league: leagueId, next: 10 },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        },
      })
    );

    // Fetch all league fixtures in parallel
    const responses = await Promise.all(requests);

    // Extract fixtures from responses
    const combinedFixtures = responses.flatMap((response) => response.data.response);

    return combinedFixtures;
  } catch (error) {
    console.error("Error fetching upcoming fixtures:", error.message);
    throw new Error("Failed to fetch upcoming fixtures");
  }
};







module.exports = {getLiveGamesFixtureIds,getFixtureDetails,insertOrUpdateFixtures,getUpcomingFixtures}
