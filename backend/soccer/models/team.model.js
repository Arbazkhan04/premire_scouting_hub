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
      type: String, // Team short code
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
    seasons: [{ type: Number }], // Array of seasons (years)
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("SoccerTeam", SoccerTeamSchema);
