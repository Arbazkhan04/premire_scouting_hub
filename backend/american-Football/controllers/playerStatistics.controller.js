const {
    fetchAndSaveAllPlayerStatistics,
    fetchAndSaveAllTeamPlayerStatistics,
  } = require("../services/playerStatistics.service");
  const CustomError = require("../../utils/customError");
  
  /**
   * Controller to fetch and save statistics of multiple players for a season.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  const fetchAndSaveAllPlayerStatisticsController = async (req, res) => {
    try {
      const { playerIds, season } = req.body;
  
      if (!Array.isArray(playerIds) || playerIds.length === 0) {
        throw new CustomError("playerIds must be a non-empty array", 400);
      }
      if (!season) {
        throw new CustomError("season parameter is required", 400);
      }
  
      const savedStats = await fetchAndSaveAllPlayerStatistics(playerIds, season);
      return res.status(200).json({
        message: "Player statistics fetched and saved successfully",
        data: savedStats,
      });
    } catch (error) {
      console.error("Error in fetchAndSaveAllPlayerStatisticsController:", error);
      res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  };
  
  /**
   * Controller to fetch and save statistics for all team players of a season.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  const fetchAndSaveAllTeamPlayerStatisticsController = async (req, res) => {
    try {
      const { season } = req.query;
  
      if (!season) {
        throw new CustomError("season parameter is required", 400);
      }
  
      const savedStats = await fetchAndSaveAllTeamPlayerStatistics(season);
      return res.status(200).json({
        message: "Team player statistics fetched and saved successfully",
        data: savedStats,
      });
    } catch (error) {
      console.error("Error in fetchAndSaveAllTeamPlayerStatisticsController:", error);
      res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  };
  
  module.exports = {
    fetchAndSaveAllPlayerStatisticsController,
    fetchAndSaveAllTeamPlayerStatisticsController,
  };
  