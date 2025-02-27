// require('dotenv').config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const passport = require("passport");
const errorHandler = require("./middlewares/errorHandler");
const compression = require("compression");
const http = require("http");
const socketService = require("./sockets/socket");
const { initJobSchedulers,scheduleLiveScoreJob } = require("./soccer/services/soccerJobs.service");
const {initAmericanFootballJobSchedulers} = require("./american-Football/services/americanFootballJobs.service");
const session = require("express-session");
const passportConfiguration = require("./utils/passportConfiguration");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./jobs/soccerWorker")
require("./jobs/americanFootballWorker")
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

// // initialize all recurring jobs when the server starts
// initJobSchedulers();
// await initAmericanFootballJobSchedulers()
// //schedule live score polling job
// scheduleLiveScoreJob()






/**
 * Wrap initialization logic inside an async function
 * to properly use `await` at the top level
 */
(async () => {
  try {
    // Initialize all recurring jobs when the server starts
    console.log("🔄 Initializing scheduled jobs...");
    initJobSchedulers();
    await initAmericanFootballJobSchedulers();

    // Schedule live score polling job
    await scheduleLiveScoreJob();

    console.log("✅ Server startup tasks completed.");
  } catch (error) {
    console.error("❌ Error during server initialization:", error.message);
  }
})();





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
const americanFootballGamesManagement = require("./american-Football/routes/games.routes");
const americanFootballOddsManagement = require("./american-Football/routes/odds.routes");

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
app.use("/api/v1/american-football/games", americanFootballGamesManagement);
app.use("/api/v1/american-football/odds", americanFootballOddsManagement);

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
