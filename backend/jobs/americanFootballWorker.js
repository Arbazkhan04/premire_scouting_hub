const { Worker } = require("bullmq");
const redis = require("../config/redis");
const axios = require("axios");
const {processUpcomingFixturesandEmit, processLiveFixturesAndEmit} =require("../soccer/services/fixtures.service");
const { scheduleLiveScoreRecurringJob } = require("../american-Football/services/americanFootballJobs.service");
const { fetchGamesJobWorker } = require("../american-Football/services/americanFootballJobs.service");
const { processLiveGamesAndEmit, fetchUpcomingGamesAndEmit } = require("../american-Football/services/games.service");

// Create a worker to process jobs
const soccerWorker = new Worker(
  "americanFootballJobQueue",
  async (job) => {
    console.log(`🚀 Executing Job: ${job.name}`);

    try {
      switch (job.name) {
        case "fetchGames":
          console.log("📅 Fetching and saving american football games => job");
         await fetchGamesJobWorker()
          // console.log(`✅ Live scores updated:`, scoresResponse.data);
          break;

        case "startAmericanFootballLiveScorePolling":
          console.log("📧 Start Live Score Polling");
         await scheduleLiveScoreRecurringJob()
          // console.log(`✅ Email sent successfully:`, emailResponse.data);
          break;

        case "fetchAmericanFootballLiveScores":
          console.log("📄 Startred Fetchlive score job started");
          await processLiveGamesAndEmit()
          break;

          
          case "processUpcomingGamesandEmit":
            console.log("📄 Startred Fetchlive score job started");
            await fetchUpcomingGamesAndEmit()
            break;

        default:
          console.log(`⚠️ Unknown job type: ${job.name}`);
      }
    } catch (error) {
      console.error(`❌ Job Failed: ${job.name}`, error.message);
      throw error; // Ensure BullMQ triggers retry
    }
  },
  {
    connection: redis,
    concurrency: 5, // Process up to 5 jobs in parallel
    settings: {
      backoffStrategies: {
        exponential: (attemptsMade) => Math.pow(2, attemptsMade) * 1000, // Exponential backoff
      },
    },
  }
);

// Handle job retries
soccerWorker.on("failed", async (job, err) => {
  console.error(`❌ Job ${job.name} failed after attempt ${job.attemptsMade}:`, err.message);
});

// Log when a job completes
soccerWorker.on("completed", (job) => {
  console.log(`✅ Job completed successfully: ${job.name}`);
});

console.log("✅ Worker started, waiting for jobs...");
