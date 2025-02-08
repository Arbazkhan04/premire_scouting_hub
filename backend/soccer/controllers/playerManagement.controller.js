const { searchPlayer,insertOrUpdatePlayer } = require('../services/playerManagement.service');
const responseHandler = require('../../utils/responseHandler');
const CustomError=require('../../utils/customError')




/**
 * Controller to insert or update a player.
 */
const insertOrUpdatePlayerController = async (req, res, next) => {
    try {
      const playerData = req.body;
  
      if (!playerData.playerId) {
        throw new CustomError("playerId is required", 400);
      }
  
      const player = await insertOrUpdatePlayer(playerData);
      
      responseHandler(res, 200, "Player inserted or updated successfully", player);
    } catch (error) {
      console.error("Error in insertOrUpdatePlayerController:", error.message);
      next(error instanceof CustomError ? error : new CustomError(error.message, 500));
    }
  };



/**
 * Controller to search for a player.
 */
const searchPlayerController = async (req, res, next) => {
  try {
    const { query } = req.query;
    const playerData = await searchPlayer(query);
    responseHandler(res, 200, 'Player data retrieved successfully', playerData);
  } catch (error) {
    console.error('Error in searchPlayerController:', error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};

module.exports = { searchPlayerController ,insertOrUpdatePlayerController};
