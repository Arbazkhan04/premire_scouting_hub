const mongoose = require("mongoose");
const SoccerTeam = require("../models/team.model");
const SoccerLeague = require("../models/league.model");
const axios = require("axios");
const CustomError = require("../../utils/customError");

const RAPID_API_KEY = process.env.SOCCER_API_KEY;
const RAPID_API_HOST = "https://api-football-v1.p.rapidapi.com";

const fetchTeamSeasons = async (teamId) => {
  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/v3/teams/seasons`,
    params: { team: teamId },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.response || [];
  } catch (error) {
    console.error(`Error fetching seasons for team ${teamId}:`, error.message);
    return [];
  }
};
const saveTeamInfo = async (teamData, seasons, leagueId) => {
  try {
    const team = teamData.team;
    const venue = teamData.venue;

    const modifiedSeasons = seasons.map((season) => ({
      year: season,
      stats: false, // Default value
      statRef: [], // Default value
    }));

 


    const teamInfo = {
      teamId: team.id,
      name: team.name,
      code: team.code,
      country: team.country,
      founded: team.founded,
      national: team.national,
      logo: team.logo,
      venue: venue
        ? {
            id: venue.id,
            name: venue.name,
            address: venue.address,
            city: venue.city,
            capacity: venue.capacity,
            surface: venue.surface,
            image: venue.image,
          }
        : {},
      seasons: modifiedSeasons,
    };

    // Fetch existing team first
    let existingTeam = await SoccerTeam.findOne({ teamId: team.id });

    if (!existingTeam) {
      // Create new team with leagueId
      existingTeam = new SoccerTeam({ ...teamInfo, leagues: [leagueId] });
    } else {
      // Ensure leagueId is not duplicated
      if (!existingTeam.leagues.includes(leagueId)) {
        existingTeam.leagues.push(leagueId);
      }
      Object.assign(existingTeam, teamInfo); // Update team details
    }

    // Save the updated team
    const updatedTeam = await existingTeam.save();

    // Update League document: ensure unique team ID reference
    const updateLeagueDocument = await SoccerLeague.findOneAndUpdate(
      { leagueId: leagueId },
      {
        $addToSet: {
          teams: { _id: updatedTeam._id, teamId: updatedTeam?.teamId },
        },
      }, // Ensures unique team references
      { new: true }
    );
    console.log(updateLeagueDocument);

    return updatedTeam; // Optionally return the updated team if needed for further processing
  } catch (error) {
    console.error("Error saving team data:", error.message);
    // Throw custom error with a relevant message and status code
    throw new CustomError("Failed to save team data", 500);
  }
};

/**
 * fetch all the teams of a league of particular season
 * @param {*} leagueId
 * @param {*} season
 */
const fetchAndSaveTeams = async (leagueId, season) => {
  if (!leagueId || !season) {
    throw new CustomError("League ID and Season are required", 400);
  }

  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/v3/teams`,
    params: { league: leagueId, season: season },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const teams = response.data.response;

    if (!teams || teams.length === 0) {
      throw new CustomError(
        `No teams found for League ID: ${leagueId} and Season: ${season}`,
        404
      );
    }

    // for (const teamData of teams) {
    //   const teamSeasons = await fetchTeamSeasons(teamData.team.id);
    //   await saveTeamInfo(teamData, teamSeasons, leagueId);
    // }

    await Promise.all(
      teams.map(async (teamData) => {
        const teamSeasons = await fetchTeamSeasons(teamData.team.id);
        return saveTeamInfo(teamData, teamSeasons, leagueId);
      })
    );
  } catch (error) {
    console.error("Error fetching team data:", error.message);
    throw new CustomError("Failed to fetch and save team data", 500);
  }
};

/**
 * Search for teams by name, allowing partial matches.
 * @param {string} query - The search query for the team's name.
 * @returns {Promise<Array>} - A list of teams matching the query.
 * @throws {CustomError} - Throws error if no teams are found or if the query is invalid.
 */
const searchTeam = async (query) => {
  if (!query || query.trim().length === 0) {
    throw new CustomError("Search query cannot be empty", 400);
  }

  try {
    // Search teams whose name contains the query, case-insensitive
    const teams = await SoccerTeam.find({
      name: { $regex: query, $options: "i" }, // 'i' makes it case-insensitive
    });

    if (teams.length === 0) {
      return null;
    }

    return teams;
  } catch (error) {
    console.error("Error in searchTeam:", error.message);
    throw new CustomError("Error occurred while searching for teams", 500);
  }
};

/**
 * Service to get team by teamId.
 * @param {number} teamId - The ID of the team to fetch.
 * @returns {Promise<Object>} - The team document.
 * @throws {CustomError} - Throws an error if team is not found.
 */
const getTeamByTeamId = async (teamId) => {
  if (!teamId) {
    throw new CustomError("Team ID is required", 400);
  }

  try {
    const team = await SoccerTeam.findOne({ teamId });

    if (!team) {
      console.log("condition fullfilled");
      throw new CustomError(`No team found with ID: ${teamId}`, 404);
    }
    const { getTeamStats } = require("../services/teamStatistics.service");

    const getTeamStatistics = await getTeamStats(teamId);
// console.log(getTeamStatistics)
    team.Statistics = getTeamStatistics;
    const response={
      team,
      TeamStatistics:getTeamStatistics
    }

    return response;
  } catch (error) {
    console.error("Error in getTeamByTeamId:", error.message);
    throw new CustomError(error.message, 500);
  }
};




// const updateSeason = async (teamId, seasonYear, statRef) => {
//   try {
//     // Validate input arguments
//     if (!teamId || !seasonYear || !statRef) {
//       throw new CustomError("Invalid input: teamId, seasonYear, and statRef are required", 400);
//     }

//     // Convert statRef to ObjectId if it's a string
//     const statRefObjectId = new mongoose.Types.ObjectId(statRef);

//     // Find the team by teamId
//     const team = await SoccerTeam.findOne({ teamId });

//     if (!team) {
//       throw new CustomError(`Team with teamId ${teamId} not found`, 404);
//     }

//     // Find the season index
//     const existingSeasonIndex = team.seasons.findIndex(season => season.year === seasonYear);

//     if (existingSeasonIndex !== -1) {
//       // If the season exists, update it
//       const existingSeason = team.seasons[existingSeasonIndex];

//       // **Ensure `statRef` is an array**
//       if (!Array.isArray(existingSeason.statRef)) {
//         existingSeason.statRef = [];
//       }

//       // Check for duplicates before adding the new statRef
//       if (!existingSeason.statRef.some(ref => ref.equals(statRefObjectId))) {
//         existingSeason.statRef.push(statRefObjectId);
//       }

//       existingSeason.stats = true; // Mark stats as true
//     } else {
//       // If season does not exist, add a new entry
//       team.seasons.push({
//         year: seasonYear,
//         stats: true,
//         statRef: [statRefObjectId], // Store the new stat reference in an array
//       });
//     }

//     // Save the updated team document with retry mechanism
//     const updatedTeam = await SoccerTeam.findOneAndUpdate(
//       { teamId },
//       { $set: { seasons: team.seasons } }, // Update seasons array
//       { new: true, runValidators: true }
//     );

//     if (!updatedTeam) {
//       throw new CustomError(`Failed to update team with teamId ${teamId}`, 500);
//     }

//     return updatedTeam;
//   } catch (error) {
//     console.error("Error updating season:", error.message);
    
//     // If error is not a CustomError, wrap it in one
//     if (!(error instanceof CustomError)) {
//       throw new CustomError(`Failed to update season: ${error.message}`, 500);
//     }

//     throw error;
//   }
// };




const updateSeason = async (teamId, seasonYear, statRef) => {
  try {
    // Validate input arguments
    if (!teamId || !seasonYear || !statRef) {
      throw new CustomError("Invalid input: teamId, seasonYear, and statRef are required", 400);
    }

    // Convert statRef to ObjectId if it's a string
    const statRefObjectId = new mongoose.Types.ObjectId(statRef);

    // Use `findOneAndUpdate` with `$set` and `$addToSet` to prevent overwrites
    const updatedTeam = await SoccerTeam.findOneAndUpdate(
      { teamId, "seasons.year": seasonYear },
      {
        $set: { "seasons.$.stats": true }, // Ensure `stats` is set to `true`
        $addToSet: { "seasons.$.statRef": statRefObjectId } // Prevents duplicate statRefs
      },
      { new: true, runValidators: true }
    );

    // If no matching season is found, add a new season entry
    if (!updatedTeam) {
      const newSeason = {
        year: seasonYear,
        stats: true,
        statRef: [statRefObjectId]
      };

      // Push the new season using `$push`
      const finalUpdatedTeam = await SoccerTeam.findOneAndUpdate(
        { teamId },
        { $push: { seasons: newSeason } },
        { new: true, runValidators: true }
      );

      if (!finalUpdatedTeam) {
        throw new CustomError(`Failed to update team with teamId ${teamId}`, 500);
      }

      return finalUpdatedTeam;
    }

    return updatedTeam;
  } catch (error) {
    console.error("Error updating season:", error.message);

    // If error is not a CustomError, wrap it in one
    if (!(error instanceof CustomError)) {
      throw new CustomError(`Failed to update season: ${error.message}`, 500);
    }

    throw error;
  }
};


module.exports = { fetchAndSaveTeams, searchTeam, getTeamByTeamId ,updateSeason};
