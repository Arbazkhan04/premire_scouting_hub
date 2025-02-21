const { jobQueue } = require("./jobQueue");

/**
 * Get Job Details
 */
const getJobById = async (jobId) => {
  const job = await jobQueue.getJob(jobId);
  return job ? job.toJSON() : null;
};

/**
 * Remove a Job
 */
const removeJob = async (jobId) => {
  const job = await jobQueue.getJob(jobId);
  if (job) await job.remove();
};

/**
 * Retry a Failed Job
 */
const retryJob = async (jobId) => {
  const job = await jobQueue.getJob(jobId);
  if (job) await job.retry();
};

module.exports = { getJobById, removeJob, retryJob };
