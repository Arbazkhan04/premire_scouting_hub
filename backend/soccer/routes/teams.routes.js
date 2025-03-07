const express = require("express");
const router = express.Router();
const { saveTeams,searchTeamController, getTeamByTeamIdController, } = require("../controllers/teams.controller");
const {
  processTeamStatisticsController,
  fetchandSaveAllTeamsStatisticsController
} = require("../controllers/teamStatistics.controller");


router.get("/fetchandSaveAllTeams", saveTeams);
router.get("/processTeamStats", processTeamStatisticsController);
router.post("/fetchandSaveAllTeamsofLeagueStats",fetchandSaveAllTeamsStatisticsController)
router.get('/searchTeam', searchTeamController);


router.get('/getTeambyTeamId', getTeamByTeamIdController);

module.exports = router;
