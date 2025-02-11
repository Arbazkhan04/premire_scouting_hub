const express=require("express")
const {
  fetchAndSaveLeagueController,
} = require("../controllers/leagues.controller");
const { auth } = require("../../middlewares/authentication");
const router = express.Router();

router.post("/fetchandSaveLeague", fetchAndSaveLeagueController);

module.exports = router;
