const express = require("express");
const { getAIPredictionController, getAndSaveFixtureAIPredictionController, getAIPredictionByFixtureIdController, getAllUpcomingFixturesPredictionsController } = require("../controllers/AIPrediction.controller");

const router = express.Router();





router.get("/getFixturePrediction", getAIPredictionController);

router.get("/getandSaveFixturePrediction", getAndSaveFixtureAIPredictionController);
router.get("/getFixturePredictionbyFixtureId",getAIPredictionByFixtureIdController)



// ✅ Get all upcoming AI fixture predictions
router.get("/allUpcomingFixturesPredictions", getAllUpcomingFixturesPredictionsController);

module.exports = router;
