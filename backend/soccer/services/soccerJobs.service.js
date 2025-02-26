const { removeJobsByName, removeRecurringJob } = require("../../jobs/jobManager");
const { addJob, scheduleRecurringJob, soccerQueue } = require("../../jobs/jobQueue");
const {
  upcomingFixtures,
  getAllUpcomingFixtures,
  processLiveFixtures,
} = require("../services/fixtures.service");
const moment = require("moment");
const CustomError = require("../../utils/customError");

/**
 * Initialize all recurring jobs when the server starts.
 */
const initJobSchedulers = () => {
  console.log("⏳ Initializing recurring jobs...");

  // Schedule the upcoming fixtures job (runs every 24 hours)
  scheduleRecurringJob(soccerQueue, "fetchUpcomingFixtures", {}, 24 * 60 * 60 * 1000);

  // Schedule the upcoming fixture odds job (runs every 4 hours)
  scheduleRecurringJob(soccerQueue,"fetchUpcomingFixtureOdds", {}, 4 * 60 * 60 * 1000);

  console.log("✅ All recurring jobs scheduled!");
};

/**
 * Start a recurring job to fetch live scores every minute when the match begins.
 */
const scheduleLiveScoreRecurringJob = async () => {
  console.log("✅ Starting live score job (every 1 minute)...");
  await scheduleRecurringJob(soccerQueue,"fetchLiveScores", {}, 60 * 1000);

  //remove job
  // await removeJobsByName(soccerQueue,"startLiveScorePolling");
};







/**
 * Fetch upcoming fixtures, find the earliest one, and schedule a job to start live polling.
 * 
 * This method:
 * 1. Fetches upcoming fixtures and updates the database.
 * 2. Retrieves the latest upcoming fixtures from `getAllUpcomingFixtures()`.
 * 3. Identifies the earliest fixture set to start.
 * 4. If a live match is already in progress, starts recurring live score polling.
 * 5. Otherwise, schedules a one-time job to start polling when the match begins.
 * 6. Implements custom error handling.
 * 
 * @throws {CustomError} - If fetching fixtures or scheduling the job fails.
 */
const scheduleLiveScoreJob = async () => {
  try {
    console.log("🔄 Fetching and updating upcoming fixtures...");

    // Step 1: Fetch and update upcoming fixtures
    await upcomingFixtures();

    // Step 2: Retrieve the latest upcoming fixtures from the database
    const upcomingFixturesByLeague = await getAllUpcomingFixtures();

    // Flatten the fixtures array from grouped leagues
    const allUpcomingFixtures = upcomingFixturesByLeague.flatMap(league => league.fixtures);

    if (!allUpcomingFixtures.length) {
      console.log("⚠️ No upcoming fixtures found. No live score job scheduled.");
      return;
    }

    // Step 3: Find the earliest upcoming fixture
    const nowUtc = moment.utc();
    const sortedFixtures = allUpcomingFixtures.sort((a, b) => 
      moment.utc(a.date).diff(moment.utc(b.date))
    );

    const earliestFixture = sortedFixtures[0];

    if (!earliestFixture) {
      console.log("⚠️ No valid earliest fixture found.");
      return;
    }

    console.log(`📌 Earliest fixture found: ${earliestFixture.fixtureId} at ${earliestFixture.date}`);

    // Step 4: Check if live fixtures are already running
    const checkLiveFixtures = await processLiveFixtures();
    if (checkLiveFixtures.length > 0) {
      console.log("⚠️ Live fixtures are already running, scheduling live job now...");
      await scheduleLiveScoreRecurringJob();
      return;
    }

    // Step 5: Calculate delay for scheduling (start 1 minute before match time)
    const matchTimeUtc = moment.utc(earliestFixture.date);
    const delayInMs = matchTimeUtc.diff(nowUtc) - 60 * 1000;

    if (delayInMs <= 0) {
      console.log("⚠️ Earliest match is already starting or past. Starting live score polling now...");

      // Remove existing polling jobs before starting fresh
      await removeJobsByName(soccerQueue, "startLiveScorePolling");
      await removeRecurringJob(soccerQueue, "fetchLiveScores-scheduler");

      await scheduleLiveScoreRecurringJob();
      return;
    }

    console.log(
      `⏳ Scheduling 'startLiveScorePolling' job at ${matchTimeUtc.format()} (in ${
        delayInMs / 60000
      } minutes)`
    );

    // Step 6: Remove existing polling jobs before scheduling a new one
    await removeJobsByName(soccerQueue, "startLiveScorePolling");
    await removeRecurringJob(soccerQueue, "fetchLiveScores-scheduler");

    // Step 7: Schedule a one-time job that will start live polling when the match begins
    await addJob(soccerQueue, "startLiveScorePolling", {}, delayInMs);

    console.log("✅ Live score polling job scheduled successfully.");
  } catch (error) {
    console.error("❌ Error scheduling live score job:", error.message);
    throw new CustomError(error.message || "Failed to schedule live score job", 500);
  }
};






module.exports = {
  initJobSchedulers,
  scheduleLiveScoreJob,
  scheduleLiveScoreRecurringJob,
};
