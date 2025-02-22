const { fetchUpcomingFixtureOdds } = require("../services/odds.service");
const CustomError = require("../../utils/customError");

/**
 * Controller to fetch and update odds for all upcoming fixtures.
 * @route GET /api/v1/soccer/odds/upcoming
 * @returns {JSON} - List of updated odds for upcoming fixtures.
 */
const fetchUpcomingFixtureOddsController = async (req, res, next) => {
  try {
    console.log("📌 Fetching upcoming fixture odds...");

    // Fetch updated odds for upcoming fixtures
    const updatedOdds = await fetchUpcomingFixtureOdds();

    return res.status(200).json({
      success: true,
      message: "Upcoming fixture odds fetched and updated successfully",
      data: updatedOdds,
    });
  } catch (error) {
    console.error(
      "❌ Error in upcoming fixture odds controller:",
      error.message
    );
    next(
      new CustomError(
        error.message || "Failed to fetch upcoming fixture odds",
        error.statusCode || 500
      )
    );
  }
};

module.exports = {
  fetchUpcomingFixtureOddsController,
};
