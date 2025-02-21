const { scheduleRecurringJob } = require("../../jobs/jobQueue");
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

module.exports ={ initJobSchedulers};
