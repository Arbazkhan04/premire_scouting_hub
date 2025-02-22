const { removeJobsByName } = require("../../jobs/jobManager");
const { addJob, scheduleRecurringJob } = require("../../jobs/jobQueue");
const {
  upcomingFixtures,
  getAllUpcomingFixtures,
} = require("../services/fixtures.service");
const moment = require("moment");

/**
 * Initialize all recurring jobs when the server starts.
 */
const initJobSchedulers = () => {
  console.log("⏳ Initializing recurring jobs...");

  // Schedule the upcoming fixtures job (runs every 24 hours)
  scheduleRecurringJob("fetchUpcomingFixtures", {}, 24 * 60 * 60 * 1000);

  //   scheduleRecurringJob("fetchUpcomingFixtures", {}, 1 * 60 * 1000)

  console.log("✅ All recurring jobs scheduled!");
};

/**
 * Start a recurring job to fetch live scores every minute when the match begins.
 */
const scheduleLiveScoreRecurringJob = async () => {
  console.log("✅ Starting live score job (every 1 minute)...");
  await scheduleRecurringJob("fetchLiveScores", {}, 60 * 1000);

  //remove job
  await removeJobsByName("startLiveScorePolling")
};

/**
 * Fetch upcoming fixtures, find the earliest one, and schedule a job to start live polling.
 */
const scheduleLiveScoreJob = async () => {
  try {
    console.log("🔄 Fetching upcoming fixtures...");

    // Step 1: Fetch upcoming fixtures and update the database
    await upcomingFixtures();

    // Step 2: Get all upcoming fixtures from the database
    const upcomingFixturesList = await getAllUpcomingFixtures();

    if (!upcomingFixturesList.length) {
      console.log(
        "⚠️ No upcoming fixtures found. No live score job scheduled."
      );
      return;
    }

    // Step 3: Find the earliest upcoming fixture
    const nowUtc = moment.utc();
    const sortedFixtures = upcomingFixturesList.sort(
      (a, b) => moment.utc(a.date) - moment.utc(b.date)
    );
    const earliestFixture = sortedFixtures[0];

    if (!earliestFixture) {
      console.log("⚠️ No valid earliest fixture found.");
      return;
    }

    // Step 4: Calculate when to schedule the job (1 minute before match starts)
    const matchTimeUtc = moment.utc(earliestFixture.date);
    const delayInMs = matchTimeUtc.diff(nowUtc) - 60 * 1000;

    if (delayInMs <= 0) {
      console.log(
        "⚠️ Earliest match is already starting or past, scheduling live job now..."
      );
      await scheduleLiveScoreRecurringJob();
      return;
    }

    console.log(
      `⏳ Scheduling 'startLiveScorePolling' job at ${matchTimeUtc.format()} (in ${
        delayInMs / 60000
      } minutes)`
    );

    // Step 5: Schedule a one-time job that will start live polling when the match begins
    await addJob("startLiveScorePolling", {}, delayInMs);
  } catch (error) {
    console.error("❌ Error scheduling live score job:", error.message);
  }
};

module.exports = {
  initJobSchedulers,
  scheduleLiveScoreJob,
  scheduleLiveScoreRecurringJob,
};
