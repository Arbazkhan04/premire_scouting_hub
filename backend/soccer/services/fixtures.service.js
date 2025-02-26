const axios = require("axios");
const CustomError = require("../../utils/customError");
const SoccerFixture = require("../models/fixtures.model");
const soccerLeagues = require("../../utils/soccerLeagues");
const SocketService = require("../../sockets/socket");
const moment = require("moment"); // For UTC time handling
const { removeRecurringJob } = require("../../jobs/jobManager");
const { getInPlayOdds } = require("./odds.service");

const RAPIDAPI_KEY = process.env.SOCCER_API_KEY; // Secure API Key

/**
 * Fetch live games from API and return fixture IDs.
 * @param {string} leagueIds - Comma-separated league IDs (e.g., "39,15,253,2").
 * @returns {Promise<Array>} - Array of fixture IDs.
 * @throws {CustomError} - Throws error if request fails or no fixtures found.
 */
const getLiveGamesFixtureIds = async (leagueIds = "39-15-2-253") => {
  try {
    // API request options
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      params: {
        live: leagueIds, // Pass the league IDs
      },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    // Fetch live games
    const response = await axios.request(options);

    // Check if response has valid data
    if (!response.data || response.data.results === 0) {
      return [];
    }

    // Extract fixture IDs
    const fixtureIds = response.data.response.map((game) => game.fixture.id);

    return fixtureIds;
  } catch (error) {
    console.error("Error fetching live games:", error.message);
    throw new CustomError(error.message || "Failed to fetch live games", 500);
  }
};

/**
 * Fetch fixture details for multiple fixture IDs in parallel.
 * @param {Array<number>} fixtureIds - List of fixture IDs.
 * @returns {Promise<Array>} - Array of fixture data.
 * @throws {CustomError} - Throws error if API call fails.
 */
const getFixtureDetails = async (fixtureIds) => {
  try {
    if (!fixtureIds || fixtureIds.length === 0) {
      throw new CustomError("No fixture IDs provided", 400);
    }

    // Create API requests for all fixture IDs
    const requests = fixtureIds.map((id) =>
      axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures", {
        params: { id },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        },
      })
    );

    // Execute all requests in parallel
    const responses = await Promise.all(requests);

    // Extract fixture data from responses
    const fixturesData = responses.map((response) => response.data.response[0]);

    return fixturesData;
  } catch (error) {
    console.error("Error fetching fixture details:", error.message);
    throw new CustomError(
      error.message || "Failed to fetch fixture details",
      500
    );
  }
};

// /**
//  * Insert or update fixtures in the database.
//  * @param {Array<Object>|Object} fixtureData - Single or multiple fixture objects.
//  * @returns {Promise<Array>} - Array of saved fixture documents.
//  * @throws {CustomError} - Throws error if database operation fails.
//  */
// const insertOrUpdateFixtures = async (fixtureData) => {
//   try {
//     if (!fixtureData) {
//       throw new CustomError("No fixture data provided", 400);
//     }

//     // Convert single fixture object into an array for bulk processing
//     const fixturesArray = Array.isArray(fixtureData)
//       ? fixtureData
//       : [fixtureData];

//     // Use bulk operations for efficiency
//     const bulkOperations = fixturesArray.map((fixture) => ({
//       updateOne: {
//         filter: { fixtureId: fixture.fixture.id }, // Find by fixture ID
//         update: {
//           $set: {
//             fixtureId: fixture.fixture.id,
//             date: fixture.fixture.date,
//             venue: fixture.fixture.venue,
//             status: fixture.fixture.status,
//             league: fixture.league,
//             teams: fixture.teams,
//             goals: fixture.goals,
//             score: fixture.score,
//             events: fixture.events,
//             statistics: fixture.statistics,
//             players: fixture.players,
//           },
//         },
//         upsert: true, // Insert if not exists, update if exists
//       },
//     }));

//     // Execute bulk write operation
//     const result = await SoccerFixture.bulkWrite(bulkOperations);

//     // ✅ Fetch the updated or inserted documents
//     const updatedFixtures = await SoccerFixture.find({
//       fixtureId: { $in: fixturesArray.map((f) => f.fixture.id) },
//     });

//     // console.log("✅ Fixtures inserted/updated:", updatedFixtures);
//     return updatedFixtures; // ✅ Return actual updated documents
//   } catch (error) {
//     console.error("Error inserting/updating fixtures:", error.message);
//     throw new CustomError(
//       error.message || "Failed to insert/update fixtures",
//       500
//     );
//   }
// };








const insertOrUpdateFixtures = async (fixtureData) => {
  try {
    if (!fixtureData) {
      throw new CustomError("No fixture data provided", 400);
    }

    const fixturesArray = Array.isArray(fixtureData) ? fixtureData : [fixtureData];

    const CHUNK_SIZE = 100;
    const promises = [];

    for (let i = 0; i < fixturesArray.length; i += CHUNK_SIZE) {
      const chunk = fixturesArray.slice(i, i + CHUNK_SIZE);
      const bulkOperations = chunk.map((fixture) => ({
        updateOne: {
          filter: { fixtureId: fixture.fixture.id },
          update: {
            $set: {
              fixtureId: fixture.fixture.id,
              date: fixture.fixture.date,
              venue: fixture.fixture.venue,
              status: fixture.fixture.status,
              league: fixture.league,
              teams: fixture.teams,
              goals: fixture.goals,
              score: fixture.score,
              events: fixture.events,
              statistics: fixture.statistics,
              players: fixture.players,
            },
          },
          upsert: true,
        },
      }));

      // Execute write in parallel
      promises.push(SoccerFixture.bulkWrite(bulkOperations));
    }

    await Promise.all(promises);

    console.log(`✅ ${fixturesArray.length} Fixtures inserted/updated`);
    
    return { success: true, updatedCount: fixturesArray.length };
  } catch (error) {
    console.error("Error inserting/updating fixtures:", error.message);
    throw new CustomError("Failed to insert/update fixtures", 500);
  }
};







/**
 * Fetch upcoming 10 fixtures for given league IDs.
 * @returns {Promise<Array>} - Combined list of upcoming fixtures.
 */
const getUpcomingFixtures = async () => {
  try {
    const leagueIds = Object.values(soccerLeagues); // Extract league IDs
    if (leagueIds.length === 0) {
      throw new CustomError("No leagues found in mapping.", 400);
    }

    // Create API requests for each league
    const requests = leagueIds.map((leagueId) =>
      axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures", {
        params: { league: leagueId, next: 10 },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        },
      })
    );

    // Fetch all league fixtures in parallel
    const responses = await Promise.all(requests);

    // Extract fixture IDs from responses
    const fixtureIds = responses.flatMap((response) =>
      response.data.response.map((fixture) => fixture.fixture.id)
    );

    return fixtureIds;
  } catch (error) {
    console.error("Error fetching upcoming fixtures:", error.message);
    throw new CustomError(
      error.message || "Failed to fetch upcoming fixtures",
      500
    );
  }
};

/**
 * Fetch upcoming fixtures, get their details, and save them to the database.
 *
 * This method performs the following steps:
 * 1. Fetches the upcoming fixtures for all leagues using the `getUpcomingFixtures` method.
 * 2. Retrieves detailed information for each fixture using the `getFixtureDetails` method.
 * 3. Inserts or updates the fixture details in the database using the `insertOrUpdateFixtures` method.
 * 4. Returns the saved fixture details.
 *
 * If no fixture IDs are found in the first step, it returns an empty array.
 *
 * @returns {Promise<Array>} - Array of saved fixture documents.
 * @throws {CustomError} - Throws error if any step fails.
 */
const upcomingFixtures = async () => {
  try {
    // Step 1: Fetch upcoming fixtures
    const fixtureIds = await getUpcomingFixtures();

    // If no fixture IDs are found, return an empty array
    if (!fixtureIds || fixtureIds.length === 0) {
      return [];
    }

    // Step 2: Get fixture details for all fixture IDs
    const fixtureDetails = await getFixtureDetails(fixtureIds);

    // Step 3: Insert or update fixtures in the database
    const savedFixtures = await insertOrUpdateFixtures(fixtureDetails);

    // Step 4: Return the saved fixture details
    return savedFixtures;
  } catch (error) {
    console.error("Error processing upcoming fixtures:", error.message);
    throw new CustomError(
      error.message || "Failed to process upcoming fixtures",
      500
    );
  }
};

/**
 * Process upcoming fixtures and emit them to all connected clients.
 * @throws {CustomError} - Throws error if processing or emitting fails.
 */
const processUpcomingFixturesandEmit = async () => {
  try {
    // Fetch and process fresh upcoming fixtures
    const upcomingFixturess = await upcomingFixtures();

    //get all upcoming fixtures from db
    const upcomingFixturesfromDB = await getAllUpcomingFixtures();
    console.log("Upcoming fixtures processed:", upcomingFixturesfromDB);
    // Emit the upcoming fixtures and handle the callback
    const response = {
      success: true,
      message: "Upcoming fixtures processed successfully",
      data: upcomingFixturesfromDB,
    };
    SocketService.emitToAll("upcomingFixtures", response, (ack) => {
      console.log("Acknowledgment received from clients:", ack);
    });
  } catch (error) {
    console.error("Error processing upcoming fixtures:", error.message);
    throw new CustomError(
      error.message || "Failed to process upcoming fixtures",
      500
    );
  }
};

/**
 * Get all upcoming fixtures from the database sorted by UTC time.
 *
 * This method retrieves fixtures that have `fixture.status.short == "NS"`
 * (meaning "Not Started" - Upcoming Matches) and sorts them in ascending order.
 *
 * Steps:
 * 1. Fetch upcoming fixtures from the database.
 * 2. Identify outdated fixtures (fixtures with a past UTC date).
 * 3. If outdated fixtures exist, fetch fresh details and update them.
 * 4. Fetch the updated list and sort by `fixture.date` in ascending order (earliest first).
 *
 * @returns {Promise<Array>} - Returns an array of updated, sorted upcoming fixture documents.
 * @throws {CustomError} - Throws an error if fetching or updating fails.
 */
// const getAllUpcomingFixtures = async () => {
//   try {
//     // Step 1: Fetch upcoming fixtures from the database (status "NS" means "Not Started")
//     let upcomingFixtures = await SoccerFixture.find({ "status.short": "NS" });

//     // Get current UTC time
//     const nowUtc = moment.utc();

//     // Step 2: Identify fixtures that have a past date
//     const outdatedFixtures = upcomingFixtures.filter((fixture) =>
//       moment.utc(fixture.date).isBefore(nowUtc)
//     );

//     // Step 3: If there are outdated fixtures, fetch fresh details and update
//     if (outdatedFixtures.length > 0) {
//       console.log(
//         `🔄 Updating ${outdatedFixtures.length} outdated fixtures...`
//       );

//       // Extract fixture IDs
//       const outdatedFixtureIds = outdatedFixtures.map(
//         (fixture) => fixture.fixtureId
//       );

//       // Fetch fresh details from API
//       const freshDetails = await getFixtureDetails(outdatedFixtureIds);

//       // Update the fixtures in the database
//       await insertOrUpdateFixtures(freshDetails);
//     }

//     // Step 4: Fetch the latest upcoming fixtures after updates
//     upcomingFixtures = await SoccerFixture.find({ "status.short": "NS" });

//     // ✅ Sort fixtures by UTC time (earliest first)
//     upcomingFixtures.sort((a, b) =>
//       moment.utc(a.date).diff(moment.utc(b.date))
//     );

//     console.log(
//       "✅ Returning sorted upcoming fixtures:",
//       upcomingFixtures.length
//     );
//     return upcomingFixtures;
//   } catch (error) {
//     console.error(
//       "❌ Error fetching/updating upcoming fixtures:",
//       error.message
//     );
//     throw new CustomError(
//       error.message || "Failed to retrieve upcoming fixtures",
//       500
//     );
//   }
// };

// /**
//  * Process live fixtures and update them in the database.
//  *
//  * This method performs the following steps:
//  * 1. Calls `getLiveGamesFixtureIds()` to get a list of live fixture IDs.
//  * 2. Uses `getFixtureDetails()` to fetch the latest details for each fixture.
//  * 3. Updates or inserts the fetched fixture data into the database using `insertOrUpdateFixtures()`.
//  * 4. Returns the updated live fixture details.
//  *
//  * If no live fixtures are found, an empty array is returned.
//  * If fetching details for a fixture fails, the error is logged but does not stop the process.
//  *
//  * @returns {Promise<Array>} - Returns an array of updated live fixture documents.
//  * @throws {CustomError} - Throws an error if any critical operation fails.
//  */
// const processLiveFixtures = async () => {
//   try {
//     console.log("🔄 Fetching live fixture IDs...");

//     // Step 1: Get live fixture IDs
//     const liveFixtureIds = await getLiveGamesFixtureIds();

//     // If no live fixtures are found, return an empty array
//     if (!liveFixtureIds || liveFixtureIds.length === 0) {
//       console.log("⚠️ No live fixtures found.");
//       return [];
//     }

//     console.log(
//       `📊 Found ${liveFixtureIds.length} live fixtures. Fetching details...`
//     );

//     // Step 2: Fetch fixture details
//     const liveFixturesDetails = await getFixtureDetails(liveFixtureIds);

//     // Step 3: Insert or update fixture details in the database
//     if (liveFixturesDetails.length > 0) {
//       console.log(
//         `💾 Updating ${liveFixturesDetails.length} live fixtures in the database...`
//       );
//       await insertOrUpdateFixtures(liveFixturesDetails);
//     } else {
//       console.log("⚠️ No fixture details available to update.");
//     }

//     // Step 4: Fetch and return the latest live fixtures from the database
//     const updatedLiveFixtures = await SoccerFixture.find({
//       fixtureId: { $in: liveFixtureIds },
//     });

//     console.log(
//       "✅ Returning updated live fixtures:",
//       updatedLiveFixtures.length
//     );
//     return updatedLiveFixtures;
//   } catch (error) {
//     console.error("❌ Error processing live fixtures:", error.message);
//     throw new CustomError(
//       error.message || "Failed to fetch and update live fixtures",
//       500
//     );
//   }
// };




const getAllUpcomingFixtures = async () => {
  try {
    console.log("🔄 Fetching upcoming fixtures from DB...");

    // Step 1: Fetch upcoming fixtures (status "NS" means "Not Started")
    let upcomingFixtures = await SoccerFixture.find({ "status.short": "NS" })
      .sort({ date: 1 }) // ✅ Sort by earliest match first
      .lean(); // ✅ Convert to plain objects for performance

    // If no fixtures are found, return an empty array
    if (!upcomingFixtures.length) {
      console.log("⚠️ No upcoming fixtures found.");
      return [];
    }

    // Step 2: Group fixtures by league
    const groupedFixtures = Object.entries(soccerLeagues).map(([leagueName, leagueId]) => {
      const leagueFixtures = upcomingFixtures.filter((fixture) => fixture.league.id === leagueId);

      return {
        leagueId,
        leagueName,
        fixtures: leagueFixtures,
      };
    });

    console.log(`✅ Returning upcoming fixtures for ${groupedFixtures.length} leagues.`);
    return groupedFixtures.filter((league) => league.fixtures.length > 0);
  } catch (error) {
    console.error("❌ Error fetching upcoming fixtures:", error.message);
    throw new CustomError("Failed to retrieve upcoming fixtures", 500);
  }
};



const processLiveFixtures = async () => {
  try {
    console.log("🔄 Fetching live fixture IDs...");

    // Step 1: Get live fixture IDs
    const liveFixtureIds = await getLiveGamesFixtureIds();

    if (!liveFixtureIds || liveFixtureIds.length === 0) {
      console.log("⚠️ No live fixtures found.");
      return [];
    }

    console.log(`📊 Found ${liveFixtureIds.length} live fixtures. Fetching details...`);

    // Step 2: Fetch fixture details
    const liveFixturesDetails = await getFixtureDetails(liveFixtureIds);

    // Step 3: Fetch in-play odds for all live fixtures in parallel
    console.log("🔄 Fetching in-play odds...");
    const inPlayOddsPromises = liveFixtureIds.map((fixtureId) => getInPlayOdds(fixtureId));
    const inPlayOddsResults = await Promise.allSettled(inPlayOddsPromises);

    // Step 4: Transform odds results into a map { fixtureId: oddsData }
    const inPlayOddsMap = {};
    inPlayOddsResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        inPlayOddsMap[liveFixtureIds[index]] = result.value; // Map fixture ID to odds data
      }
    });

    console.log(`✅ Mapped in-play odds to fixtures.`);

    // Step 5: Merge odds into live fixtures
    const liveFixturesWithOdds = liveFixturesDetails.map((fixture) => {
      const fixtureId = fixture.fixture.id;
      return {
        ...fixture,
        inPlayOdds: inPlayOddsMap[fixtureId] || null, // Attach in-play odds if available
      };
    });

    console.log(`✅ Returning ${liveFixturesWithOdds.length} live fixtures with odds.`);
    return liveFixturesWithOdds;
  } catch (error) {
    console.error("❌ Error processing live fixtures with odds:", error.message);
    throw new CustomError(error.message || "Failed to fetch and merge live fixtures with odds", 500);
  }
};






/**
 * Process live fixtures, update them in the database, and emit the results to all connected clients.
 *
 * This method performs the following steps:
 * 1. Calls `processLiveFixtures()` to fetch live fixture IDs, get their details, and update them in the database.
 * 2. Retrieves the latest live fixtures from the database.
 * 3. Emits the updated live fixtures using `SocketService.emitToAll()`.
 *
 * If no live fixtures are found, an empty array is returned.
 * If emitting fails, an error is logged but does not stop the process.
 *
 * @throws {CustomError} - Throws an error if updating or emitting fails.
 */
const processLiveFixturesAndEmit = async () => {
  try {
    console.log("🔄 Processing live fixtures and preparing for broadcast...");

    // Step 1: Process and update live fixtures
    const liveFixtures = await processLiveFixtures();

    if (!liveFixtures || liveFixtures.length === 0) {
      console.log("⚠️ No live fixtures available to emit.");
      //remove the recurring job
      await removeRecurringJob("fetchLiveScores-scheduler");

      const { scheduleLiveScoreJob } = require("./soccerJobs.service");

      //schedule the live score polling job
      await scheduleLiveScoreJob();
      return [];
    }

    console.log(
      `📢 Broadcasting ${liveFixtures.length} live fixtures to all clients...`
    );

    // Step 2: Emit the live fixtures using WebSockets
    const response = {
      success: true,
      message: "Live fixtures processed successfully",
      data: liveFixtures,
    };

    SocketService.emitToAll("liveFixtures", response, (ack) => {
      console.log("✅ Acknowledgment received from clients:", ack);
    });
    console.log("live fixtures", liveFixtures);
    return liveFixtures;
  } catch (error) {
    console.error(
      "❌ Error processing and emitting live fixtures:",
      error.message
    );
    throw new CustomError(
      error.message || "Failed to process and emit live fixtures",
      500
    );
  }
};

/**
 * Fetch completed fixtures (last 10 matches) for all leagues in parallel
 * and return fixture IDs where status.short === "FT".
 * @returns {Promise<Array<number>>} - Array of completed fixture IDs.
 */
const getCompletedFixtures = async () => {
  try {
    const leagueIds = Object.values(soccerLeagues); // Extract league IDs

    console.log(
      `🔄 Fetching completed fixtures for ${leagueIds.length} leagues...`
    );

    // Create an array of API requests for each league
    const requests = leagueIds.map((leagueId) =>
      axios
        .get("https://api-football-v1.p.rapidapi.com/v3/fixtures", {
          params: { league: leagueId, last: 10 }, // Fetch last 10 completed matches
          headers: {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
          },
        })
        .then((response) => ({
          leagueId,
          data: response.data.response || [],
        }))
        .catch((error) => {
          console.error(
            `⚠️ Error fetching data for League ID: ${leagueId} - ${error.message}`
          );
          return { leagueId, data: [] };
        })
    );

    // Execute all requests in parallel
    const results = await Promise.all(requests);

    // Extract and filter completed fixtures
    let completedFixtureIds = results.flatMap(({ leagueId, data }) => {
      const finishedFixtures = data.filter(
        (fixture) => fixture.fixture?.status?.short === "FT"
      );
      console.log(
        `✅ League ID: ${leagueId} - Found ${finishedFixtures.length} completed fixtures`
      );
      return finishedFixtures.map((fixture) => fixture.fixture.id);
    });

    console.log(
      `📊 Total completed fixtures found: ${completedFixtureIds.length}`
    );
    return completedFixtureIds;
  } catch (error) {
    console.error("❌ Error fetching completed fixtures:", error.message);
    throw new CustomError(
      error.message || "Failed to fetch completed fixtures",
      500
    );
  }
};

/**
 * Process finished fixtures by:
 * 1. Fetching completed fixture IDs
 * 2. Fetching fixture details
 * 3. Inserting/updating them in the database
 * 4. Returning a structured response by league name
 *
 * @returns {Promise<Object>} - Processed finished fixtures grouped by league.
 */
const processFinishedFixtures = async () => {
  try {
    console.log("🔄 Processing finished fixtures...");

    // Step 1: Get completed fixture IDs
    const completedFixtureIds = await getCompletedFixtures();

    if (!completedFixtureIds || completedFixtureIds.length === 0) {
      console.log("⚠️ No completed fixtures found.");
      return {
        success: true,
        message: "No completed fixtures found.",
        data: {},
      };
    }

    // Step 2: Fetch fixture details
    const fixtureDetails = await getFixtureDetails(completedFixtureIds);

    if (!fixtureDetails || fixtureDetails.length === 0) {
      console.log("⚠️ No fixture details available.");
      return {
        success: true,
        message: "No fixture details available.",
        data: {},
      };
    }

    // Step 3: Insert or update fixtures in the database
    const updatedFixtures = await insertOrUpdateFixtures(fixtureDetails);

    // // Step 4: Organize response by league
    // const groupedFixtures = {};

    // updatedFixtures.forEach((fixture) => {
    //   const leagueId = fixture.league.id;
    //   const leagueName = fixture.league.name;

    //   if (!groupedFixtures[leagueId]) {
    //     groupedFixtures[leagueId] = {
    //       leagueName,
    //       fixtures: [],
    //     };
    //   }

    //   groupedFixtures[leagueId].fixtures.push({
    //     fixtureId: fixture.fixtureId,
    //     date: fixture.date,
    //     homeTeam: fixture.teams.home.name,
    //     awayTeam: fixture.teams.away.name,
    //     score: fixture.score.fulltime,
    //   });
    // });

    //get all completed fixtures from db
    const completedFixturesfromDB = await getCompletedFixturesFromDB()

    console.log("✅ Finished processing completed fixtures.");
    return {
      success: true,
      message: "Finished fixtures processed successfully.",
      data: completedFixturesfromDB, // Structured response grouped by league
    };
  } catch (error) {
    console.error("❌ Error processing finished fixtures:", error.message);
    throw new CustomError(
      error.message || "Failed to process finished fixtures",
      500
    );
  }
};








/**
 * Fetch upcoming fixtures from the database where status.short == "NS".
 * Group them by league and sort by fixture time.
 *
 * @returns {Promise<Array>} - Upcoming fixtures grouped by league.
 */
const getUpcomingFixturesFromDB = async () => {
  try {
    console.log("🔄 Fetching upcoming fixtures from DB...");

    // Step 1: Retrieve all upcoming fixtures (status "NS" = Not Started)
    const upcomingFixtures = await SoccerFixture.find({ "status.short": "NS" })
      .sort({ date: 1 }) // Sort by fixture date (earliest first)
      .lean(); // Convert to plain objects for better performance

    if (!upcomingFixtures.length) {
      console.log("⚠️ No upcoming fixtures found.");
      return [];
    }

    // Step 2: Group fixtures by league
    const groupedFixtures = Object.entries(soccerLeagues).map(([leagueName, leagueId]) => {
      const leagueFixtures = upcomingFixtures.filter((fixture) => fixture.league.id === leagueId);

      return {
        leagueId,
        leagueName,
        fixtures: leagueFixtures,
      };
    });

    console.log(`✅ Found ${upcomingFixtures.length} upcoming fixtures.`);
    return groupedFixtures.filter((league) => league.fixtures.length > 0);
  } catch (error) {
    console.error("❌ Error fetching upcoming fixtures:", error.message);
    throw new Error("Failed to fetch upcoming fixtures from database");
  }
};



/**
 * Fetch last 10 completed fixtures for each league from the database (status.short == "FT").
 * Group them by league with only required fields.
 *
 * @returns {Promise<Array>} - Completed fixtures grouped by league.
 */
const getCompletedFixturesFromDB = async () => {
  try {
    console.log("🔄 Fetching completed fixtures from DB...");

    // Step 1: Fetch all completed fixtures (status "FT" means "Finished") with only required fields
    let completedFixtures = await SoccerFixture.find({ "status.short": "FT" })
      .select("fixtureId league goals teams date") // ✅ Select only required fields
      .sort({ date: -1 }) // ✅ Sort by most recent first (MongoDB sorting is fast)
      .lean(); // ✅ Convert to plain objects for performance boost

    // If no fixtures are found, return an empty array
    if (!completedFixtures.length) {
      console.log("⚠️ No completed fixtures found.");
      return [];
    }

    // Step 2: Group fixtures by league
    const groupedFixtures = Object.entries(soccerLeagues).map(([leagueName, leagueId]) => {
      const leagueFixtures = completedFixtures
        .filter((fixture) => fixture.league.id === leagueId)
        .slice(0, 10); // ✅ Take the last 10 fixtures per league

      return {
        leagueId,
        leagueName,
        fixtures: leagueFixtures,
      };
    });

    console.log(`✅ Returning completed fixtures for ${groupedFixtures.length} leagues.`);
    return groupedFixtures.filter((league) => league.fixtures.length > 0);
  } catch (error) {
    console.error("❌ Error fetching completed fixtures:", error.message);
    throw new Error("Failed to fetch completed fixtures from database");
  }
};





/**
 * Fetch a single fixture by fixtureId.
 * @param {number} fixtureId - The fixture ID to fetch.
 * @returns {Promise<Object>} - The fixture document.
 * @throws {CustomError} - Throws an error if the fixture is not found.
 */
const getFixtureById = async (fixtureId) => {
  try {
    if (!fixtureId) {
      throw new CustomError("Fixture ID is required", 400);
    }

    console.log(`🔍 Fetching fixture with ID: ${fixtureId}`);

    // Fetch the fixture from the database
    const fixture = await SoccerFixture.findOne({ fixtureId })
      .select("-_id fixtureId league teams date status goals score events")
      .lean();

    if (!fixture) {
      throw new CustomError(`No fixture found with ID: ${fixtureId}`, 404);
    }

    console.log("✅ Fixture found:", fixture);
    return fixture;
  } catch (error) {
    console.error("❌ Error fetching fixture by ID:", error.message);
    throw new CustomError(
      error.message || "Failed to fetch fixture by ID",
      500
    );
  }
};






module.exports = {
  getLiveGamesFixtureIds,
  getFixtureDetails,
  insertOrUpdateFixtures,
  getUpcomingFixtures,
  upcomingFixtures,
  processUpcomingFixturesandEmit,
  getAllUpcomingFixtures,
  processLiveFixtures,
  processLiveFixturesAndEmit,
  processFinishedFixtures,
  getUpcomingFixturesFromDB,
  getCompletedFixturesFromDB,
  getFixtureById
};
