const express = require("express");
const { 
  getSingleGamePrediction, 
  getMultipleGamePredictions, 
  getUpcomingPredictions
} = require("../controllers/AIPrediction.controller");

const router = express.Router();

// Route to get and save a single game AI prediction
router.get("/americanFootballPrediction", getSingleGamePrediction);

// Route to get and save multiple game AI predictions
router.post("/games/predictions", getMultipleGamePredictions);


// Route to fetch upcoming AI predictions
router.get("/upcoming-predictions", getUpcomingPredictions);

module.exports = router;
