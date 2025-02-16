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

    // Fetch data using the apiRequest utility
    const responseData = await apiRequest(
      "https://api-football-v1.p.rapidapi.com/v3/standings",
      params
    );

    if (!responseData || responseData.results === 0) {
      throw new CustomError(404, "No league standings found.");
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
      country:leagueData.country,
      leagueName:leagueData.name,
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
    const standingsData = await getLeagueStandings(leagueId, season);
    await saveStandings(standingsData);
    return { success: true, message: "League standings processed successfully" };
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to process league standings",
      error.status || 500
    );
  }
};

/**
 * Retrieve all league standings from the database
 * @param {string} leagueId
 * @returns {Array} League standings
 */
const getAllLeagueStandingsFromDb = async (leagueId) => {
  try {
    const standings = await SoccerLeagueStandings.find({ league: leagueId }).select(
      "-_id -__v -createdAt -updatedAt"
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

module.exports = {
  getLeagueStandings,
  saveStandings,
  fetchAndSaveLeagueStandings,
  getAllLeagueStandingsFromDb,
  getLeagueStandingsOfSeason,
};
