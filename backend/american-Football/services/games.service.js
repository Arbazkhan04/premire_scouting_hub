const axios = require("axios");
const CustomError = require("../../utils/customError");
const AmericanFootballGame = require("../models/game.model");
const AmericanFootballLeague = require("../models/league.model");
const {
  fetchAndSaveLeagues,
  getLatestSeasonForAllLeagues,
} = require("./leagues.service");

const RAPID_API_KEY = process.env.AMERICAN_FOOTBALL_API_KEY;
const RAPID_API_HOST = "https://api-american-football.p.rapidapi.com";

/**
 * Fetch games from API for a specific league and season.
 * @param {number} leagueId - The league ID.
 * @param {number} season - The season year.
 * @returns {Promise<Array>} - List of games from API.
 * @throws {CustomError} - Throws error if request fails.
 */
const fetchGames = async (leagueId, season) => {
  if (!leagueId || !season) {
    throw new CustomError("League ID and season are required", 400);
  }

  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/games`,
    params: { league: leagueId, season },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-american-football.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    if (!response.data || response.data.results === 0) {
      console.log(`No games found for league ${leagueId} in season ${season}`);
      return [];
    }

    return response.data.response;
  } catch (error) {
    console.error("Error fetching games from API:", error.message);
    throw new CustomError("Failed to fetch games from API", 500);
  }
};

/**
 * Insert or update games in the database.
 * @param {Array<Object>} gamesData - Array of game objects.
 * @returns {Promise<Array>} - Array of saved game documents.
 * @throws {CustomError} - Throws error if database operation fails.
 */
const insertOrUpdateGames = async (gamesData) => {
  try {
    if (!Array.isArray(gamesData) || gamesData.length === 0) {
      throw new CustomError("No valid game data provided", 400);
    }

    // Prepare bulk operations for efficiency
    const bulkOperations = gamesData.map((game) => ({
      updateOne: {
        filter: { gameId: game.game.id }, // Find by Game ID
        update: {
          $set: {
            gameId: game.game.id,
            stage: game.game.stage,
            week: game.game.week,
            date: game.game.date,
            venue: game.game.venue,
            status: game.game.status,
            league: {
              leagueId: game.league.id,
              name: game.league.name,
              season: game.league.season,
              logo: game.league.logo,
              country: game.league.country,
            },
            teams: {
              home: game.teams.home,
              away: game.teams.away,
            },
            scores: {
              home: game.scores.home,
              away: game.scores.away,
            },
          },
        },
        upsert: true, // Insert if not exists, update if exists
      },
    }));

    // Execute bulk write operation
    const result = await AmericanFootballGame.bulkWrite(bulkOperations);

    // Retrieve and return the updated or inserted documents
    const updatedGames = await AmericanFootballGame.find({
      gameId: { $in: gamesData.map((g) => g.game.id) },
    });

    console.log("✅ Games inserted/updated:", updatedGames.length);
    return updatedGames;
  } catch (error) {
    console.error("Error inserting/updating games:", error.message);
    throw new CustomError("Failed to insert/update games", 500);
  }
};

const fetchAndSaveGames = async () => {
  try {
    // Step 1: Fetch and save leagues
    console.log("🔄 Fetching and saving leagues...");
    const leagues = await fetchAndSaveLeagues();
    if (!leagues.length) {
      throw new CustomError("No leagues found after update", 404);
    }

    let allSavedGames = [];

    // Step 2: Loop through leagues and process games
    for (const league of leagues) {
      console.log(
        `📌 Processing league: ${league.name} (ID: ${league.leagueId})`
      );

      // Step 3: Sort seasons in descending order and get the latest season
      const sortedSeasons = league.seasons.sort((a, b) => b.year - a.year);
      const latestSeasonObj =
        sortedSeasons.length > 0 ? sortedSeasons[0] : null;

      if (!latestSeasonObj) {
        console.log(`❌ No seasons found for league: ${league.name}`);
        continue;
      }

      const latestSeason = latestSeasonObj.year;
      const isCurrentSeason = latestSeasonObj.current === true;

      // Fetch the league again from the database to check gamesFetched
      const leagueInDB = await AmericanFootballLeague.findOne({
        leagueId: league.leagueId,
      });

      // Find if the season exists in gamesFetched
      const fetchedSeason = leagueInDB.gamesFetched.find(
        (s) => s.season === latestSeason
      );

      if (!isCurrentSeason && fetchedSeason?.fetched) {
        console.log(
          `⚠️ Skipping league: ${league.name} (ID: ${league.leagueId}) for season ${latestSeason} as games are already fetched.`
        );
        continue; // Skip if the season is not current and games are already fetched
      }

      console.log(`➡️ Fetching games for season ${latestSeason}...`);

      // Step 4: Fetch games for this league and season
      const games = await fetchGames(league.leagueId, latestSeason);
      if (!games.length) {
        console.log(`❌ No games found for ${league.name} in ${latestSeason}`);
        continue;
      }

      // Step 5: Save or update games in DB
      const savedGames = await insertOrUpdateGames(games);
      allSavedGames = allSavedGames.concat(savedGames);

      // Step 6: Update `gamesFetched` field properly
      if (fetchedSeason) {
        // If season exists, update it
        await AmericanFootballLeague.findOneAndUpdate(
          { leagueId: league.leagueId, "gamesFetched.season": latestSeason },
          {
            $set: {
              "gamesFetched.$.fetched": true,
              "gamesFetched.$.updatedOn": new Date(),
            },
          },
          { new: true }
        );
      } else {
        // If season doesn't exist, push new entry
        await AmericanFootballLeague.findOneAndUpdate(
          { leagueId: league.leagueId },
          {
            $push: {
              gamesFetched: {
                season: latestSeason,
                fetched: true,
                updatedOn: new Date(),
              },
            },
          },
          { new: true }
        );
      }

      console.log(
        `✅ Games fetched and saved for ${league.name} (${latestSeason}).`
      );
    }

    console.log("✅ All games fetched and saved successfully.");
    return allSavedGames;
  } catch (error) {
    console.error("Error fetching and saving games:", error.message);
    throw new CustomError("Failed to process and save games", 500);
  }
};

/**
 * Get upcoming games for all leagues.
 * @returns {Promise<Object>} - List of upcoming games grouped by league.
 * @throws {CustomError} - Throws error if query fails.
 */
const getUpcomingGames = async () => {
  try {
    console.log("🔄 Fetching latest seasons for all leagues...");
    const leaguesWithLatestSeasons = await getLatestSeasonForAllLeagues();

    let upcomingGamesByLeague = [];

    for (const league of leaguesWithLatestSeasons) {
      const { leagueId, name, latestSeason } = league;

      // If no latest season or it's not current, return empty array
      if (!latestSeason || !latestSeason.current) {
        console.log(
          `⚠️ League ${name} (ID: ${leagueId}) is not in progress. Skipping.`
        );
        upcomingGamesByLeague.push({
          leagueName: name,
          season: latestSeason ? latestSeason.year : null,
          upcomingGames: [], // No games if season is not current
        });
        continue;
      }

      console.log(
        `📌 Fetching upcoming games for league: ${name} (ID: ${leagueId}) - Season: ${latestSeason.year}`
      );

      // Fetch upcoming games where status.short === "NS"
      const upcomingGames = await AmericanFootballGame.find({
        "league.leagueId": leagueId,
        "league.season": latestSeason.year,
        "status.short": "NS",
      });

      upcomingGamesByLeague.push({
        leagueName: name,
        season: latestSeason.year,
        upcomingGames: upcomingGames || [],
      });
    }

    console.log("✅ Upcoming games fetched successfully.");
    return upcomingGamesByLeague;
  } catch (error) {
    console.error("Error fetching upcoming games:", error.message);
    throw new CustomError("Failed to retrieve upcoming games", 500);
  }
};

/**
 * Get the last 10 completed games for each league.
 * @returns {Promise<Object>} - List of completed games grouped by league.
 * @throws {CustomError} - Throws error if query fails.
 */
const getCompletedGames = async () => {
  try {
    console.log("🔄 Fetching latest seasons for all leagues...");
    const leaguesWithLatestSeasons = await getLatestSeasonForAllLeagues();

    let completedGamesByLeague = [];

    for (const league of leaguesWithLatestSeasons) {
      const { leagueId, name, latestSeason } = league;

      if (!latestSeason) {
        console.log(
          `⚠️ No latest season found for league: ${name} (ID: ${leagueId}). Skipping.`
        );
        completedGamesByLeague.push({
          leagueName: name,
          season: null,
          completedGames: [],
        });
        continue;
      }

      console.log(
        `📌 Fetching completed games for league: ${name} (ID: ${leagueId}) - Season: ${latestSeason.year}`
      );

      // Fetch the last 10 completed games sorted by `date.date` (most recent first)
      const completedGames = await AmericanFootballGame.find({
        "league.leagueId": leagueId,
        "league.season": latestSeason.year,
        "status.short": "FT", // Finished games
      })
        .sort({ "date.date": -1 }) // Sort by most recent games first
        .limit(10);

      completedGamesByLeague.push({
        leagueName: name,
        season: latestSeason.year,
        completedGames: completedGames || [],
      });
    }

    console.log("✅ Completed games fetched successfully.");
    return completedGamesByLeague;
  } catch (error) {
    console.error("Error fetching completed games:", error.message);
    throw new CustomError("Failed to retrieve completed games", 500);
  }
};

/**
 * Fetch live games from the API for a specific league and season.
 * @param {number} leagueId - The league ID.
 * @param {number} season - The season year.
 * @returns {Promise<Array>} - List of live games from API.
 * @throws {CustomError} - Throws error if request fails.
 */
const fetchLiveGames = async (leagueId, season) => {
  if (!leagueId || !season) {
    throw new CustomError("League ID and season are required", 400);
  }

  const options = {
    method: "GET",
    url: `${RAPID_API_HOST}/games`,
    params: {
      league: leagueId,
      season: season,
      live: "all", // Fetch all live games
    },
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": "api-american-football.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    if (!response.data || response.data.results === 0) {
      console.log(
        `⚠️ No live games found for league ${leagueId} in season ${season}`
      );
      return [];
    }

    return response.data.response;
  } catch (error) {
    console.error("Error fetching live games from API:", error.message);
    throw new CustomError("Failed to fetch live games from API", 500);
  }
};

/**
 * Fetch live games for all active leagues and store them in the database.
 * @returns {Promise<Object>} - List of live games grouped by league.
 * @throws {CustomError} - Throws error if query fails.
 */
const processLiveGames = async () => {
  try {
    console.log("🔄 Fetching latest seasons for all leagues...");
    const leaguesWithLatestSeasons = await getLatestSeasonForAllLeagues();

    let liveGamesByLeague = {};

    for (const league of leaguesWithLatestSeasons) {
      const { leagueId, name, latestSeason } = league;

      // If no latest season or it's not current, skip live games fetching
      if (!latestSeason || !latestSeason.current) {
        console.log(
          `⚠️ League ${name} (ID: ${leagueId}) is not in progress. Skipping.`
        );
        liveGamesByLeague[leagueId] = {
          leagueName: name,
          season: latestSeason ? latestSeason.year : null,
          liveGames: [], // No live games if season is not current
        };
        continue;
      }

      console.log(
        `📌 Fetching live games for league: ${name} (ID: ${leagueId}) - Season: ${latestSeason.year}`
      );

      // Fetch live games
      const liveGames = await fetchLiveGames(leagueId, latestSeason.year);
      if (!liveGames.length) {
        console.log(
          `❌ No live games found for ${name} in season ${latestSeason.year}`
        );
        liveGamesByLeague[leagueId] = {
          leagueName: name,
          season: latestSeason.year,
          liveGames: [],
        };
        continue;
      }

      // Step 5: Save or update live games in DB
      const savedLiveGames = await insertOrUpdateGames(liveGames);

      liveGamesByLeague[leagueId] = {
        leagueName: name,
        season: latestSeason.year,
        liveGames: savedLiveGames || [],
      };

      console.log(
        `✅ Live games fetched and saved for ${name} (${latestSeason.year}).`
      );
    }

    console.log("✅ All live games fetched and processed successfully.");
    return liveGamesByLeague;
  } catch (error) {
    console.error("Error processing live games:", error.message);
    throw new CustomError("Failed to process live games", 500);
  }
};

module.exports = {
  fetchGames,
  insertOrUpdateGames,
  fetchAndSaveGames,
  getUpcomingGames,
  getCompletedGames,
  fetchLiveGames,
  processLiveGames,
};
