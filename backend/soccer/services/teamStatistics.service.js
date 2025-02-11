const axios = require("axios");
const CustomError = require("../utils/CustomError"); // Ensure you have your custom error class

const fetchTeamStatistics = async (leagueId, season, teamId) => {
  try {
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/teams/statistics",
      params: {
        league: leagueId.toString(),
        season: season.toString(),
        team: teamId.toString(),
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Use environment variables for security
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    // Validate response structure
    if (!response.data || response.data.results === 0) {
      throw new CustomError(404, "No team statistics found.");
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching team statistics:", error.message);

    // Handle Axios errors or custom API errors
    if (error.response) {
      throw new CustomError(
        error.response.status,
        error.response.data.message || "API request failed."
      );
    } else {
      throw new CustomError(
        500,
        "Internal Server Error while fetching team statistics."
      );
    }
  }
};

const saveTeamStatistics = async (data) => {
  try {
    // Extract relevant team statistics response
    const teamStats = data.response;

    // Check if there is no data available
    if (!teamStats || teamStats.fixtures?.played?.total === 0) {
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

module.exports = { fetchTeamStatistics, saveTeamStatistics };
