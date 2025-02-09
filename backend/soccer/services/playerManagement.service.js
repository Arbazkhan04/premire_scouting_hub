const axios = require("axios");
const Player = require("../models/player.model");
const {
  fetchAndSaveAllPlayerStatistics,
} = require("../services/playerStatistics.service");
const CustomError = require("../../utils/customError");

/**
 * Insert or Update a Player in the Database.
 * @param {Object} playerData - Data of the player to insert or update.
 * @returns {Promise<Object>} - The created or updated player document.
 */
const insertOrUpdatePlayer = async (playerData) => {
  try {
    // const { playerId } = playerData;

    // Save or update player in the database
    const savedPlayer = await Player.findOneAndUpdate(
      { playerId:playerData?.id }, // Filter criteria
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
      "x-rapidapi-key": process.env.SOCCER_API_KEY,
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

/**
 * fetch player Profile using playerId
 * @param {string} playerId - The player's Id
 * @returns {Promise<Object>} - Player data from the API.
 */
const fetchPlayerProfile = async (playerId) => {
  if (!playerId) {
    throw new CustomError("Player Id is required", 400);
  }

  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/players/profiles",
    params: { player: playerId },
    headers: {
      "x-rapidapi-key": process.env.SOCCER_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response?.data?.response[0].player;
  } catch (error) {
    console.error("Error fetching player profile:", error.message);
    throw new CustomError("Failed to fetch player profile", 500);
  }
};

/**
 * Fetch player seasons by playerId.
 * @param {string} playerId - The ID of the player.
 * @returns {Promise<Array>} - Array of seasons the player has played.
 */
const fetchPlayerSeasons = async (playerId) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/players/seasons",
    params: { player: playerId },
    headers: {
      "x-rapidapi-key": process.env.SOCCER_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const data = response.data;

    // Check if response data is available
    if (!data || !data.response || data.response.length === 0) {
      throw new CustomError("No seasons found for this player", 404);
    }

    return data.response; // Returning an array of seasons
  } catch (error) {
    throw new CustomError(
      error.message || "Error fetching player seasons",
      error.response ? error.response.status : 500
    );
  }
};

/**
 * Fetch and Save All Data(Profile,Seasons,Statistics) of Player
 * @param {string} playerId
 */

const fetchandSaveAllPlayerData = async (playerId) => {
  try {
    //fetch profile of Player
    const playerProfile = await fetchPlayerProfile(playerId);

    //fetch player Seasons
    const playerSeasons = await fetchPlayerSeasons(playerId);

    playerProfile.seasons = playerSeasons;

    //save user profile in db
    const saveProfile = await insertOrUpdatePlayer(playerProfile);

    //fetch and Save player statistics for all seasons
    const playerStatistics = await fetchAndSaveAllPlayerStatistics(playerId);

    //return the user profile from db
    const userProfile = await Player.find({ playerId });

    return userProfile;
  } catch (error) {
    throw new CustomError(
      error.message || "Error in fetch and save all player data",
      error.response ? error.response.status : 500
    );
  }
};

/**
 * Fetch Player Profile with Stats
 * @param {string} playerId
 */

const getPlayerProfilewithStats = async (playerId) => {
  try {
    //search from db
    const player = await Player.findOne({ playerId:playerId });

    if (player) {
      return player;
    }

   //if not in db then fetch from external api, save player data and then return
   const fetchandSavePlayer=await fetchandSaveAllPlayerData(playerId)

    return fetchandSavePlayer
  } catch (error) {
    throw new CustomError(
      error.message || "Error in fetch and save all player data",
      error.response ? error.response.status : 500
    );
  }
};

module.exports = {
  searchPlayer,
  insertOrUpdatePlayer,
  fetchPlayerSeasons,
  fetchandSaveAllPlayerData,
  getPlayerProfilewithStats
};
