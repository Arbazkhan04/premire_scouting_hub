const { fetchTopScorers, saveTopScorers, getTopScorers } = require("../services/leagueTopScorer.service");
const responseHandler = require("../../utils/responseHandler"); // Custom response handler

/**
 * Controller to fetch and store top scorers
 */
const fetchAndSaveTopScorers = async (req, res, next) => {
  const { leagueId, season } = req.query;

  if (!leagueId || !season) {
    return responseHandler(res, 400, "LeagueId and season are required", null);
  }

  try {
    const topScorersData = await fetchTopScorers(leagueId, season);
    await saveTopScorers(leagueId, season, topScorersData);

    return responseHandler(res, 200, "Top scorers data fetched and stored successfully", null);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get stored top scorers from DB
 */
const getStoredTopScorers = async (req, res, next) => {
  const { leagueId, season } = req.query;

  if (!leagueId || !season) {
    return responseHandler(res, 400, "LeagueId and season are required", null);
  }

  try {
    const topScorers = await getTopScorers(leagueId, season);
    return responseHandler(res, 200, "Top scorers data retrieved successfully", topScorers);
  } catch (error) {
    next(error);
  }
};

module.exports = { fetchAndSaveTopScorers, getStoredTopScorers };
