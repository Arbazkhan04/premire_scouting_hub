const express = require("express");
const { getAIPredictionController, getAndSaveFixtureAIPredictionController } = require("../controllers/AIPrediction.controller");

const router = express.Router();





router.get("/getFixturePrediction", getAIPredictionController);

router.get("/getandSaveFixturePrediction", getAndSaveFixtureAIPredictionController);
module.exports = router;
