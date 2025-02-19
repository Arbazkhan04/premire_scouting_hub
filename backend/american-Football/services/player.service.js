const axios = require("axios");
const AmericanFootballPlayer = require("../models/player.model");
const AmericanFootballTeam = require("../models/teams.model");
const AmericanFootballLeague=require("../models/league.model")
const AmericanFootballPlayerStatistics=require("../models/playerStatistics.model")
const CustomError = require("../../utils/customError");
const { updateTeamPlayers } = require("./teams.service");
const {apiRequest} =require("../../utils/apiRequest")
const RAPID_API_KEY = process.env.AMERICAN_FOOTBALL_API_KEY;
const RAPID_API_HOST = "https://api-american-football.p.rapidapi.com";




// /**
//  * Fetch all players of a given team and season from the API.
//  * @param {number} teamId - ID of the team.
//  * @param {number} season - Season year.
//  * @returns {Promise<Array>} - List of players.
//  * @throws {CustomError} - Throws error if API request fails.
//  */
// const getAllPlayersOfTeam = async (teamId, season) => {
//   if (!teamId) throw new CustomError("teamId parameter is required", 400);
//   if (!season) throw new CustomError("season parameter is required", 400);

//   const options = {
//     method: "GET",
//     url: `${RAPID_API_HOST}/players`,
//     params: { team: teamId, season: season },
//     headers: {
//       "x-rapidapi-key": RAPID_API_KEY,
//       "x-rapidapi-host": "api-american-football.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     if (!response.data || response.data.results === 0) {
//       throw new CustomError("No players found for the given team and season", 404);
//     }
//     return response.data.response;
//   } catch (error) {
//     console.error("Error fetching players from API:", error.message);
//     throw new CustomError("Failed to fetch players from API", 500);
//   }
// };






/**
 * Fetch all players of a given team and season from the API with rate-limit handling.
 * @param {number} teamId - ID of the team.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - List of players.
 * @throws {CustomError} - Throws error if API request fails.
 */
const getAllPlayersOfTeam = async (teamId, season) => {
  if (!teamId) throw new CustomError("teamId parameter is required", 400);
  if (!season) throw new CustomError("season parameter is required", 400);

  try {
    const headers = {
      "x-rapidapi-key": process.env.AMERICAN_FOOTBALL_API_KEY, // Dynamic API key
      "x-rapidapi-host": "api-american-football.p.rapidapi.com",
    };

    const response = await apiRequest(`${RAPID_API_HOST}/players`, { team: teamId, season }, headers);

    if (!response || response.results === 0) {
      // throw new CustomError("No players found for the given team and season", 404);
      return []
    }

    return response.response;
  } catch (error) {
    console.error("Error fetching players from API:", error.message);
    throw new CustomError(error.message, 500);
  }
};







/**
 * Save players to the database in bulk and update the corresponding team.
 * @param {Array} players - List of player data from API.
 * @param {number} teamId - Team ID.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - List of saved player documents.
 * @throws {CustomError} - Throws error if saving fails.
 */
const savePlayersToDB = async (players, teamId, season) => {
  if (!players || players.length === 0) {
    throw new CustomError("Valid player data is required", 400);
  }
  if (!teamId) {
    throw new CustomError("teamId parameter is required", 400);
  }
  if (!season) {
    throw new CustomError("season parameter is required", 400);
  }

  try {
    // Prepare bulk operations for inserting/updating players
    const bulkOps = players.map((player) => ({
      updateOne: {
        filter: { playerId: player.id }, // Find by playerId
        update: {
          $set: {
            playerId: player.id,
            name: player.name,
            age: player.age,
            height: player.height,
            weight: player.weight,
            college: player.college,
            group: player.group,
            position: player.position,
            number: player.number,
            salary: player.salary,
            experience: player.experience,
            image: player.image,
          },
        },
        upsert: true, // Insert if not found
      },
    }));

    // Perform bulk write operation
    const bulkResult = await AmericanFootballPlayer.bulkWrite(bulkOps);
    console.log("Bulk write result:", bulkResult);

    // Retrieve updated players
    const savedPlayers = await AmericanFootballPlayer.find({
      playerId: { $in: players.map((p) => p.id) },
    });

    // Prepare bulk operations to update the team's players array
    const playerRefs = savedPlayers.map((p) => ({
      playerRefId: p._id,
      playerId: p.playerId,
    }));

    // Update the Team's players array by season in bulk
    await updateTeamPlayers(teamId, season, playerRefs);

    return savedPlayers;
  } catch (error) {
    console.error("Error saving players to DB:", error.message);
    throw new CustomError("Failed to save players to database", 500);
  }
};

/**
 * Fetch and save all players of a team for a given season.
 * @param {number} teamId - ID of the team.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - List of saved player documents.
 * @throws {CustomError} - Throws error if process fails.
 */
const fetchAndSaveAllPlayersOfTeam = async (teamId, season) => {
  if (!teamId) {
    throw new CustomError("teamId parameter is required", 400);
  }
  if (!season) {
    throw new CustomError("season parameter is required", 400);
  }

  try {
    const players = await getAllPlayersOfTeam(teamId, season);
    if (!players || players.length === 0) {
      console.warn(`No players found for teamId: ${teamId}, season: ${season}`);
      return [];
    }

    console.log(`Saving ${players.length} players for teamId: ${teamId}, season: ${season}`);
    return await savePlayersToDB(players, teamId, season);
  } catch (error) {
    console.error("Error fetching and saving players:", error.message);
    throw new CustomError("Failed to process and save players", 500);
  }
};


/**
 * Search players by name or partial query.
 * @param {string} query - Search query (partial or full).
 * @returns {Promise<Array>} - List of matching players.
 * @throws {CustomError} - Throws error if no players are found.
 */
const searchPlayers = async (query) => {
  if (!query) throw new CustomError("Query parameter is required", 400);

  try {
    const players = await AmericanFootballPlayer.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive partial search
    });

    if (!players.length) throw new CustomError("No players found for the given search", 404);

    return players;
  } catch (error) {
    console.error("Error searching players:", error.message);
    throw new CustomError("Failed to search players", 500);
  }
};

/**
 * Get a player by their playerId.
 * @param {number} playerId - The API's player ID.
 * @returns {Promise<Object>} - The player document.
 * @throws {CustomError} - Throws error if not found.
 */
const getPlayerById = async (playerId) => {
  if (!playerId) throw new CustomError("playerId parameter is required", 400);

  try {
    // Find the player without statistics field
    const player = await AmericanFootballPlayer.findOne({ playerId }).select("-statistics");
    if (!player) throw new CustomError(`No player found with ID: ${playerId}`, 404);

    // Get player statistics separately
    const playerStats = await AmericanFootballPlayerStatistics.find({ playerId });

    // Convert player document to plain JavaScript object (to allow mutation)
    const playerObject = player.toObject();

    // Add statistics data to the player object
    playerObject.statistics = playerStats;

    return playerObject;
  } catch (error) {
    console.error("Error getting player by ID:", error.message);
    throw new CustomError("Failed to retrieve player from database", 500);
  }
};



// /**
//  * Fetch and save all players for all teams in all leagues.
//  * @returns {Promise<Array>} - List of all saved player documents.
//  * @throws {CustomError} - Throws error if process fails.
//  */
// const fetchAndSaveAllPlayersForAllLeagues = async () => {
//   try {
//     console.log("Fetching all leagues...");

//     // Step 1: Get all leagues from the database
//     const leagues = await AmericanFootballLeague.find({});
//     if (!leagues || leagues.length === 0) {
//       throw new CustomError("No leagues found in the database", 404);
//     }

//     const allSavedPlayers = [];

//     // Step 2: Loop through each league
//     for (const league of leagues) {
//       console.log(`Processing league: ${league.name} (ID: ${league.leagueId})`);

//       // Step 3: Loop through each object in the teams array (each contains season & teams array)
//       for (const seasonObj of league.teams) {
//         const season = seasonObj.season;
//         const teamsArray = seasonObj.teams; // Extract teams array

//         console.log(`Processing season: ${season} for league: ${league.name}`);

//         if (!teamsArray || teamsArray.length === 0) {
//           console.warn(`No teams found for season ${season} in league ${league.name}`);
//           continue; // Skip to next season
//         }

//         // Step 4: Loop through each team in the season's teams array
//         for (const team of teamsArray) {
//           console.log(`Fetching players for team ID: ${team.teamId} in season ${season}`);

//           const savedPlayers = await fetchAndSaveAllPlayersOfTeam(team.teamId, season);
//           allSavedPlayers.push(...savedPlayers);
//         }
//       }
//     }

//     console.log("All players fetched and saved successfully for all leagues");
//     return allSavedPlayers;
//   } catch (error) {
//     console.error("Error in fetchAndSaveAllPlayersForAllLeagues:", error.message);
//     throw new CustomError("Failed to fetch and save players for all leagues", 500);
//   }
// };





/**
 * Fetch and save all players for all teams in all leagues (parallel processing).
 * @returns {Promise<Array>} - List of all saved player documents.
 * @throws {CustomError} - Throws error if process fails.
 */
const fetchAndSaveAllPlayersForAllLeagues = async () => {
  try {
    console.log("Fetching all leagues...");

    // Step 1: Get all leagues from the database
    const leagues = await AmericanFootballLeague.find({});
    if (!leagues || leagues.length === 0) {
      throw new CustomError("No leagues found in the database", 404);
    }

    const allPlayers = [];

    // Step 2: Process each league in parallel
    await Promise.all(leagues.map(async (league) => {
      console.log(`Processing league: ${league.name} (ID: ${league.leagueId})`);

      // Step 3: Process each season in parallel
      await Promise.all(league.teams.map(async (seasonObj) => {
        const season = seasonObj.season;
        const teamsArray = seasonObj.teams; // Extract teams array

        console.log(`Processing season: ${season} for league: ${league.name}`);

        if (!teamsArray || teamsArray.length === 0) {
          console.warn(`No teams found for season ${season} in league ${league.name}`);
          return; // Skip this season
        }

        // Step 4: Fetch players for all teams in parallel
        const players = await Promise.all(teamsArray.map(team => 
          fetchAndSaveAllPlayersOfTeam(team.teamId, season)
        ));

        // Flatten the array and store the results
        allPlayers.push(...players.flat());
      }));
    }));

    console.log("All players fetched and saved successfully for all leagues");
    return true;
  } catch (error) {
    console.error("Error in fetchAndSaveAllPlayersForAllLeagues:", error.message);
    throw new CustomError("Failed to fetch and save players for all leagues", 500);
  }
};


module.exports = {
  getAllPlayersOfTeam,
  savePlayersToDB,
  fetchAndSaveAllPlayersOfTeam,
  searchPlayers,
  getPlayerById,
  fetchAndSaveAllPlayersForAllLeagues
};
