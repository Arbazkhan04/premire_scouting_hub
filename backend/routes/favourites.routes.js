const express = require("express");
const { addPlayer, removePlayer, addTeam, removeTeam,getFavorites, getFavoriteHighlights } = require("../controllers/favourites.controller");
const {auth} = require("../middlewares/authentication");

const router = express.Router();

// Routes for managing favorite players
router.post("/addPlayer", auth, addPlayer);
router.delete("/removePlayer", auth, removePlayer);

// Routes for managing favorite teams
router.post("/addTeam", auth, addTeam);
router.delete("/removeTeam", auth, removeTeam);
router.get("/getFavourites", auth, getFavorites);

router.get("/getFavouriteHighlights",auth, getFavoriteHighlights)

module.exports = router;
