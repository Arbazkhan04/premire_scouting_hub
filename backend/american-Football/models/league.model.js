const mongoose = require("mongoose");

const AmericanFootballLeagueSchema = new mongoose.Schema(
  {
    leagueId: {
      type: Number, // API's League ID (from league.id)
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String, // URL to league's logo
    },
    country: {
      name: { type: String },
      code: { type: String },
      flag: { type: String }, // URL to country flag
    },
    seasons: [
      {
        year: { type: Number, required: true }, // e.g., 2024, 2023, etc.
        start: { type: Date },
        end: { type: Date },
        current: { type: Boolean, default: false },
        coverage: {
          games: {
            events: { type: Boolean },
            statistics: {
              teams: { type: Boolean },
              players: { type: Boolean },
            },
          },
          statistics: {
            season: {
              players: { type: Boolean },
            },
          },
          players: { type: Boolean },
          injuries: { type: Boolean },
          standings: { type: Boolean },
        },
      },
    ],
    // Teams field structured by season
    teams: [
      {
        season: { type: Number, required: true }, // Season year for the teams
        teams: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "AmericanFootballTeam" }, // Reference to Team document
            teamId: { type: Number, required: true }, // API Team ID
          },
        ],
      },
    ],
    // New field to track games fetched status
    gamesFetched: [
      {
        season: { type: Number, required: true }, // Season year
        fetched: { type: Boolean, default: false }, // Whether games were fetched
        updatedOn: { type: Date, default: Date.now }, // Timestamp of last update
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("AmericanFootballLeague", AmericanFootballLeagueSchema);
