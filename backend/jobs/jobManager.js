const { soccerQueue,americanFootballQueue } = require("./jobQueue");
const CustomError = require("../utils/customError");

/**
 * Get Job Details
 */
const getJobById = async (queue,jobId) => {
  try {
    const job = await queue.getJob(jobId);
    return job ? job.toJSON() : null;
  } catch (error) {
    throw new CustomError(
      error.message || "Error getting job details",
      error.statusCode || 500
    );
  }
};

/**
 * Remove a Job
 */
const removeJob = async (queue,jobId) => {
  try {
    const job = await queue.getJob(jobId);
    if (job) {
      await job.remove();
    } else {
      throw new CustomError("Job not found", 404);
    }
  } catch (error) {
    throw new CustomError(
      error.message || "Error removing job",
      error.statusCode || 500
    );
  }
};

/**
 * Retry a Failed Job
 */
const retryJob = async (queue,jobId) => {
  try {
    const job = await queue.getJob(jobId);
    if (job) {
      await job.retry();
    } else {
      throw new CustomError("Job not found", 404);
    }
  } catch (error) {
    throw new CustomError(
      error.message || "Error retrying job",
      error.statusCode || 500
    );
  }
};

/**
 * Remove all jobs with a specific name
 * @param {string} jobName - Name of the job to remove
 */
const removeJobsByName = async (queue,jobName) => {
  try {
    // Get all waiting, delayed, and active jobs
    const jobs = await queue.getJobs(["waiting", "delayed", "active"]);

    for (const job of jobs) {
      if (job.name === jobName) {
        await job.remove();
        console.log(`🗑️ Removed job: ${job.name} (ID: ${job.id})`);
      }
    }
  } catch (error) {
    console.log(`❌ Error removing jobs with name "${jobName}"`, error.message);

    throw new CustomError(
     error.message || `Error removing jobs with name "${jobName}"`,
      error.statusCode || 500
    );
  }
};

/**
 * Remove a Recurring Job
 * @param {string} schedulerId - Unique identifier for the job scheduler
 */
const removeRecurringJob = async (queue,schedulerId) => {
  try {
    const result = await queue.removeJobScheduler(schedulerId);
    if (result) {
      console.log(`🛑 Recurring job scheduler "${schedulerId}" removed`);
    } else {
      console.log(`⚠️ No recurring job scheduler found with ID "${schedulerId}"`);
    }
  } catch (error) {
    throw new CustomError(
      `Failed to remove recurring job scheduler "${schedulerId}"`,
      error.statusCode || 500
    );
  }
};

module.exports = {
  getJobById,
  removeJob,
  retryJob,
  removeJobsByName,
  removeRecurringJob,
};
