const axios = require("axios");
const CustomError = require("../../utils/customError"); // Import custom error class
const League = require("../models/league.model");

const RAPID_API_KEY = process.env.SOCCER_API_KEY;
const RAPID_API_HOST = "https://api-football-v1.p.rapidapi.com";

/**
 * Fetch league data from API and save it to the database.
 * @param {number} leagueId - ID of the league to fetch.
 * @returns {Promise<Object>} - The saved league document.
 * @throws {CustomError} - Throws error if request fails or league is not found.
 */
const fetchAndSaveLeague = async (leagueId) => {
  if (!leagueId) {
    throw new CustomError("League ID is required", 400);
  }

  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/v3/leagues`,
    params: { id: leagueId },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const leagueData = response.data.response?.[0]; // Extract league details

    if (!leagueData) {
      throw new CustomError(`No league found with ID: ${leagueId}`, 404);
    }

    // Prepare data for database
    const formattedLeagueData = {
      league: {
        id: leagueData.league.id,
        name: leagueData.league.name,
        type: leagueData.league.type,
        logo: leagueData.league.logo,
      },
      country: leagueData.country,
      seasons: leagueData.seasons,
      teams: [], // Teams will be added externally
    };

    // Save league data to the database
    return await insertOrUpdateLeague(formattedLeagueData);
  } catch (error) {
    console.error("Error fetching league data:", error.message);
    throw new CustomError("Failed to fetch and save league data", 500);
  }
};






/**
 * Insert or Update a League in the Database.
 * @param {Object} leagueData - Data of the league to insert or update.
 * @returns {Promise<Object>} - The created or updated league document.
 */
const insertOrUpdateLeague = async (leagueData) => {
  try {
    // Save or update league in the database
    const savedLeague = await League.findOneAndUpdate(
      { leagueId: leagueData?.league?.id }, // Filter by League ID
      { 
        $set: {
          leagueId: leagueData?.league?.id,
          name: leagueData?.league?.name,
          type: leagueData?.league?.type,
          logo: leagueData?.league?.logo,
          country: leagueData?.country,
          seasons: leagueData?.seasons,
        //   teams: leagueData?.teams || [],
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options
    );

    return savedLeague;
  } catch (error) {
    // throw new CustomError(`No league found with ID: ${leagueId}`, 404);

    throw new CustomError(`Error in insertOrUpdateLeague: ${error.message}`,404);
  }
};

module.exports = {fetchAndSaveLeague, insertOrUpdateLeague };






