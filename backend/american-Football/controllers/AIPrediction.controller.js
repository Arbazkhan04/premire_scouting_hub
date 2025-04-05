const { 
    getAndSaveSingleGameAIPrediction, 
    getAndSaveGameAIPredictions,
    getAllAiPredictions
  } = require("../services/AIPrediction.service");
  const CustomError = require("../../utils/customError");
  
  /**
   * Controller to get and save AI prediction for a single game.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  const getSingleGamePrediction = async (req, res, next) => {
    try {
      const { gameId } = req.query;
  
      // Validate gameId
      if (!gameId) {
        throw new CustomError("Game ID is required", 400);
      }
  
      console.log(`🚀 Fetching AI prediction for game ID: ${gameId}`);
  
      // Get and save the prediction
      const prediction = await getAndSaveSingleGameAIPrediction(Number(gameId));
  
      res.status(200).json({
        success: true,
        message: "AI prediction fetched and saved successfully",
        data: prediction,
      });
    } catch (error) {
      console.error("❌ Error in getSingleGamePrediction:", error.message);
      next(error);
    }
  };
  
  /**
   * Controller to get and save AI predictions for multiple games.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  const getMultipleGamePredictions = async (req, res, next) => {
    try {
      const { gameIds } = req.body;
  
      // Validate gameIds
      if (!Array.isArray(gameIds) || gameIds.length === 0) {
        throw new CustomError("Game IDs array is required and cannot be empty", 400);
      }
  
      console.log(`🚀 Fetching AI predictions for ${gameIds.length} games`);
  
      // Get and save predictions for multiple games
      const predictions = await getAndSaveGameAIPredictions(gameIds);
  
      res.status(200).json({
        success: true,
        message: "AI predictions fetched and saved successfully",
        data: predictions,
      });
    } catch (error) {
      console.error("❌ Error in getMultipleGamePredictions:", error.message);
      next(error);
    }
  };
  



  /**
 * Controller to get all AI predictions where the match date is greater than the current date and time.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getUpcomingPredictions = async (req, res, next) => {
  try {
    console.log("🚀 Fetching upcoming AI predictions...");

    // Get all upcoming AI predictions from the service
    const upcomingPredictions = await getAllAiPredictions();

    res.status(200).json({
      success: true,
      message: "Upcoming AI predictions fetched successfully",
      data: upcomingPredictions,
    });
  } catch (error) {
    console.error("❌ Error in getUpcomingPredictions:", error.message);
    next(error);
  }
};



  module.exports = {
    getSingleGamePrediction,
    getMultipleGamePredictions,
    getUpcomingPredictions
  };
  