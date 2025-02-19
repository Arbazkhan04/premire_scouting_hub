const mongoose = require("mongoose");

const AmericanFootballPlayerStatisticsSchema = new mongoose.Schema(
  {
    playerId: {
      type: Number, // API Player ID
      required: true,
    },
   
    season: {
      type: Number, // Season year
      required: true,
    },
    teamId: {
      type: Number, // API Team ID
      required: true,
    },
   
    teamName: {
      type: String, // Team Name
      required: true,
    },
    teamLogo: {
      type: String, // URL to Team Logo
    },
    statistics: [
      {
        category: { type: String, required: true }, // E.g., "Passing", "Rushing"
        stats: [
          {
            name: { type: String, required: true }, // E.g., "yards", "passing attempts"
            value: { type: String, default: null }, // Some values can be null
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("AmericanFootballPlayerStatistics", AmericanFootballPlayerStatisticsSchema);
