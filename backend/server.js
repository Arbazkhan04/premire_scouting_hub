// require('dotenv').config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const passport = require("passport");
const errorHandler = require("./middlewares/errorHandler");
const compression = require("compression");
const http = require("http");
const socketService = require("./sockets/socket");
const { initJobSchedulers,scheduleLiveScoreJob } = require("./soccer/services/soccerJobs.service");
const session = require("express-session");
const passportConfiguration = require("./utils/passportConfiguration");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./jobs/worker")
const app = express();
const server = http.createServer(app);

socketService.initialize(server);

// setting up cors
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// initialize all recurring jobs when the server starts
initJobSchedulers();
//schedule live score polling job
scheduleLiveScoreJob()

// User Management Routes
const userManagementRoutes = require("./routes/authRoutes");
const favouritesManagementRoutes = require("./routes/favourites.routes");
//Soccer Routes
const soccerPlayerManagement = require("./soccer/routes/playerManagement.routes");
const soccerLeagueManagment = require("./soccer/routes/leagues.routes");
const soccerTeamManagement = require("./soccer/routes/teams.routes");
const soccerFixturesManagement = require("./soccer/routes/fixtures.routes");
const soccerOddsManagement = require("./soccer/routes/odds.routes");

//American Football Routes
const americanFootballLeagueManagement = require("./american-Football/routes/leagues.routes");
const americanFootballTeamsManagement = require("./american-Football/routes/teams.routes");
const americanFootballPlayersManagement = require("./american-Football/routes/player.route");

app.use("/api/v1/auth", userManagementRoutes);
app.use("/api/v1/favourites", favouritesManagementRoutes);

app.use("/api/v1/soccer/player", soccerPlayerManagement);
app.use("/api/v1/soccer/league", soccerLeagueManagment);
app.use("/api/v1/soccer/team", soccerTeamManagement);
app.use("/api/v1/soccer/fixtures", soccerFixturesManagement);
app.use("/api/v1/soccer/odds", soccerOddsManagement);

app.use("/api/v1/american-football/league", americanFootballLeagueManagement);
app.use("/api/v1/american-football/team", americanFootballTeamsManagement);
app.use("/api/v1/american-football/player", americanFootballPlayersManagement);

// Error Handling Middleware
app.use(errorHandler);

app.use("/", (req, res) => {
  res.send(
    'Welcome to root page\n<a href="/auth/google">click here to login<a>'
  );
});

// server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to ${process.env.NODE_ENV} Database`);
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
