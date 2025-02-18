const mongoose = require("mongoose");

const AmericanFootballPlayerSchema = new mongoose.Schema(
  {
    playerId: {
      type: Number, // API Player ID
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    height: {
      type: String, // Height format (e.g., "6' 3\"")
    },
    weight: {
      type: String, // Weight format (e.g., "215 lbs")
    },
    college: {
      type: String, // College name
    },
    group: {
      type: String, // Offense / Defense / Special Teams
    },
    position: {
      type: String, // Position (e.g., QB, WR)
    },
    number: {
      type: Number, // Jersey Number
    },
    salary: {
      type: String, // Can be null or a string (if provided in the future)
    },
    experience: {
      type: Number, // Years of experience
    },
    image: {
      type: String, // URL to player's image
    },
    // Statistics field - Array of objects with season and statistics document reference
    statistics: [
      {
        season: { type: Number, required: true }, // Year of the season
        statDocRefId: { type: mongoose.Schema.Types.ObjectId, ref: "AmericanFootballPlayerStats" }, // Reference to statistics document
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("AmericanFootballPlayer", AmericanFootballPlayerSchema);
