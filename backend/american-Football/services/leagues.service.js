const axios = require("axios");
const CustomError = require("../../utils/customError"); // Import custom error class
const AmericanFootballLeague = require("../models/league.model");
const RAPID_API_KEY = process.env.AMERICAN_FOOTBALL_API_KEY;
const RAPID_API_HOST = "https://api-american-football.p.rapidapi.com";

/**
 * Fetch all leagues from API.
 * @returns {Promise<Array>} - List of leagues from API.
 * @throws {CustomError} - Throws error if request fails.
 */
const fetchLeaguesFromAPI = async () => {
  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/leagues`,
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-american-football.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    if (!response.data || response.data.results === 0) {
      throw new CustomError("No leagues found in API", 404);
    }
    return response.data.response;
  } catch (error) {
    console.error("Error fetching leagues from API:", error.message);
    throw new CustomError("Failed to fetch leagues from API", 500);
  }
};

/**
 * Save or update a league in the database.
 * @param {Object} leagueData - League data from API.
 * @returns {Promise<Object>} - Saved or updated league document.
 * @throws {CustomError} - Throws error if saving fails.
 */
const saveLeagueToDB = async (leagueData) => {
  try {
    const savedLeague = await AmericanFootballLeague.findOneAndUpdate(
      { leagueId: leagueData.league.id }, // Find by League ID
      {
        $set: {
          leagueId: leagueData.league.id,
          name: leagueData.league.name,
          logo: leagueData.league.logo,
          country: leagueData.country,
          seasons: leagueData.seasons,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return savedLeague;
  } catch (error) {
    console.error("Error saving league to DB:", error.message);
    throw new CustomError("Failed to save league to database", 500);
  }
};

/**
 * Fetch leagues from API and save to the database.
 * @returns {Promise<Array>} - List of saved leagues.
 * @throws {CustomError} - Throws error if process fails.
 */
const fetchAndSaveLeagues = async () => {
  try {
    const leagues = await fetchLeaguesFromAPI();
    const savedLeagues = [];

    for (const league of leagues) {
      console.log(`Saving league: ${league.league.name}`);
      const savedLeague = await saveLeagueToDB(league);
      savedLeagues.push(savedLeague);
    }

    return savedLeagues;
  } catch (error) {
    console.error("Error fetching and saving leagues:", error.message);
    throw new CustomError("Failed to process and save leagues", 500);
  }
};

/**
 * Get all leagues from the database.
 * @returns {Promise<Array>} - List of leagues.
 * @throws {CustomError} - Throws error if no leagues found.
 */
const getAllLeagues = async () => {
  try {
    const leagues = await AmericanFootballLeague.find();
    if (!leagues.length) {
      throw new CustomError("No leagues found in the database", 404);
    }
    return leagues;
  } catch (error) {
    console.error("Error getting leagues from DB:", error.message);
    throw new CustomError("Failed to retrieve leagues from database", 500);
  }
};

/**
 * Get a league by its ID from the database.
 * @param {number} leagueId - League ID.
 * @returns {Promise<Object>} - League document.
 * @throws {CustomError} - Throws error if not found.
 */
const getLeagueById = async (leagueId) => {
  if (!leagueId) {
    throw new CustomError("League ID is required", 400);
  }

  try {
    const league = await AmericanFootballLeague.findOne({ leagueId });
    if (!league) {
      throw new CustomError(`No league found with ID: ${leagueId}`, 404);
    }
    return league;
  } catch (error) {
    console.error("Error getting league by ID:", error.message);
    throw new CustomError("Failed to retrieve league from database", 500);
  }
};
/**
 * Bulk update league by adding multiple teams to its teams array for a specific season.
 * @param {number} leagueId - League ID.
 * @param {number} season - Season year.
 * @param {Array} teamsData - Array of team objects [{ teamId, _id }, ...].
 * @returns {Promise<Object>} - Updated league document.
 * @throws {CustomError} - Throws error if update fails.
 */
const updateLeagueTeams = async (leagueId, season, teamsData) => {
  if (!leagueId) {
      throw new CustomError("leagueId parameter is required", 400);
  }
  if (!season) {
      throw new CustomError("season parameter is required", 400);
  }
  if (!Array.isArray(teamsData) || teamsData.length === 0) {
      throw new CustomError("Valid teams data array is required", 400);
  }

  try {
      const league = await AmericanFootballLeague.findOne({ leagueId });

      if (!league) {
          throw new CustomError(`No league found with ID: ${leagueId}`, 404);
      }

      // Check if the season entry exists
      const seasonIndex = league.teams.findIndex((entry) => entry.season === season);

      if (seasonIndex !== -1) {
          // Add new teams while preventing duplicates
          const existingTeams = new Set(league.teams[seasonIndex].teams.map(t => t.teamId));

          teamsData.forEach(team => {
              if (!existingTeams.has(team.teamId)) {
                  league.teams[seasonIndex].teams.push(team);
              }
          });
      } else {
          // Create a new season entry and add all teams
          league.teams.push({ season, teams: teamsData });
      }

      const updatedLeague = await league.save();
      return updatedLeague;
  } catch (error) {
      console.error("Error updating league teams:", error.message);
      throw new CustomError("Failed to update league teams", 500);
  }
};





/**
 * Get the latest season for all leagues.
 * @returns {Promise<Array>} - List of leagues with their latest season object.
 * @throws {CustomError} - Throws error if no leagues or seasons are found.
 */
const getLatestSeasonForAllLeagues = async () => {
  try {
    // Fetch all leagues from the database
    const leagues = await AmericanFootballLeague.find();

    if (!leagues || leagues.length === 0) {
      throw new CustomError("No leagues found in the database", 404);
    }

    const leaguesWithLatestSeasons = leagues.map((league) => {
      if (!league.seasons || league.seasons.length === 0) {
        console.warn(`⚠️ No seasons found for league: ${league.name} (ID: ${league.leagueId})`);
        return {
          leagueId: league.leagueId,
          name: league.name,
          latestSeason: null, // No seasons available
        };
      }

      // Step 1: Check if there's a season with `current: true`
      let latestSeason = league.seasons.find((s) => s.current === true);

      // Step 2: If no `current: true`, find the most recent season by sorting
      if (!latestSeason) {
        latestSeason = league.seasons.sort((a, b) => b.year - a.year)[0]; // Get the most recent season
      }

      return {
        leagueId: league.leagueId,
        name: league.name,
        latestSeason: latestSeason || null, // Return season object or null if none found
        teams: league.teams,
      };
    });

    return leaguesWithLatestSeasons;
  } catch (error) {
    console.error("Error getting latest seasons for all leagues:", error.message);
    throw new CustomError("Failed to retrieve latest seasons for all leagues", 500);
  }
};



/**
 * Fetch league standings from the API.
 * @param {number} leagueId - The league ID.
 * @param {number} season - The season year.
 * @returns {Promise<Array>} - List of standings for the league.
 * @throws {CustomError} - Throws error if request fails.
 */
const getLeagueStandings = async (leagueId, season) => {
  if (!leagueId || !season) {
    throw new CustomError("League ID and season are required", 400);
  }

  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/standings`,
    params: { league: leagueId, season: season },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-american-football.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    if (!response.data || response.data.results === 0) {
      console.log(`No standings found for league ${leagueId} in season ${season}`);
      return [];
    }

    return response.data.response; // Returning the fetched standings
  } catch (error) {
    console.error("Error fetching league standings from API:", error.message);
    throw new CustomError("Failed to fetch league standings from API", 500);
  }
};



/**
 * Fetch and return the top 10 standings for all leagues with their latest season.
 * @returns {Promise<Array>} - List of standings for each league.
 * @throws {CustomError} - Throws error if request fails.
 */
const getAllLeaguesStandings = async () => {
  try {
    console.log("🔄 Fetching latest seasons for all leagues...");
    const leaguesWithLatestSeasons = await getLatestSeasonForAllLeagues();

    if (!leaguesWithLatestSeasons || leaguesWithLatestSeasons.length === 0) {
      throw new CustomError("No leagues with valid seasons found", 404);
    }

    let standingsByLeague = [];

    for (const league of leaguesWithLatestSeasons) {
      const { leagueId, name, latestSeason } = league;

      if (!latestSeason) {
        console.log(`⚠️ No latest season found for league: ${name} (ID: ${leagueId}). Skipping.`);
        standingsByLeague.push({
          leagueName: name,
          season: null,
          standings: [],
        });
        continue;
      }

      console.log(`📌 Fetching standings for league: ${name} (ID: ${leagueId}) - Season: ${latestSeason.year}`);

      // Fetch league standings
      const standings = await getLeagueStandings(leagueId, latestSeason.year);

      if (!standings.length) {
        console.log(`❌ No standings found for ${name} in ${latestSeason.year}`);
        standingsByLeague.push({
          leagueName: name,
          season: latestSeason.year,
          standings: [],
        });
        continue;
      }

      // Return top 10 teams
      standingsByLeague.push({
        leagueName: name,
        season: latestSeason.year,
        standings: standings.slice(0, 10),
      });

      console.log(`✅ Standings fetched for ${name} (${latestSeason.year}).`);
    }

    console.log("✅ All league standings fetched successfully.");
    return standingsByLeague;
  } catch (error) {
    console.error("Error fetching league standings:", error.message);
    throw new CustomError("Failed to fetch all league standings", 500);
  }
};




module.exports = {
  fetchLeaguesFromAPI,
  saveLeagueToDB,
  fetchAndSaveLeagues,
  getAllLeagues,
  getLeagueById,
  updateLeagueTeams,
  getLatestSeasonForAllLeagues,
  getAllLeaguesStandings
};
