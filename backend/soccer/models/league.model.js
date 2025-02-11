const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    leagueId: {
      type: Number, // API's League ID
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String, // "League", "Cup", etc.
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
        year: { type: Number, required: true }, // e.g., 2020, 2021
        start: { type: Date },
        end: { type: Date },
        current: { type: Boolean, default: false },
        coverage: {
          fixtures: {
            events: { type: Boolean },
            lineups: { type: Boolean },
            statistics_fixtures: { type: Boolean },
            statistics_players: { type: Boolean },
          },
          standings: { type: Boolean },
          players: { type: Boolean },
          top_scorers: { type: Boolean },
          top_assists: { type: Boolean },
          top_cards: { type: Boolean },
          injuries: { type: Boolean },
          predictions: { type: Boolean },
          odds: { type: Boolean },
        },
      },
    ],
    teams: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "SoccerTeam" }, // Reference to Team document
        teamId: { type: Number, required: true }, // API Team ID
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("SoccerLeague", LeagueSchema);
