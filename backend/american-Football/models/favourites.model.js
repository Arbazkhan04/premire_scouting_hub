const mongoose = require("mongoose");

const AmericanFootballFavoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User Model
      required: true,
    },

    favourites: [
      {
        sportName: {
          type: String,
          enum: ["american-football"], // Allowed sport
          required: true,
        },
        players: [
          {
            playerRef: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "AmericanFootballPlayer", // Reference to AmericanFootballPlayer Model
              required: true,
            },
            playerId: {
              type: String, // API Player ID
              required: true,
            },
          },
        ],
        teams: [
          {
            teamRef: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "AmericanFootballTeam", // Reference to AmericanFootballTeam Model
              required: true,
            },
            teamId: {
              type: String, // API Team ID
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

module.exports = mongoose.model("AmericanFootballFavorites", AmericanFootballFavoritesSchema);
