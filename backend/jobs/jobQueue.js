const { Queue } = require("bullmq");
const redis = require("../config/redis");

// Create a job queue
const jobQueue = new Queue("delayedJobsQueue", { connection: redis });

/**
 * Add a job to the queue.
 * @param {string} jobName - Job identifier
 * @param {object} payload - Job data
 * @param {number} delay - Delay time in milliseconds
 */
const addJob = async (jobName, payload, delay) => {
  await jobQueue.add(jobName, payload, { delay });
  console.log(`✅ Job scheduled: ${jobName} in ${delay / 1000} seconds`);
};

module.exports = { jobQueue, addJob };
