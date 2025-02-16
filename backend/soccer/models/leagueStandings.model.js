const mongoose = require("mongoose");

const SoccerLeagueStandingsSchema = new mongoose.Schema(
  {
    leagueId: {
      type: Number, // API's League ID
      required: true,
    },
    leagueName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    season: {
      type: Number,
      required: true,
    },
    standings: [
      {
        rank: {
          type: Number,
          required: true,
        },
        team: {
          id: {
            type: Number,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          logo: {
            type: String, // URL to team's logo
          },
        },
        points: {
          type: Number,
          required: true,
        },
        goalsDiff: {
          type: Number,
          required: true,
        },
        form: {
          type: String,
        },
        status: {
          type: String,
        },
        description: {
          type: String,
        },
        all: {
          played: Number,
          win: Number,
          draw: Number,
          lose: Number,
          goals: {
            for: Number,
            against: Number,
          },
        },
        home: {
          played: Number,
          win: Number,
          draw: Number,
          lose: Number,
          goals: {
            for: Number,
            against: Number,
          },
        },
        away: {
          played: Number,
          win: Number,
          draw: Number,
          lose: Number,
          goals: {
            for: Number,
            against: Number,
          },
        },
        update: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SoccerLeagueStandings", SoccerLeagueStandingsSchema);
