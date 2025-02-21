const { Worker } = require("bullmq");
const redis = require("../config/redis");
const axios = require("axios");
const {processUpcomingFixturesandEmit} =require("../soccer/services/fixtures.service")

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

        case "sendEmails":
          console.log("📧 Sending email...");
          const emailResponse = await axios.post("https://api.example.com/send-email", job.data);
          console.log(`✅ Email sent successfully:`, emailResponse.data);
          break;

        case "generateReport":
          console.log("📄 Generating report...");
          const reportResponse = await axios.get("https://api.example.com/generate-report");
          console.log(`✅ Report generated:`, reportResponse.data);
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
