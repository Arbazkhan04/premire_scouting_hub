const mongoose = require("mongoose");

const TopScorerSchema = new mongoose.Schema({
  player: {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    age: { type: Number, required: true },
    birth: {
      date: { type: String },
      place: { type: String },
      country: { type: String },
    },
    nationality: { type: String, required: true },
    height: { type: String },
    weight: { type: String },
    injured: { type: Boolean },
    photo: { type: String, required: true },
  },
  statistics: [
    {
      team: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        logo: { type: String, required: true },
      },
      league: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        country: { type: String, required: true },
        logo: { type: String, required: true },
        flag: { type: String, required: true },
        season: { type: Number, required: true },
      },
      games: {
        appearences: { type: Number },
        lineups: { type: Number },
        minutes: { type: Number },
        number: { type: Number, default: null },
        position: { type: String },
        rating: { type: String },
        captain: { type: Boolean },
      },
    },
  ],
});

module.exports = mongoose.model("SoccerLeagueTopScorer", TopScorerSchema);
