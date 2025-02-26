const { removeJobsByName } = require("../../jobs/jobManager");
const { addJob, scheduleRecurringJob, americanFootballQueue } = require("../../jobs/jobQueue");
const moment = require("moment");



/**
 * Initialize all recurring jobs when the server starts.
 */
const initAmericanFootballJobSchedulers = () => {

    console.log("⏳ Initializing recurring jobs...");
  
    // Schedule the upcoming fixtures job (runs every 24 hours)
    scheduleRecurringJob(americanFootballQueue,"fetchGames", {}, 24 * 60 * 60 * 1000);
  
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




module.exports = { initAmericanFootballJobSchedulers, fetchGamesJobWorker };