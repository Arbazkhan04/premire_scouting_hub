// const axios = require("axios");
// const pLimit = require("p-limit");

// const limit = pLimit(10); // Allow max 10 parallel API calls
// let remainingRequests = 450; // Default, will be updated dynamically
// let lastResetTime = Date.now();

// /**
//  * Makes an API request with rate limit handling, retries, and exponential backoff.
//  * @param {string} url - The API endpoint.
//  * @param {object} params - Query parameters.
//  * @param {number} retries - Max retries for rate limit errors.
//  * @returns {Promise<object>} - API response data.
//  */
// const apiRequest = async (url, params = {}, retries = 3) => {
//   return limit(async () => {
//     let delay = 1000; // Initial retry delay

//     for (let attempt = 0; attempt <= retries; attempt++) {
//       if (remainingRequests <= 1) {
//         // If rate limit is exhausted, check for the rate limit reset time
//         let waitTime = 60000; // Default wait time of 1 minute
//         if (lastResetTime) {
//           // Check if we have a "reset" time from the API
//           const timeElapsed = Date.now() - lastResetTime;
//           if (timeElapsed < waitTime) {
//             waitTime = Math.max(60000 - timeElapsed, 1000); // Wait until the reset time, min 1 second
//           }
//         }

//         console.warn(`Rate limit low, waiting ${waitTime / 1000}s...`);
//         await new Promise((resolve) => setTimeout(resolve, waitTime)); // Wait until the rate limit resets
//       }

//       try {
//         const response = await axios.get(url, {
//           params,
//           headers: {
//             "x-rapidapi-key": process.env.SOCCER_API_KEY,
//             "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
//           },
//         });

//         // Update rate limit info
//         if (response.headers["x-ratelimit-requests-remaining"]) {
//           remainingRequests = parseInt(response.headers["x-ratelimit-requests-remaining"], 10);
//           lastResetTime = Date.now();
//         }

//         // Log remaining requests
//         console.log(`Remaining API requests: ${remainingRequests}`);

//         return response.data;
//       } catch (error) {
//         if (error.response && error.response.status === 429) {
//           console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
//           await new Promise((resolve) => setTimeout(resolve, delay));
//           delay *= 2; // Increase wait time exponentially
//         } else {
//           throw error;
//         }
//       }
//     }

//     throw new Error("Rate limit exceeded after multiple retries.");
//   });
// };

// module.exports = { apiRequest };






const axios = require("axios");
const pLimit = require("p-limit");

const limit = pLimit(10); // Allow max 10 parallel API calls
let requestsMadeThisMinute = 0; // Count of requests made in the current minute
let lastRequestTime = Date.now(); // Timestamp of the last request

/**
 * Makes an API request with rate limit handling, retries, and exponential backoff.
 * @param {string} url - The API endpoint.
 * @param {object} params - Query parameters.
 * @param {number} retries - Max retries for rate limit errors.
 * @returns {Promise<object>} - API response data.
 */
const apiRequest = async (url, params = {}, retries = 3) => {
  return limit(async () => {
    let delay = 1000; // Initial retry delay

    for (let attempt = 0; attempt <= retries; attempt++) {
      // Check if we need to wait because the number of requests made exceeds the limit for the current minute
      if (requestsMadeThisMinute >= 450) {
        const timeElapsed = Date.now() - lastRequestTime;
        let waitTime = 60000 - timeElapsed; // Time remaining for the current minute to reset

        if (waitTime > 0) {
          console.warn(`Rate limit exceeded. Waiting for ${waitTime / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime)); // Wait until the minute resets
        }

        // Reset the request count and timestamp
        requestsMadeThisMinute = 0;
        lastRequestTime = Date.now();
      }

      try {
        const response = await axios.get(url, {
          params,
          headers: {
            "x-rapidapi-key": process.env.SOCCER_API_KEY,
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          },
        });

        // Increment the number of requests made this minute
        requestsMadeThisMinute++;

        // Log remaining requests (for monitoring)
        console.log(`Remaining API requests this minute: ${450 - requestsMadeThisMinute}`);

        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          throw error;
        }
      }
    }

    throw new Error("Rate limit exceeded after multiple retries.");
  });
};

module.exports = { apiRequest };
