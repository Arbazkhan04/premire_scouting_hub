const { Worker } = require("bullmq");
const redis = require("../config/redis");
const axios = require("axios");

// Create a worker to process jobs
const worker = new Worker(
  "delayedJobsQueue",
  async (job) => {
    console.log(`🚀 Executing Job: ${job.name}`);
    try {
      // Perform API Call or any async task
      const response = await axios.get(`https://api.example.com/${job.name}`);
      console.log(`✅ Job Successful:`, response.data);
    } catch (error) {
      console.error(`❌ Job Failed: ${job.name}`, error.message);
    }
  },
  { connection: redis }
);

console.log("✅ Worker started, waiting for jobs...");

