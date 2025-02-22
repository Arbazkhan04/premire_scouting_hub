const {
  getAllUpcomingFixtures,
  processLiveFixtures,
} = require("../services/fixtures.service");
const CustomError = require("../../utils/customError");

/**
 * Controller to get all upcoming fixtures
 * @route GET /api/v1/soccer/fixtures/upcoming
 * @returns {JSON} - List of updated upcoming fixtures.
 */
const getUpcomingFixturesController = async (req, res, next) => {
  try {
    console.log("📌 Fetching upcoming fixtures...");

    // Fetch updated upcoming fixtures
    const upcomingFixtures = await getAllUpcomingFixtures();

    return res.status(200).json({
      success: true,
      message:
        upcomingFixtures.length > 0
          ? "Upcoming fixtures fetched successfully"
          : "No upcoming fixtures found",
      data: upcomingFixtures,
    });
  } catch (error) {
    console.error("❌ Error in upcoming fixtures controller:", error.message);
    next(
      new CustomError(
        error.message || "Failed to fetch upcoming fixtures",
        error.statusCode || 500
      )
    );
  }
};

/**
 * Controller to fetch and update live fixtures.
 *
 * This endpoint:
 * 1. Calls `processLiveFixtures()` to get and update live fixture details.
 * 2. Returns the updated live fixture data in JSON format.
 * 3. Handles errors properly.
 *
 * @route GET /api/v1/soccer/fixtures/live
 * @returns {JSON} - List of updated live fixtures.
 */
const getAllLiveFixturesController = async (req, res, next) => {
  try {
    console.log("📌 Fetching live fixtures...");

    // Fetch and update live fixtures
    const liveFixtures = await processLiveFixtures();

    return res.status(200).json({
      success: true,
      message:
        liveFixtures.length > 0
          ? "Live fixtures fetched and updated successfully"
          : "No live fixtures found",
      data: liveFixtures,
    });
  } catch (error) {
    console.error("❌ Error in live fixtures controller:", error.message);
    next(
      new CustomError(
        error.message || "Failed to fetch live fixtures",
        error.statusCode || 500
      )
    );
  }
};

module.exports = {
  getUpcomingFixturesController,
  getAllLiveFixturesController,
};
