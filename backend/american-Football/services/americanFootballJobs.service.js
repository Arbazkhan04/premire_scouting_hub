const { removeJobsByName } = require("../../jobs/jobManager");
const { addJob, scheduleRecurringJob, americanFootballQueue, soccerQueue } = require("../../jobs/jobQueue");
const moment = require("moment");
const AmericanFootballGame = require("../models/game.model");
const { fetchAndSaveGames } = require("./games.service");



/**
 * Initialize all recurring jobs when the server starts.
 */
const initAmericanFootballJobSchedulers =async () => {

    console.log("⏳ Initializing recurring jobs...");
  
    // Schedule the upcoming fixtures job (runs every 24 hours)
    scheduleRecurringJob(americanFootballQueue,"fetchGames", {}, 24 * 60 * 60 * 1000);

  await fetchGamesJobWorker()
    // // Schedule the upcoming fixture odds job (runs every 4 hours)
    // scheduleRecurringJob("fetchUpcomingFixtureOdds", {}, 4 * 60 * 60 * 1000);
  
    console.log("✅ All american football recurring jobs scheduled!");
  };







/**
 * Fetch games, find the earliest upcoming one, and schedule a job for live polling.
 */
const fetchGamesJobWorker = async () => {
  try {
    console.log("🔄 Fetching and saving American football games...");

    // Step 1: Fetch and save all games from API
    await fetchAndSaveGames();

    // Step 2: Get the nearest upcoming game
    const earliestGame = await getEarliestUpcomingGame();

    if (!earliestGame) {
      console.log("⚠️ No upcoming games found. No live score job scheduled.");
      return;
    }
    

    // Step 3: Get current UTC time and match start time
    const nowUtc = moment.utc();
    const gameStartTimeUtc = moment.utc(earliestGame.date);

    // Step 4: Calculate delay time (1 minute before match starts)
    const delayInMs = gameStartTimeUtc.diff(nowUtc) - 60 * 1000;

    if (delayInMs <= 0) {
      console.log("⚠️ Game is already starting or past, starting live score job now...");
      await scheduleLiveScoreRecurringJob()
      return;
    }

    console.log(
      `⏳ Scheduling 'startAmericanFootballLiveScorePolling' job for Game ID ${earliestGame.gameId} at ${gameStartTimeUtc.format()} (in ${
        delayInMs / 60000
      } minutes)`
    );

    // Step 5: Schedule a one-time job that will start live polling when the match begins
    await addJob(americanFootballQueue, "startAmericanFootballLiveScorePolling", {}, delayInMs);
  } catch (error) {
    console.error("❌ Error scheduling live score job:", error.message);
  }
};




/**
 * Start a recurring job to fetch live scores every minute when the match begins.
 */
const scheduleLiveScoreRecurringJob = async () => {
    console.log("✅ Starting american football live score job (every 1 minute)...");
    await scheduleRecurringJob(americanFootballQueue,"fetchAmericanFootballLiveScores", {}, 60 * 1000);
  
    //remove job
    await removeJobsByName(soccerQueue,"startAmericanFootballLiveScorePolling");
  };

  





/**
 * Get the nearest upcoming game to start.
 * @returns {Promise<Object|null>} - The earliest upcoming game or null if no games found.
 */
const getEarliestUpcomingGame = async () => {
  try {
    console.log("🔄 Fetching upcoming games...");

    // Step 1: Fetch all upcoming games where status is "Not Started (NS)"
    const upcomingGames = await AmericanFootballGame.find({
      "status.short": "NS",
    })
      .sort({ date: 1 }) // Sort by earliest start time
      .lean(); // Convert to plain objects for performance boost

    if (!upcomingGames.length) {
      console.log("⚠️ No upcoming games found.");
      return null;
    }

    // Step 2: Get the current UTC time
    const nowUtc = moment.utc();

    // Step 3: Find the nearest game to start
    const nearestGame = upcomingGames.find((game) =>
      moment.utc(game.date).isAfter(nowUtc)
    );

    if (!nearestGame) {
      console.log("⚠️ No upcoming games found that are ahead of UTC time.");
      return null;
    }

    console.log(
      `✅ Earliest upcoming game found: ${nearestGame.gameId} starting at ${nearestGame.date}`
    );
    return nearestGame;
  } catch (error) {
    console.error("❌ Error fetching earliest upcoming game:", error.message);
    throw new CustomError("Failed to fetch earliest upcoming game", 500);
  }
};



module.exports = { initAmericanFootballJobSchedulers, fetchGamesJobWorker };