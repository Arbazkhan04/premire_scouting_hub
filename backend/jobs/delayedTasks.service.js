const { addJob, scheduleRecurringJob, jobQueue } = require("../jobs/jobQueue");
const { getJobById, removeJob, retryJob, removeJobsByName, removeRecurringJob } = require("../jobs/jobManager");

/**
 * Schedule a delayed job.
 * @param {string} jobName - Name of the Job
 * @param {object} data - Payload for the Job
 * @param {number} delay - Delay in milliseconds
 */
const scheduleJob = async (jobName, data, delay) => {
  await addJob(jobName, data, delay);
};

/**
 * Schedule a recurring job.
 * @param {string} jobName - Job identifier
 * @param {object} data - Job data
 * @param {number} repeatTime - Time interval in milliseconds (e.g., 5 * 60 * 1000 for 5 minutes)
 */
const scheduleRecurringJobWrapper = async (jobName, data, repeatTime) => {
  await scheduleRecurringJob(jobName, data, repeatTime);
};

/**
 * Get job details by ID.
 * @param {string} jobId - Job ID
 * @returns {Promise<object|null>}
 */
const getJobDetails = async (jobId) => {
  return await getJobById(jobId);
};

/**
 * Remove a job by ID.
 * @param {string} jobId - Job ID
 */
const deleteJob = async (jobId) => {
  await removeJob(jobId);
};

/**
 * Retry a failed job by ID.
 * @param {string} jobId - Job ID
 */
const retryFailedJob = async (jobId) => {
  await retryJob(jobId);
};

/**
 * Remove all jobs by job name.
 * @param {string} jobName - Job Name
 */
const removeJobsByType = async (jobName) => {
  await removeJobsByName(jobName);
};

/**
 * Remove a recurring job by scheduler ID.
 * @param {string} schedulerId - Unique scheduler ID
 */
const removeScheduledJob = async (schedulerId) => {
  await removeRecurringJob(schedulerId);
};

module.exports = {
  scheduleJob,
  scheduleRecurringJobWrapper,
  getJobDetails,
  deleteJob,
  retryFailedJob,
  removeJobsByType,
  removeScheduledJob
};
