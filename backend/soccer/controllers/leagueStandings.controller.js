const {
    getLeagueStandings,
    saveStandings,
    fetchAndSaveLeagueStandings,
    getFilteredLeagueStandings,
    getLeagueStandingsOfSeason,
  } = require("../services/leagueStandings.service");
  
  const responseHandler = require("../../utils/responseHandler");
const CustomError=require("../../utils/customError")
  
  /**
   * Controller to fetch league standings from the API.
   */
  const fetchLeagueStandings = async (req, res, next) => {
    const { leagueId, season } = req.query;
  
    if (!leagueId || !season) {
      return responseHandler(res, 400, "LeagueId and season are required", null);
    }
  
    try {
      const standings = await getLeagueStandings(leagueId, season);
      return responseHandler(res, 200, "League standings retrieved successfully", standings);
    } catch (error) {
    //   next(error);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));

    }
  };
  
  /**
   * Controller to fetch and save league standings.
   */
  const fetchAndStoreLeagueStandings = async (req, res, next) => {
    const { leagueId, season } = req.query;
  
    if (!leagueId || !season) {
      return responseHandler(res, 400, "LeagueId and season are required", null);
    }
  
    try {
      const result = await fetchAndSaveLeagueStandings(leagueId, season);
      return responseHandler(res, 200, result.message, null);
    } catch (error) {
    //   next(error);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));

    }
  };
  
  /**
   * Controller to retrieve all league standings from the database.
   */
  const getAllStandings = async (req, res, next) => {
    // const { leagueId } = req.query;
  
    // if (!leagueId) {
    //   return responseHandler(res, 400, "LeagueId is required", null);
    // }
  
    try {
      const standings = await getFilteredLeagueStandings();
      return responseHandler(res, 200, "All league standings retrieved successfully", standings);
    } catch (error) {
    //   next(error);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));

    }
  };
  
  /**
   * Controller to get league standings for a specific season.
   */
  const getStandingsBySeason = async (req, res, next) => {
    const { leagueId, season } = req.query;
  
    if (!leagueId || !season) {
      return responseHandler(res, 400, "LeagueId and season are required", null);
    }
  
    try {
      const standings = await getLeagueStandingsOfSeason(leagueId, season);
      return responseHandler(res, 200, "League standings for season retrieved successfully", standings);
    } catch (error) {
    //   next(error);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));

    }
  };
  
  module.exports = {
    fetchLeagueStandings,
    fetchAndStoreLeagueStandings,
    getAllStandings,
    getStandingsBySeason,
  };
  