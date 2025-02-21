const { addJob } = require("../jobs/jobQueue");

/**
 * Schedule a delayed task
 * @param {string} jobName - Name of the Job
 * @param {object} data - Payload for the Job
 * @param {number} delay - Delay in milliseconds
 */
const scheduleJob = (jobName, data, delay) => {
  addJob(jobName, data, delay);
};

module.exports = scheduleJob;
