const express = require('express');
const { searchPlayerController,insertOrUpdatePlayerController } = require('../controllers/playerManagement.controller');
const {fetchAndSavePlayerStatisticsController}=require('../controllers/playerStatistics.controller')
const router = express.Router();

router.get('/searchPlayer', searchPlayerController);
// Route to insert or update a player
router.post("/addPlayer", insertOrUpdatePlayerController);

router.post("/fetchandSavePlayerStats",fetchAndSavePlayerStatisticsController)

module.exports = router;
