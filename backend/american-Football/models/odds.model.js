const mongoose = require("mongoose");

const OddSchema = new mongoose.Schema({
  value: String,
  odd: String,
});

const BetSchema = new mongoose.Schema({
  id: Number,
  name: String,
  values: [OddSchema],
});

const BookmakerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  bets: [BetSchema],
});

const AmericanFootballGameOddsSchema = new mongoose.Schema({
  gameId: {
    type: Number,
    required: true,
    unique: true,
  },
  league: {
    id: Number,
    name: String,
    season: Number,
    logo: String,
  },
  country: {
    name: String,
    code: String,
    flag: String,
  },
  update: {
    type: Date,
  },
  bookmakers: [BookmakerSchema],
}, { timestamps: true });

const AmericanFootballGameOdds = mongoose.model("AmericanFootballGameOdds", AmericanFootballGameOddsSchema);

module.exports = AmericanFootballGameOdds;
