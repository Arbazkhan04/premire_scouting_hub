const axios = require("axios");
const AmericanFootballTeam = require("../models/teams.model");
const AmericanFootballLeague = require("../models/league.model");
const CustomError = require("../../utils/customError");
const { updateLeagueTeams } = require("./leagues.service");

const RAPID_API_KEY = process.env.AMERICAN_FOOTBALL_API_KEY;
const RAPID_API_HOST = "https://api-american-football.p.rapidapi.com";

/**
 * Fetch all teams of a given league and season from the API.
 * @param {number} leagueId - ID of the league.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - List of teams.
 * @throws {CustomError} - Throws error if API request fails.
 */
const getAllTeamsOfLeague = async (leagueId, season) => {
  if (!leagueId) throw new CustomError("leagueId parameter is required", 400);
  if (!season) throw new CustomError("season parameter is required", 400);

  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/teams`,
    params: { league: leagueId, season: season },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-american-football.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    if (!response.data || response.data.results === 0) {
      throw new CustomError("No teams found for the given league and season", 404);
    }
    return response.data.response;
  } catch (error) {
    console.error("Error fetching teams from API:", error.message);
    throw new CustomError("Failed to fetch teams from API", 500);
  }
};

// /**
//  * Save a team to the database and update the corresponding league.
//  * @param {Object} teamData - Team data from API.
//  * @param {number} leagueId - League ID.
//  * @param {number} season - Season year.
//  * @returns {Promise<Object>} - Saved team document.
//  * @throws {CustomError} - Throws error if saving fails.
//  */
// const saveTeamToDB = async (teamData, leagueId, season) => {
//     if (!teamData || !teamData.id) {
//       throw new CustomError("Valid team data with teamId is required", 400);
//     }
//     if (!leagueId) {
//       throw new CustomError("leagueId parameter is required", 400);
//     }
//     if (!season) {
//       throw new CustomError("season parameter is required", 400);
//     }
  
//     try {
//       // Save or update team in the database
//       const savedTeam = await AmericanFootballTeam.findOneAndUpdate(
//         { teamId: teamData.id },
//         {
//           $set: {
//             teamId: teamData.id,
//             name: teamData.name,
//             code: teamData.code,
//             city: teamData.city,
//             coach: teamData.coach,
//             owner: teamData.owner,
//             stadium: teamData.stadium,
//             established: teamData.established,
//             logo: teamData.logo,
//             country: teamData.country,
//           },
//         },
//         { upsert: true, new: true, setDefaultsOnInsert: true }
//       );
  
//       // Update the League's teams array by season
//       await updateLeagueTeams(leagueId, season, { _id: savedTeam._id, teamId: savedTeam.teamId });
  
//       return savedTeam;
//     } catch (error) {
//       console.error("Error saving team to DB:", error.message);
//       throw new CustomError("Failed to save team to database", 500);
//     }
//   };
  


/**
 * Save multiple teams to the database and update the corresponding league.
 * @param {Array} teamsData - Array of team data from API.
 * @param {number} leagueId - League ID.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - Saved team documents.
 * @throws {CustomError} - Throws error if saving fails.
 */
const saveTeamsToDB = async (teamsData, leagueId, season) => {
  if (!Array.isArray(teamsData) || teamsData.length === 0) {
      throw new CustomError("Valid teams data array is required", 400);
  }
  if (!leagueId) {
      throw new CustomError("leagueId parameter is required", 400);
  }
  if (!season) {
      throw new CustomError("season parameter is required", 400);
  }

  try {
      // Prepare bulk operations
      const bulkOps = teamsData.map(teamData => ({
          updateOne: {
              filter: { teamId: teamData.id },
              update: {
                  $set: {
                      teamId: teamData.id,
                      name: teamData.name,
                      code: teamData.code,
                      city: teamData.city,
                      coach: teamData.coach,
                      owner: teamData.owner,
                      stadium: teamData.stadium,
                      established: teamData.established,
                      logo: teamData.logo,
                      country: teamData.country,
                  },
              },
              upsert: true, // Insert if not found
          }
      }));

      // Execute bulk write operation
      const result = await AmericanFootballTeam.bulkWrite(bulkOps, { ordered: false });

      // Fetch saved teams (optional but useful)
      const savedTeams = await AmericanFootballTeam.find({ teamId: { $in: teamsData.map(t => t.id) } });

      // Update the League's teams array in one operation
      await updateLeagueTeams(
          leagueId,
          season,
          savedTeams.map(team => ({ _id: team._id, teamId: team.teamId }))
      );

      return savedTeams;
  } catch (error) {
      console.error("Error saving teams to DB:", error.message);
      throw new CustomError("Failed to save teams to database", 500);
  }
};








/**
 * Fetch and save all teams of a league for a given season.
 * @param {number} leagueId - ID of the league.
 * @param {number} season - Season year.
 * @returns {Promise<Array>} - List of saved team documents.
 * @throws {CustomError} - Throws error if process fails.
 */
const fetchAndSaveAllTeamsOfLeague = async (leagueId, season) => {
    if (!leagueId) {
      throw new CustomError("leagueId parameter is required", 400);
    }
    if (!season) {
      throw new CustomError("season parameter is required", 400);
    }
  
    try {
      const teams = await getAllTeamsOfLeague(leagueId, season);
      const savedTeams = await saveTeamsToDB(teams,leagueId,season)
  
      // for (const team of teams) {
      //   console.log(`Saving team: ${team.name} for season ${season}`);
      //   const savedTeam = await saveTeamToDB(team, leagueId, season);
      //   savedTeams.push(savedTeam);
      // }
  
      return savedTeams;
    } catch (error) {
      console.error("Error fetching and saving teams:", error.message);
      throw new CustomError("Failed to process and save teams", 500);
    }
  };
  
/**
 * Search teams by name or partial query.
 * @param {string} query - Search query (partial or full).
 * @returns {Promise<Array>} - List of matching teams.
 * @throws {CustomError} - Throws error if no teams are found.
 */
const searchTeams = async (query) => {
  if (!query) throw new CustomError("Query parameter is required", 400);

  try {
    const teams = await AmericanFootballTeam.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive partial search
    });

    if (!teams.length) throw new CustomError("No teams found for the given search", 404);

    return teams;
  } catch (error) {
    console.error("Error searching teams:", error.message);
    throw new CustomError("Failed to search teams", 500);
  }
};

/**
 * Get a team by its teamId.
 * @param {number} teamId - The API's team ID.
 * @returns {Promise<Object>} - The team document.
 * @throws {CustomError} - Throws error if not found.
 */
const getTeamById = async (teamId) => {
  if (!teamId) throw new CustomError("teamId parameter is required", 400);

  try {
    const team = await AmericanFootballTeam.findOne({ teamId });
    if (!team) throw new CustomError(`No team found with ID: ${teamId}`, 404);

    return team;
  } catch (error) {
    console.error("Error getting team by ID:", error.message);
    throw new CustomError("Failed to retrieve team from database", 500);
  }
};




/**
 * Update a team's players list by adding multiple players for a specific season.
 * @param {number} teamId - Team ID.
 * @param {number} season - Season year.
 * @param {Array} players - Array of objects [{ playerRefId, playerId }]
 * @returns {Promise<Object>} - Updated team document.
 * @throws {CustomError} - Throws error if update fails.
 */
const updateTeamPlayers = async (teamId, season, players) => {
  if (!teamId) {
    throw new CustomError("teamId parameter is required", 400);
  }
  if (!season) {
    throw new CustomError("season parameter is required", 400);
  }
  if (!players || !Array.isArray(players) || players.length === 0) {
    throw new CustomError("Valid players array is required", 400);
  }

  try {
    const team = await AmericanFootballTeam.findOne({ teamId });

    if (!team) {
      throw new CustomError(`No team found with ID: ${teamId}`, 404);
    }

    // Find the index of the season
    const seasonIndex = team.players.findIndex((entry) => entry.season === season);

    if (seasonIndex !== -1) {
      // If season exists, filter out duplicates before adding
      const existingPlayerIds = new Set(team.players[seasonIndex].roster.map((p) => p.playerId));
      const newPlayers = players.filter((p) => !existingPlayerIds.has(p.playerId));

      team.players[seasonIndex].roster.push(...newPlayers);
    } else {
      // If season does not exist, create a new entry with the players
      team.players.push({ season, roster: players });
    }

    const updatedTeam = await team.save();
    return updatedTeam;
  } catch (error) {
    console.error("Error updating team players:", error.message);
    throw new CustomError("Failed to update team players", 500);
  }
};


  

module.exports = {
  getAllTeamsOfLeague,
  saveTeamsToDB,
  fetchAndSaveAllTeamsOfLeague,
  searchTeams,
  getTeamById,
  updateTeamPlayers 
};
