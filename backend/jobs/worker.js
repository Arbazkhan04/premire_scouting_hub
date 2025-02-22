const { Worker } = require("bullmq");
const redis = require("../config/redis");
const axios = require("axios");
const {processUpcomingFixturesandEmit, processLiveFixturesAndEmit} =require("../soccer/services/fixtures.service");
const { scheduleLiveScoreRecurringJob } = require("../soccer/services/soccerJobs.service");

// Create a worker to process jobs
const worker = new Worker(
  "delayedJobsQueue",
  async (job) => {
    console.log(`🚀 Executing Job: ${job.name}`);

    try {
      switch (job.name) {
        case "fetchUpcomingFixtures":
          console.log("📅 Fetching upcoming fixtures...");
         await processUpcomingFixturesandEmit();
          // console.log(`✅ Live scores updated:`, scoresResponse.data);
          break;

        case "startLiveScorePolling":
          console.log("📧 Start Live Score Polling");
         await scheduleLiveScoreRecurringJob()
          // console.log(`✅ Email sent successfully:`, emailResponse.data);
          break;

        case "fetchLiveScores":
          console.log("📄 Startred Fetchlive score job started");
          await processLiveFixturesAndEmit()
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
worker.on("failed", async (job, err) => {
  console.error(`❌ Job ${job.name} failed after attempt ${job.attemptsMade}:`, err.message);
});

// Log when a job completes
worker.on("completed", (job) => {
  console.log(`✅ Job completed successfully: ${job.name}`);
});

console.log("✅ Worker started, waiting for jobs...");
