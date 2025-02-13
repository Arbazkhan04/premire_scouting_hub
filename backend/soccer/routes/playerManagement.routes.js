const express = require('express');
const { searchPlayerController,insertOrUpdatePlayerController,getPlayerProfile } = require('../controllers/playerManagement.controller');
const {fetchAndSavePlayerStatisticsController, getPlayerAggregatedStatsController}=require('../controllers/playerStatistics.controller');
const router = express.Router();

router.get('/searchPlayer', searchPlayerController);
// Route to insert or update a player
router.post("/addPlayer", insertOrUpdatePlayerController);

router.post("/fetchandSavePlayerStats",fetchAndSavePlayerStatisticsController)

router.get("/getPlayerProfile",getPlayerProfile)

router.get("/getPlayerAggregatedStats",getPlayerAggregatedStatsController)

module.exports = router;
