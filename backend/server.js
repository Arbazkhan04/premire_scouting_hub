// // require('dotenv').config();
// require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
// const express = require("express");
// const passport = require("passport");
// const errorHandler = require("./middlewares/errorHandler");
// const compression = require("compression");
// const http = require("http");
// const socketService = require("./sockets/socket");
// const { initJobSchedulers,scheduleLiveScoreJob } = require("./soccer/services/soccerJobs.service");
// const {initAmericanFootballJobSchedulers} = require("./american-Football/services/americanFootballJobs.service");
// const session = require("express-session");
// const passportConfiguration = require("./utils/passportConfiguration");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("./jobs/soccerWorker")
// require("./jobs/americanFootballWorker")
// const app = express();
// const server = http.createServer(app);

// socketService.initialize(server);

// // setting up cors
// app.use(
//   cors({
//     credentials: true,
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   })
// );



// // ✅ Use express.raw() ONLY for Stripe webhooks
// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/v1/stripe/webhook") {
//       next(); // Don't parse JSON for Stripe webhooks
//   } else {
//       express.json()(req, res, next); // Parse JSON for all other routes
//   }
// });

// // middlewares
// // app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(compression());

// // // initialize all recurring jobs when the server starts
// // initJobSchedulers();
// // await initAmericanFootballJobSchedulers()
// // //schedule live score polling job
// // scheduleLiveScoreJob()






// /**
//  * Wrap initialization logic inside an async function
//  * to properly use `await` at the top level
//  */
// (async () => {
//   try {
//     // Initialize all recurring jobs when the server starts
//     console.log("🔄 Initializing scheduled jobs...");
//     initJobSchedulers();
//     await initAmericanFootballJobSchedulers();

//     // Schedule live score polling job
//     await scheduleLiveScoreJob();

//     console.log("✅ Server startup tasks completed.");
//   } catch (error) {
//     console.error("❌ Error during server initialization:", error.message);
//   }
// })();





// // User Management Routes
// const userManagementRoutes = require("./routes/authRoutes");
// const favouritesManagementRoutes = require("./routes/favourites.routes");
// //Soccer Routes
// const soccerPlayerManagement = require("./soccer/routes/playerManagement.routes");
// const soccerLeagueManagment = require("./soccer/routes/leagues.routes");
// const soccerTeamManagement = require("./soccer/routes/teams.routes");
// const soccerFixturesManagement = require("./soccer/routes/fixtures.routes");
// const soccerOddsManagement = require("./soccer/routes/odds.routes");

// //American Football Routes
// const americanFootballLeagueManagement = require("./american-Football/routes/leagues.routes");
// const americanFootballTeamsManagement = require("./american-Football/routes/teams.routes");
// const americanFootballPlayersManagement = require("./american-Football/routes/player.route");
// const americanFootballGamesManagement = require("./american-Football/routes/games.routes");
// const americanFootballOddsManagement = require("./american-Football/routes/odds.routes");


// //STRIPE ROUTES 
// const stripeManagement=require("./stripe/stripe.routes")

// app.use("/api/v1/auth", userManagementRoutes);
// app.use("/api/v1/favourites", favouritesManagementRoutes);

// app.use("/api/v1/soccer/player", soccerPlayerManagement);
// app.use("/api/v1/soccer/league", soccerLeagueManagment);
// app.use("/api/v1/soccer/team", soccerTeamManagement);
// app.use("/api/v1/soccer/fixtures", soccerFixturesManagement);
// app.use("/api/v1/soccer/odds", soccerOddsManagement);

// app.use("/api/v1/american-football/league", americanFootballLeagueManagement);
// app.use("/api/v1/american-football/team", americanFootballTeamsManagement);
// app.use("/api/v1/american-football/player", americanFootballPlayersManagement);
// app.use("/api/v1/american-football/games", americanFootballGamesManagement);
// app.use("/api/v1/american-football/odds", americanFootballOddsManagement);

// app.use("/api/v1/stripe", stripeManagement);

// // Error Handling Middleware
// app.use(errorHandler);

// app.use("/", (req, res) => {
//   res.send(
//     'Hello World'
//   );
// });

// // server
// const port = process.env.PORT || 3000;



// const dbOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 50000, // Wait 50 seconds before failing
//   socketTimeoutMS: 60000, // Increase socket timeout
//   connectTimeoutMS: 60000, // Increase connection timeout
// };


// const start = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI,dbOptions);
//     console.log(`Connected to ${process.env.NODE_ENV} Database`);
//     server.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
// start();






require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const path = require("path");
const passport = require("passport");
const errorHandler = require("./middlewares/errorHandler");
const compression = require("compression");
const http = require("http");
const socketService = require("./sockets/socket");
const { initJobSchedulers, scheduleLiveScoreJob } = require("./soccer/services/soccerJobs.service");
const { initAmericanFootballJobSchedulers } = require("./american-Football/services/americanFootballJobs.service");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Workers for background jobs
require("./jobs/soccerWorker");
require("./jobs/americanFootballWorker");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socketService.initialize(server);

// ✅ CORS Configuration
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ✅ Handle Stripe Webhooks Without JSON Parsing
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/stripe/webhook") {
    next(); // Don't parse JSON for Stripe webhooks
  } else {
    express.json()(req, res, next);
  }
});

// ✅ Initialize Scheduled Jobs
(async () => {
  try {
    console.log("🔄 Initializing scheduled jobs...");
    initJobSchedulers();
    await initAmericanFootballJobSchedulers();
    await scheduleLiveScoreJob();
    console.log("✅ Server startup tasks completed.");
  } catch (error) {
    console.error("❌ Error during server initialization:", error.message);
  }
})();

// ✅ API Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/favourites", require("./routes/favourites.routes"));

// Soccer Routes
app.use("/api/v1/soccer/player", require("./soccer/routes/playerManagement.routes"));
app.use("/api/v1/soccer/league", require("./soccer/routes/leagues.routes"));
app.use("/api/v1/soccer/team", require("./soccer/routes/teams.routes"));
app.use("/api/v1/soccer/fixtures", require("./soccer/routes/fixtures.routes"));
app.use("/api/v1/soccer/odds", require("./soccer/routes/odds.routes"));

// American Football Routes
app.use("/api/v1/american-football/league", require("./american-Football/routes/leagues.routes"));
app.use("/api/v1/american-football/team", require("./american-Football/routes/teams.routes"));
app.use("/api/v1/american-football/player", require("./american-Football/routes/player.route"));
app.use("/api/v1/american-football/games", require("./american-Football/routes/games.routes"));
app.use("/api/v1/american-football/odds", require("./american-Football/routes/odds.routes"));

//Soccer AI prediction Routes
app.use("/api/v1/soccer/AI",require("./soccer/routes/AIPrediction.routes"))

// Stripe Routes
app.use("/api/v1/stripe", require("./stripe/stripe.routes"));

// ✅ Serve Frontend (React Vite)
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Handle React SPA (All Unknown Routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server After DB Connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
    });

    console.log(`✅ Connected to ${process.env.NODE_ENV} Database`);
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
};

startServer();
