const axios = require("axios");
const TopScorer = require("../models/leagueTopScorers.model");
const CustomError = require("../../utils/customError"); // Custom error handler

const API_URL = "https://api-football-v1.p.rapidapi.com/v3/players/topscorers";
const API_HEADERS = {
  "x-rapidapi-key": process.env.SOCCER_API_KEY, // Ensure API key is in env
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
};

/**
 * Fetch top scorers from API
 */
const fetchTopScorers = async (leagueId, season) => {
  try {
    const response = await axios.get(API_URL, {
      params: { league: leagueId, season },
      headers: API_HEADERS,
    });

    if (!response.data || !response.data.response || response.data.response.length === 0) {
      throw new CustomError(404, "No top scorers data found");
    }

    return response.data; // Returning full API response
  } catch (error) {
    throw new CustomError(error.response?.status || 500, error.message);
  }
};

/**
 * Save or update top scorers data in MongoDB
 */
const saveTopScorers = async (leagueId, season, data) => {
  try {
    const updatedTopScorers = await TopScorer.findOneAndUpdate(
      { "parameters.league": leagueId, "parameters.season": season }, // Match criteria
      data, // New data
      { upsert: true, new: true } // Create new if not found, return updated document
    );

    return { message: "Top scorers data stored successfully", data: updatedTopScorers };
  } catch (error) {
    throw new CustomError(500, error.message);
  }
};

/**
 * Get stored top scorers from database
 */
const getTopScorers = async (leagueId, season) => {
  try {
    const topScorers = await TopScorer.findOne({
      "parameters.league": leagueId,
      "parameters.season": season,
    });

    if (!topScorers) {
      throw new CustomError(404, "No top scorers data found");
    }

    return topScorers;
  } catch (error) {
    throw new CustomError(500, error.message);
  }
};

module.exports = { fetchTopScorers, saveTopScorers, getTopScorers };
