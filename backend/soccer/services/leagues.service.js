const axios = require("axios");
const CustomError = require("../../utils/customError"); // Import custom error class
const League = require("../models/league.model");
const soccerLeagues = require("../../utils/soccerLeagues");
const { fetchAndSaveLeagueStandings } = require("./leagueStandings.service");
const { fetchAndSaveLeagueTopScorers } = require("./leagueTopScorer.service");
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
      // teams: [], // Teams will be added externally
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
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options
    );

    // const latestSeason = leagueData?.seasons.sort((a, b) => b - a)[0];
    const latestSeasons = leagueData?.seasons.sort((a, b) => b.year - a.year).slice(0, 2);

    // After Saving the league fetch the league Standings and league top scorers too

    for (let season of latestSeasons) {
      await fetchAndSaveLeagueStandings(leagueData?.league?.id, season.year);
      await fetchAndSaveLeagueTopScorers(leagueData?.league?.id, season.year);
    }

    return savedLeague;
  } catch (error) {
    // throw new CustomError(`No league found with ID: ${leagueId}`, 404);

    throw new CustomError(
      `Error in insertOrUpdateLeague: ${error.message}`,
      404
    );
  }
};

/**
 * Loop through all leagues in the soccerLeagues object and fetch & save data for each.
 */
const fetchAndSaveAllLeagues = async () => {
  try {
    for (const leagueName in soccerLeagues) {
      if (soccerLeagues.hasOwnProperty(leagueName)) {
        const leagueId = soccerLeagues[leagueName];

        console.log(
          `Fetching and saving data for "${leagueName}" (League ID: ${leagueId})`
        );

        try {
          // Call the fetchAndSaveLeague function for each league
          await fetchAndSaveLeague(leagueId);
          console.log(
            `Data for "${leagueName}" (League ID: ${leagueId}) saved successfully`
          );
        } catch (error) {
          // Custom error handling if fetching and saving league data fails
          console.error(
            `Failed to fetch and save data for "${leagueName}" (League ID: ${leagueId}): ${error.message}`
          );
          throw new CustomError(
            `Failed to fetch and save data for ${leagueName}`,
            500
          );
        }
      }
    }
  } catch (error) {
    // General error handling for the entire process
    console.error("Error in fetching and saving league data:", error.message);
    throw new CustomError("Failed to process all league data", 500);
  }
};

module.exports = {
  fetchAndSaveLeague,
  insertOrUpdateLeague,
  fetchAndSaveAllLeagues,
};
