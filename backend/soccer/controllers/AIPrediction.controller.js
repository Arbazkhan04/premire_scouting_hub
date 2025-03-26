const {
  fetchAndSaveAIPrediction,
  getAIPredictionByFixtureId,
  getAllAIPredictions,
  deleteAIPrediction,
  getAndSaveFixtureAIPrediction,
  getAIPrediction,
  getAllUpcomingFixturesPredictions
} = require("../services/AIPrediction.service");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");




/**
 * Controller to get AI prediction for a fixture and save it.
 * Calls fetchAndSaveAIPrediction() and returns the structured response.
 * @route POST /api/v1/soccer/ai-predictions
 * @returns {JSON} - Saved AI prediction document.
 */
const getAIPredictionController = async (req, res, next) => {
  try {
    console.log("📌 Fetching AI prediction...");

    const { fixtureId} = req.query;

    if (!fixtureId)  {
      throw new CustomError("Fixture ID is required", 400);
    }

    // Fetch and save AI prediction
    const savedPrediction = await getAIPrediction(
      fixtureId
    );

    return responseHandler(
      res,
      201,
      "AI prediction fetched and saved successfully",
      savedPrediction
    );
  } catch (error) {
    console.error(
      "❌ Error in fetchAndSaveAIPredictionController:",
      error.message
    );
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};




/**
 * Controller to fetch AI prediction for a fixture and save it.
 * Calls fetchAndSaveAIPrediction() and returns the structured response.
 * @route POST /api/v1/soccer/ai-predictions
 * @returns {JSON} - Saved AI prediction document.
 */
const fetchAndSaveAIPredictionController = async (req, res, next) => {
  try {
    console.log("📌 Fetching AI prediction...");

    const { fixtureId, predictionData } = req.body;

    if (!fixtureId || !predictionData) {
      throw new CustomError("Fixture ID and prediction data are required", 400);
    }

    // Fetch and save AI prediction
    const savedPrediction = await fetchAndSaveAIPrediction(
      fixtureId,
      predictionData
    );

    return responseHandler(
      res,
      201,
      "AI prediction fetched and saved successfully",
      savedPrediction
    );
  } catch (error) {
    console.error(
      "❌ Error in fetchAndSaveAIPredictionController:",
      error.message
    );
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to get AI prediction by fixture ID.
 * Calls getAIPredictionByFixtureId() and returns the structured response.
 * @route GET /api/v1/soccer/ai-predictions/:fixtureId
 * @returns {JSON} - AI prediction for the given fixture.
 */
const getAIPredictionByFixtureIdController = async (req, res, next) => {
  try {
    console.log("📌 Fetching AI prediction by fixture ID...");

    const { fixtureId } = req.query;

    if (!fixtureId) {
      throw new CustomError("Fixture ID is required", 400);
    }

    // Fetch AI prediction by fixture ID
    const prediction = await getAIPredictionByFixtureId(Number(fixtureId));

    return responseHandler(
      res,
      200,
      "AI prediction fetched successfully",
      prediction
    );
  } catch (error) {
    console.error(
      "❌ Error in getAIPredictionByFixtureIdController:",
      error.message
    );
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to get all AI predictions with optional filters.
 * Calls getAllAIPredictions() and returns the structured response.
 * @route GET /api/v1/soccer/ai-predictions
 * @returns {JSON} - List of AI predictions.
 */
const getAllAIPredictionsController = async (req, res, next) => {
  try {
    console.log("📌 Fetching all AI predictions...");

    const filters = req.query;

    // Fetch AI predictions based on filters
    const predictions = await getAllAIPredictions(filters);

    return responseHandler(
      res,
      200,
      predictions.length > 0
        ? "AI predictions fetched successfully"
        : "No AI predictions found",
      predictions
    );
  } catch (error) {
    console.error("❌ Error in getAllAIPredictionsController:", error.message);
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};

/**
 * Controller to delete an AI prediction by fixture ID.
 * Calls deleteAIPredictionByFixtureId() and returns the structured response.
 * @route DELETE /api/v1/soccer/ai-predictions/:fixtureId
 * @returns {JSON} - Deletion success message.
 */
const deleteAIPredictionByFixtureIdController = async (req, res, next) => {
  try {
    console.log("📌 Deleting AI prediction by fixture ID...");

    const { fixtureId } = req.params;

    if (!fixtureId) {
      throw new CustomError("Fixture ID is required", 400);
    }

    // Delete AI prediction
    await deleteAIPrediction(Number(fixtureId));

    return responseHandler(res, 200, "AI prediction deleted successfully");
  } catch (error) {
    console.error(
      "❌ Error in deleteAIPredictionByFixtureIdController:",
      error.message
    );
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};


/**
 * Controller to get AI prediction for a fixture and save it.
 * Calls getAndSaveFixtureAIPrediction() and returns the structured response.
 * @route POST /api/v1/soccer/ai-predictions/save
 * @returns {JSON} - Saved AI prediction document.
 */
const getAndSaveFixtureAIPredictionController = async (req, res, next) => {
  try {
    console.log("📌 Fetching and saving AI prediction...");

    const { fixtureId } = req.query;

    if (!fixtureId) {
      throw new CustomError("Fixture ID is required", 400);
    }

    // Fetch AI prediction and save it
    const savedPrediction = await getAndSaveFixtureAIPrediction([Number(fixtureId)]);

    return responseHandler(
      res,
      201,
      "AI prediction fetched and saved successfully",
      savedPrediction
    );
  } catch (error) {
    console.error("❌ Error in getAndSaveFixtureAIPredictionController:", error.message);
    next(error instanceof CustomError ? error : new CustomError(error.message, 500));
  }
};





/**
 * Controller to get all upcoming AI fixture predictions.
 * Calls getAllUpcomingFixturesPredictions() and returns the structured response.
 * @route GET /api/v1/soccer/ai-predictions/upcoming
 * @returns {JSON} - List of upcoming AI predictions.
 */
const getAllUpcomingFixturesPredictionsController = async (req, res, next) => {
  try {
    console.log("📌 Fetching all upcoming AI fixture predictions...");

    // Fetch upcoming predictions from the service
    const upcomingPredictions = await getAllUpcomingFixturesPredictions();

    return responseHandler(
      res,
      200,
      upcomingPredictions.length > 0
        ? "Upcoming AI predictions fetched successfully"
        : "No upcoming AI predictions found",
      upcomingPredictions
    );
  } catch (error) {
    console.error(
      "❌ Error in getAllUpcomingFixturesPredictionsController:",
      error.message
    );
    next(
      error instanceof CustomError ? error : new CustomError(error.message, 500)
    );
  }
};




module.exports = {
  fetchAndSaveAIPredictionController,
  getAIPredictionByFixtureIdController,
  getAllAIPredictionsController,
  deleteAIPredictionByFixtureIdController,
  getAIPredictionController,
  getAndSaveFixtureAIPredictionController,
  getAllUpcomingFixturesPredictionsController
};
