const mongoose = require("mongoose");

const SoccerTeamSchema = new mongoose.Schema(
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
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    founded: {
      type: Number, // Year of establishment
    },
    national: {
      type: Boolean, // Is it a national team?
      default: false,
    },
    logo: {
      type: String, // URL to team's logo
    },
    venue: {
      id: { type: Number },
      name: { type: String },
      address: { type: String },
      city: { type: String },
      capacity: { type: Number },
      surface: { type: String },
      image: { type: String },
    },
    seasons: [
      {
        year: { type: Number, required: true },
        stats: { type: Boolean, default: false },
        statRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "SoccerTeamStatistics" }], // Array of ObjectIds
        _id: false, // Prevents MongoDB from auto-generating _id for each season entry
      },
    ], // Array of season objects
    leagues: [{ type: String, unique: true }], // Array of unique league IDs as strings
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SoccerTeam", SoccerTeamSchema);
