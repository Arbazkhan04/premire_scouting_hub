const axios = require("axios");
const Player=require("../models/player.model")
const CustomError = require("../../utils/customError"); // Assuming you have a CustomError class

/**
 * Insert or Update a Player in the Database.
 * @param {Object} playerData - Data of the player to insert or update.
 * @returns {Promise<Object>} - The created or updated player document.
 */
const insertOrUpdatePlayer = async (playerData) => {
  try {
    const { playerId } = playerData;

    // Save or update player in the database
    const savedPlayer = await Player.findOneAndUpdate(
      { playerId }, // Filter criteria
      { $set: playerData }, // Only update provided fields
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options
    );

    return savedPlayer;
  } catch (error) {
    throw new Error(`Error in insertOrUpdatePlayer: ${error.message}`);
  }
};

/**
 * Search for a player using the external API.
 * @param {string} query - The player's name to search for.
 * @returns {Promise<Object>} - Player data from the API.
 */
const searchPlayer = async (query) => {
  if (!query) {
    throw new CustomError("Search query is required", 400);
  }

  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/players/profiles",
    params: { search: query },
    headers: {
      "x-rapidapi-key": process.env.SOCCER_API_KEY, // Use env variable for security
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response?.data?.response;
  } catch (error) {
    console.error("Error fetching player data:", error.message);
    throw new CustomError("Failed to fetch player data", 500);
  }
};







module.exports = { searchPlayer, insertOrUpdatePlayer};
