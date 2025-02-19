const axios = require("axios");
const CustomError = require("../../utils/customError");
const SoccerLeagueStandings = require("../models/leagueStandings.model");
const { apiRequest } = require("../../utils/apiRequest");

/**
 * Fetch league standings from external API
 * @param {string} leagueId
 * @param {string} season
 * @returns {Object} League standings data
 */
const getLeagueStandings = async (leagueId, season) => {
  try {
    // Prepare API request parameters
    const params = {
      league: leagueId.toString(),
      season: season.toString(),
    };

    // const response = await apiRequest(
    //   "https://api-american-football.p.rapidapi.com/players/statistics",
    //   { id: playerId, season: season },
    //   {
    //     "x-rapidapi-key": process.env.AMERICAN_FOOTBALL_API_KEY,
    //     "x-rapidapi-host": "api-american-football.p.rapidapi.com",
    //   }
    // );

    // Fetch data using the apiRequest utility
    const responseData = await apiRequest(
      "https://api-football-v1.p.rapidapi.com/v3/standings",
      params,
      {
        "x-rapidapi-key": process.env.SOCCER_API_KEY,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      }
    );

    if (!responseData || responseData.results === 0) {
      return {
        message: `No league standings found for league ${leagueId} season ${season}`,
        date: null,
      };
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Error fetching league standings:", error.message);

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

/**
 * Save league standings to the database
 * @param {Object} data League standings data
 * @returns {Object} Saved standings
 */
const saveStandings = async (data) => {
  try {
    const standings = data.data.response;

    if (!standings || standings.length === 0) {
      console.log("No standings data available.");
      return { success: true, message: "No data available to save." };
    }

    const leagueData = standings[0].league;
    const standingsData = {
      leagueId: leagueData.id.toString(),
      season: leagueData.season,
      country: leagueData.country,
      leagueName: leagueData.name,
      standings: leagueData.standings[0] || [],
    };

    // Save or update the standings document
    const savedStandings = await SoccerLeagueStandings.findOneAndUpdate(
      { leagueId: standingsData.leagueId, season: standingsData.season },
      standingsData,
      { upsert: true, new: true }
    );

    return { success: true, data: savedStandings };
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to save league standings.",
      error.status || 500
    );
  }
};

/**
 * Fetch and save league standings for a specific league and season
 * @param {string} leagueId
 * @param {string} season
 * @returns {Object} Success message
 */
const fetchAndSaveLeagueStandings = async (leagueId, season) => {
  try {
    const response = await getLeagueStandings(leagueId, season);
    if (
      !response.data ||
      !response.data.response ||
      response.data.response.length === 0
    ) {
      return { message: "No standings data found", data: null };
    }
    await saveStandings(response);
    return {
      success: true,
      message: "League standings processed successfully",
    };
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to process league standings",
      error.status || 500
    );
  }
};

/**
 * Retrieve all league standings with selected fields including top scorers
 * @returns {Array} Filtered League standings with top scorers
 */
const getFilteredLeagueStandings = async () => {
  try {
    const standings = await SoccerLeagueStandings.find()
      .populate({
        path: "topScorers",
        select:
          "season leagueId players.player.id players.player.name players.player.photo",
      })
      .select(
        "leagueId season leagueName standings.rank standings.points standings.goalsDiff standings.team standings.form"
      );

    if (!standings || standings.length === 0) {
      return [];
    }

    return standings;
  } catch (error) {
    throw new CustomError(error.message || "Internal Server Error", 500);
  }
};

/**
 * Retrieve league standings for a specific season
 * @param {string} leagueId
 * @param {string} season
 * @returns {Array} League standings of the season
 */
const getLeagueStandingsOfSeason = async (leagueId, season) => {
  try {
    const standings = await SoccerLeagueStandings.find({
      league: leagueId,
      season: season,
    }).select("league season standings");

    if (!standings || standings.length === 0) {
      return [];
    }
    return standings;
  } catch (error) {
    throw new CustomError(error.message || "Internal Server Error", 500);
  }
};

/**
 * Update the topScorers field in SoccerLeagueStandings
 * @param {Number} leagueId - League ID
 * @param {Number} season - Season year
 * @param {mongoose.Types.ObjectId} topScorerId - ObjectId of the top scorer document
 */
const updateTopScorersReference = async (leagueId, season, topScorerId) => {
  try {
    const updatedLeagueStandings = await SoccerLeagueStandings.findOneAndUpdate(
      { leagueId, season }, // Find the document
      { $set: { topScorers: topScorerId } }, // Update topScorers field
      { new: true } // Return updated document
    );

    if (!updatedLeagueStandings) {
      return {
        message: "Standings for this league Season not exist",
        data: null,
      };

      // throw new CustomError("League standings not found for given leagueId and season", 404);
    }

    return {
      message: "Top scorers reference updated successfully",
      data: updatedLeagueStandings,
    };
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

module.exports = {
  getLeagueStandings,
  saveStandings,
  fetchAndSaveLeagueStandings,
  getFilteredLeagueStandings,
  getLeagueStandingsOfSeason,
  updateTopScorersReference,
};
