const mongoose = require("mongoose");

const OddsSchema = new mongoose.Schema({
  fixtureId: { type: Number, required: true, index: true }, // Unique fixture ID
  league: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    logo: { type: String },
    flag: { type: String },
    season: { type: Number, required: true },
  },
  fixture: {
    timezone: { type: String, required: true },
    date: { type: Date, required: true },
    timestamp: { type: Number, required: true },
  },
  update: { type: Date, required: true },
  bookmakers: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      bets: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          values: [
            {
              value: { type: String, required: true }, // e.g., "Home", "Draw", "Away"
              odd: { type: String, required: true }, // Odds in decimal format
            },
          ],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("SoccerFixturesOdds", OddsSchema);
