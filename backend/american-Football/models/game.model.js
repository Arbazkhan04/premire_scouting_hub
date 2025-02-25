const mongoose = require("mongoose");

const AmericanFootballGameSchema = new mongoose.Schema(
  {
    gameId: {
      type: Number, // API Game ID
      required: true,
      unique: true,
    },
    stage: {
      type: String, // FBS (Division I-A), Playoffs, etc.
    },
    week: {
      type: mongoose.Schema.Types.Mixed, // Allows both Number and String
      default: null, // Store null if it's an invalid number
    },
    date: {
      timezone: { type: String }, // UTC, EST, etc.
      date: { type: Date, required: true }, // Game date
      time: { type: String }, // Optional: Specific time
      timestamp: { type: Number }, // Unix timestamp
    },
    venue: {
      name: { type: String },
      city: { type: String },
    },
    status: {
      short: { type: String }, // FT (Finished), Live, etc.
      long: { type: String }, // Full game status description
      timer: { type: String, default: null }, // Live game timer (if applicable)
    },
    league: {
      leagueId: { type: Number, required: true },
      name: { type: String, required: true },
      season: { type: Number, required: true },
      logo: { type: String }, // URL to league logo
      country: {
        name: { type: String },
        code: { type: String },
        flag: { type: String }, // URL to country flag
      },
    },
    teams: {
      home: {
        teamId: { type: Number, required: true },
        name: { type: String, required: true },
        logo: { type: String }, // URL to team logo
      },
      away: {
        teamId: { type: Number, required: true },
        name: { type: String, required: true },
        logo: { type: String }, // URL to team logo
      },
    },
    scores: {
      home: {
        quarter_1: { type: Number, default: 0 },
        quarter_2: { type: Number, default: 0 },
        quarter_3: { type: Number, default: 0 },
        quarter_4: { type: Number, default: 0 },
        overtime: { type: Number, default: null },
        total: { type: Number, default: 0 },
      },
      away: {
        quarter_1: { type: Number, default: 0 },
        quarter_2: { type: Number, default: 0 },
        quarter_3: { type: Number, default: 0 },
        quarter_4: { type: Number, default: 0 },
        overtime: { type: Number, default: null },
        total: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("AmericanFootballGame", AmericanFootballGameSchema);
