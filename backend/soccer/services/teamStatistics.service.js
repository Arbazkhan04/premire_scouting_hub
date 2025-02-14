const axios = require("axios");
const CustomError = require("../../utils/customError"); // Ensure you have your custom error class
const SoccerTeamStatistics = require("../models/teamStatistics.model");
const Team = require("../models/team.model");
const League = require("../models/league.model");
const { apiRequest } = require("../../utils/apiRequest");
// const fetchTeamStatistics = async (leagueId, season, teamId) => {
//   try {
//     const options = {
//       method: "GET",
//       url: "https://api-football-v1.p.rapidapi.com/v3/teams/statistics",
//       params: {
//         league: leagueId.toString(),
//         season: season.toString(),
//         team: teamId.toString(),
//       },
//       headers: {
//         "x-rapidapi-key": process.env.SOCCER_API_KEY, // Use environment variables for security
//         "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
//       },
//     };

//     const response = await axios.request(options);

//     // Validate response structure
//     if (!response.data || response.data.results === 0) {
//       throw new CustomError(404, "No team statistics found.");
//     }

//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Error fetching team statistics:", error.message);

//     // Handle Axios errors or custom API errors
//     if (error.response) {
//       throw new CustomError(
//         error.response.status,
//         error.response.data.message || "API request failed."
//       );
//     } else {
//       throw new CustomError(
//         500,
//         "Internal Server Error while fetching team statistics."
//       );
//     }
//   }
// };

const fetchTeamStatistics = async (leagueId, season, teamId) => {
  try {
    // Prepare parameters for the API request
    const params = {
      league: leagueId.toString(),
      season: season.toString(),
      team: teamId.toString(),
    };

    // Call the apiRequest method instead of axios directly
    const responseData = await apiRequest(
      "https://api-football-v1.p.rapidapi.com/v3/teams/statistics",
      params
    );

    // Validate response structure
    if (!responseData || responseData.results === 0) {
      throw new CustomError(404, "No team statistics found.");
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Error fetching team statistics:", error.message);

    // Handle Axios errors or custom API errors
    if (error.response) {
      throw new CustomError(
        error.response.status,
        error.response.data.message || "API request failed."
      );
    } else {
      throw new CustomError(500, error.message);
    }
  }
};

const saveTeamStatistics = async (data) => {
  try {
    // Extract relevant team statistics response
    const teamStats = data.data.response;
    // console.log(data.response)
    // Check if there is no data available
    if (!teamStats || teamStats.fixtures?.played?.total === 0) {
      // console.log(teamStats.fixtures?.played?.total)
      console.log("No Stats for this season");
      return { success: true, message: "No data available to save." };
    }

    // Map API response to the MongoDB model structure
    const statisticsData = {
      league: teamStats.league.id.toString(),
      team: teamStats.team.id.toString(),
      season: teamStats.league.season,
      form: teamStats.form || null,
      fixtures: {
        played: teamStats.fixtures.played,
        wins: teamStats.fixtures.wins,
        draws: teamStats.fixtures.draws,
        loses: teamStats.fixtures.loses,
      },
      goals: {
        for: {
          total: teamStats.goals.for.total,
          average: teamStats.goals.for.average,
          minute: teamStats.goals.for.minute,
          under_over: teamStats.goals.for.under_over,
        },
        against: {
          total: teamStats.goals.against.total,
          average: teamStats.goals.against.average,
          minute: teamStats.goals.against.minute,
          under_over: teamStats.goals.against.under_over,
        },
      },
      biggest: {
        streak: teamStats.biggest.streak,
        wins: teamStats.biggest.wins,
        loses: teamStats.biggest.loses,
        goals: teamStats.biggest.goals,
      },
      clean_sheet: teamStats.clean_sheet,
      failed_to_score: teamStats.failed_to_score,
      penalty: teamStats.penalty,
      lineups: teamStats.lineups || [],
      cards: teamStats.cards || {},
    };

    // Save or update team statistics
    const savedStatistics = await SoccerTeamStatistics.findOneAndUpdate(
      {
        league: statisticsData.league,
        team: statisticsData.team,
        season: statisticsData.season,
      },
      statisticsData,
      { upsert: true, new: true }
    );

    return { success: true, data: savedStatistics };
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to save team statistics.",
      error.status || 500
    );
  }
};

/**
 * Fetch the team statistics for all the leagues in which this team is playing for all the league seasons
 * @param {*} teamId
 * @returns
 */

const processTeamStatistics = async (teamId) => {
  try {
    // Find the team document by teamId
    const team = await Team.findOne({ teamId });
    if (!team) {
      throw new CustomError(`Team with ID ${teamId} not found`, 404);
    }

    // Process all leagues in parallel
    await Promise.all(
      team.leagues.map(async (leagueId) => {
        try {
          // Find the league document by leagueId
          const league = await League.findOne({ leagueId });
          if (!league) {
            console.warn(`League with ID ${leagueId} not found. Skipping...`);
            return; // Skip if the league is not found
          }

          // Process all seasons in parallel
          await Promise.all(
            league.seasons.map(async (season) => {
              try {
                // Fetch and save team statistics concurrently
                const statisticsData = await fetchTeamStatistics(
                  leagueId,
                  season.year,
                  teamId
                );
                await saveTeamStatistics(statisticsData);
              } catch (error) {
                console.error(
                  `Error processing stats for team ${teamId}, league ${leagueId}, season ${season.year}:`,
                  error
                );
              }
            })
          );
        } catch (error) {
          console.error(`Error processing league ${leagueId}:`, error);
        }
      })
    );

    return { success: true, message: "Team statistics processed successfully" };
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to process team statistics",
      error.status || 500
    );
  }
};

// const processTeamStatistics = async (teamId) => {
//   try {
//     // Find the team document by teamId
//     const team = await Team.findOne({ teamId });
//     if (!team) {
//       throw new CustomError(`Team with ID ${teamId} not found`, 404);
//     }

//     // Loop through the leagues array in the team document
//     for (const leagueEntry of team.leagues) {
//       const leagueId = leagueEntry;

//       // Find the league document by leagueId
//       const league = await League.findOne({ leagueId });
//       if (!league) {
//         console.warn(`League with ID ${leagueId} not found. Skipping...`);
//         continue; // Skip if the league is not found
//       }

//       // Loop through the seasons array inside the league document
//       for (const season of league.seasons) {
//         try {
//           // Fetch team statistics for the current league and season
//           const statisticsData = await fetchTeamStatistics(
//             leagueId,
//             season.year,
//             teamId
//           );

//           // Save the statistics using the previously created method
//           await saveTeamStatistics(statisticsData);
//         } catch (error) {
//           console.error(
//             `Error processing stats for team ${teamId}, league ${leagueId}, season ${season.year}:`,
//             error
//           );
//         }
//       }
// //     }

//     return { success: true, message: "Team statistics processed successfully" };
//   } catch (error) {
//     throw new CustomError(
//       error.message || "Failed to process team statistics",
//       error.status || 500
//     );
//   }
// };

//create a method which will get all the team Ids of the league and then
//process team statistics by team Id(it will fetch and save statitics of team by team id for every season)
//then save team statistics

const fetchandSaveAllTeamsStatistics = async (leagueId) => {
  try {
    const league = await League.findOne({ leagueId }).select("teams.teamId");

    if (!league) {
      throw new CustomError("No league Found", 404);
    }
    console.log(league.teams);

    for (team of league.teams) {
      const teamId = team.teamId;
      await processTeamStatistics(teamId);
    }

    // // Process all teams in parallel
    // await Promise.all(
    //   league.teams.map((team) => processTeamStatistics(team.teamId))
    // );

    return { success: true, message: "Team statistics processed successfully" };
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

/**
 * Get all the statistics of a team
 * @param {*} teamId
 * @returns
 */
const getTeamStats = async (teamId) => {
  try {
    const stats = await SoccerTeamStatistics.find({ team: teamId }).select(
      "-_id -__v -createdAt -updatedAt"
    );
    if (!stats) {
      return [];
    }
    return stats;
  } catch (error) {
    throw new CustomError(error.message || "Internal Server Error", 500);
  }
};


/**
 * Get all the statistics of a team for a particular season
 * @param {*} teamId
 * @param {*} season
 * @returns
 */
const getTeamStatsOfSeason = async (teamId, season) => {
  try {
    const stats = await SoccerTeamStatistics.find({ team: teamId, season: season }).select(
      "team league season fixtures.played.total fixtures.wins.total fixtures.draw.total fixtures.loses.total form"
    );
    if (!stats || stats.length === 0) {
      return [];
    }
    return stats;
  } catch (error) {
    throw new CustomError(error.message || "Internal Server Error", 500);
  }
};


module.exports = {
  fetchandSaveAllTeamsStatistics,
  fetchTeamStatistics,
  saveTeamStatistics,
  processTeamStatistics,
  getTeamStats,
  getTeamStatsOfSeason
};
