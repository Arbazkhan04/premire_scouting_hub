const mongoose = require("mongoose");

const AmericanFootballTeamSchema = new mongoose.Schema(
  {
    teamId: {
      type: Number, // API's Team ID
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String, // Short code (e.g., "LV" for Las Vegas Raiders)
    },
    city: {
      type: String,
    },
    coach: {
      type: String, // Head Coach Name
    },
    owner: {
      type: String, // Team Owner(s)
    },
    stadium: {
      type: String, // Stadium Name
    },
    established: {
      type: Number, // Year the team was founded
    },
    logo: {
      type: String, // URL to team's logo
    },
    country: {
      name: { type: String },
      code: { type: String },
      flag: { type: String }, // URL to country flag
    },
   // Players grouped by season
   players: [
    {
      season: { type: Number, required: true }, // Season year
      roster: [
        {
          playerRefId: { type: mongoose.Schema.Types.ObjectId, ref: "AmericanFootballPlayer" }, // Reference to Player document
          playerId: { type: Number, required: true }, // API Player ID
        },
      ],
    },
  ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("AmericanFootballTeam", AmericanFootballTeamSchema);
