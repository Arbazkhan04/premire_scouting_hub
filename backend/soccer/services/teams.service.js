const mongoose = require("mongoose");
const SoccerTeam = mongoose.model("SoccerTeam");
const SoccerLeague = mongoose.model("SoccerLeague");
const axios = require("axios");
const CustomError = require("../../utils/customError");

const RAPID_API_KEY = process.env.SOCCER_API_KEY;
const RAPID_API_HOST = "https://api-football-v1.p.rapidapi.com";

const fetchTeamSeasons = async (teamId) => {
  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/v3/teams/seasons`,
    params: { team: teamId },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.response || [];
  } catch (error) {
    console.error(`Error fetching seasons for team ${teamId}:`, error.message);
    return [];
  }
};
const saveTeamInfo = async (teamData, seasons, leagueId) => {
    try {
      const team = teamData.team;
      const venue = teamData.venue;
  
      const teamInfo = {
        teamId: team.id,
        name: team.name,
        code: team.code,
        country: team.country,
        founded: team.founded,
        national: team.national,
        logo: team.logo,
        venue: venue
          ? {
              id: venue.id,
              name: venue.name,
              address: venue.address,
              city: venue.city,
              capacity: venue.capacity,
              surface: venue.surface,
              image: venue.image,
            }
          : {},
        seasons: seasons,
      };
  
      // Fetch existing team first
      let existingTeam = await SoccerTeam.findOne({ teamId: team.id });
  
      if (!existingTeam) {
        // Create new team with leagueId
        existingTeam = new SoccerTeam({ ...teamInfo, leagues: [leagueId] });
      } else {
        // Ensure leagueId is not duplicated
        if (!existingTeam.leagues.includes(leagueId)) {
          existingTeam.leagues.push(leagueId);
        }
        Object.assign(existingTeam, teamInfo); // Update team details
      }
  
      // Save the updated team
      const updatedTeam = await existingTeam.save();
  
      // Update League document: ensure unique team ID reference
      await SoccerLeague.findOneAndUpdate(
        { leagueId: leagueId },
        { $addToSet: { teams: updatedTeam._id } }, // Ensures unique team references
        { new: true }
      );
  
      return updatedTeam; // Optionally return the updated team if needed for further processing
    } catch (error) {
      console.error("Error saving team data:", error.message);
      // Throw custom error with a relevant message and status code
      throw new CustomError("Failed to save team data", 500);
    }
  };
  

const fetchAndSaveTeams = async (leagueId, season) => {
  if (!leagueId || !season) {
    throw new CustomError("League ID and Season are required", 400);
  }

  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/v3/teams`,
    params: { league: leagueId, season: season },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const teams = response.data.response;

    if (!teams || teams.length === 0) {
      throw new CustomError(`No teams found for League ID: ${leagueId} and Season: ${season}`, 404);
    }

    for (const teamData of teams) {
      const teamSeasons = await fetchTeamSeasons(teamData.team.id);
      await saveTeamInfo(teamData, teamSeasons, leagueId);
    }
  } catch (error) {
    console.error("Error fetching team data:", error.message);
    throw new CustomError("Failed to fetch and save team data", 500);
  }
};

module.exports = { fetchAndSaveTeams };
