const { Queue } = require("bullmq");
const redis = require("../config/redis");
const CustomError = require("../utils/customError");

// Create a job queue
const soccerQueue = new Queue("soccerJobQueue", { connection: redis });
const americanFootballQueue = new Queue("americanFootballJobQueue", { connection: redis });


/**
 * Add a job to the queue after removing any existing job with the same name.
 * @param {string} jobName - Job identifier
 * @param {object} payload - Job data
 * @param {number} delay - Delay time in milliseconds
 */
const addJob = async (queue,jobName, payload, delay) => {
  try {
    // Fetch all existing jobs in "delayed" and "waiting" states
    const existingJobs = await queue.getJobs(["delayed", "waiting"]);

    // Check if a job with the same name exists and remove it
    for (const job of existingJobs) {
      if (job.name === jobName) {
        console.log(`🗑️ Removing existing job: ${jobName}`);
        await job.remove();
      }
    }

    // Add the new job after removing any existing one
    await queue.add(jobName, payload, { delay });

    console.log(`✅ Job scheduled: ${jobName} in ${delay / 1000} seconds`);
  } catch (error) {
    console.log(`❌ Error adding job to queue: ${error.message}`);
    throw new CustomError(error.message || "Error adding job to queue", error.statusCode || 500);
  }
};




/**
 * Schedule a Recurring Job (Prevents Duplicates)
 * @param {string} jobName - Job identifier
 * @param {object} payload - Job data
 * @param {number} repeatTime - Time interval in milliseconds (e.g., 5 * 60 * 1000 for 5 minutes)
 */
const scheduleRecurringJob = async (queue,jobName, payload, repeatTime) => {
  try {
   // Fetch all existing job schedulers
   const existingSchedulers = await queue.getJobSchedulers();
 // Check if the job is already scheduled with the same repeat time
 const isAlreadyScheduled = existingSchedulers.some((scheduler) => {
  // Convert scheduler.every to a number for accurate comparison
  const schedulerEvery = Number(scheduler.every);
  return scheduler.name === jobName && schedulerEvery === repeatTime;
});

   if (isAlreadyScheduled) {
     console.log(`⚠️ Recurring job "${jobName}" is already scheduled. Skipping...`);
     return;
   }
    // Create a unique scheduler ID based on the job name
    const schedulerId = `${jobName}-scheduler`;

    // Upsert the job scheduler
    await queue.upsertJobScheduler(
      schedulerId, // Unique scheduler ID
      { every: repeatTime }, // Repeat interval
      {
        name: jobName, // Job name
        data: payload, // Job payload
        opts: {
          removeOnComplete: false, // Retain completed jobs for manual removal
          removeOnFail: false,     // Retain failed jobs for inspection
        },
      }
    );

    console.log(`⏳ Recurring job "${jobName}" scheduled to run every ${repeatTime / 1000} seconds`);
  } catch (error) {
    throw new CustomError(error.message || "Error scheduling recurring job", error.statusCode || 500);
  }
};






module.exports = { soccerQueue, americanFootballQueue , addJob, scheduleRecurringJob };
