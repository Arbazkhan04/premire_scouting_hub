const mongoose = require("mongoose");

const TopScorerSchema = new mongoose.Schema(
  {
    leagueId: {
      type: Number,
      required: true,
    },
    season: {
      type: Number,
      required: true,
    },
    players: [
      {
        player: {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          firstname: { type: String },
          lastname: { type: String },
          age: { type: Number },
          birth: {
            date: { type: String },
            place: { type: String },
            country: { type: String },
          },
          nationality: { type: String },
          height: { type: String },
          weight: { type: String },
          injured: { type: Boolean },
          photo: { type: String },
        },
        statistics: [
          {
            team: {
              id: { type: Number, required: true },
              name: { type: String, required: true },
              logo: { type: String },
            },
            league: {
              id: { type: Number, required: true },
              name: { type: String, required: true },
              country: { type: String },
              logo: { type: String },
              flag: { type: String },
              season: { type: Number, required: true },
            },
            games: {
              appearances: { type: Number },
              lineups: { type: Number },
              minutes: { type: Number },
              number: { type: Number, default: null },
              position: { type: String },
              rating: { type: String },
              captain: { type: Boolean },
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoccerLeagueTopScorer", TopScorerSchema);
