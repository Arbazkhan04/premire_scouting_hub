const axios = require("axios");
const TopScorer = require("../models/leagueTopScorers.model");
const CustomError = require("../../utils/customError"); // Custom error handler
const { updateTopScorersReference } = require("./leagueStandings.service");

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

    if (
      !response.data ||
      !response.data.response ||
      response.data.response.length === 0
    ) {
      return null;
    }

    return response.data.response; // Returning only the 'response' array
  } catch (error) {
    throw new CustomError(error.message, error.response?.status || 500);
  }
};

/**
 * Save or update top scorers data in MongoDB
 */
const saveTopScorers = async (leagueId, season, topScorersData) => {
  try {
    const formattedData = {
      leagueId,
      season,
      players: topScorersData, // Directly storing the response array as 'players'
    };

    const updatedTopScorers = await TopScorer.findOneAndUpdate(
      { leagueId, season }, // Match criteria
      { $set: formattedData }, // Update fields
      { upsert: true, new: true }
    );
    // console.log(updatedTopScorers);

    //add this document id to league standings field
    await updateTopScorersReference(leagueId, season, updatedTopScorers._id);
    return {
      message: "Top scorers data stored successfully",
      data: updatedTopScorers,
    };
  } catch (error) {
    throw new CustomError(error.message, error.response?.status || 500);
  }
};

/**
 * Get stored top scorers from database
 */
const getTopScorers = async (leagueId, season) => {
  try {
    const topScorers = await TopScorer.findOne({
      leagueId,
      season,
    });

    if (!topScorers) {
      throw new CustomError("No top scorers data found", 404);
    }

    return topScorers;
  } catch (error) {
    throw new CustomError(500, error.message);
  }
};

/**
 * Fetch and save top scorers data for a given league and season
 */
const fetchAndSaveLeagueTopScorers = async (leagueId, season) => {
  try {
    // Fetch top scorers from the API
    const topScorersData = await fetchTopScorers(leagueId, season);
    if (!topScorersData) {
      return { message: "No top scorers data found", data: null };
    }
    // Save top scorers data to the database
    const saveResult = await saveTopScorers(leagueId, season, topScorersData);

    return saveResult; // Return the result from the saveTopScorers method
  } catch (error) {
    throw new CustomError(error.message, error.response?.status || 500);
  }
};

module.exports = {
  fetchAndSaveLeagueTopScorers,
  fetchTopScorers,
  saveTopScorers,
  getTopScorers,
};
