const mongoose = require("mongoose");

const AIPredictionSchema = new mongoose.Schema(
  {
    fixtureId: { type: Number, required: true, unique: true }, // Unique Fixture ID
    match: {
      homeTeam: { id: Number, name: String },
      awayTeam: { id: Number, name: String },
      date: { type: Date, required: true },
      league: { id: Number, name: String },
    },
    predictions: {
      matchOutcome: {
        win: { home: Number, away: Number, draw: Number },
        correctScore: { home: Number, away: Number },
        halftimeFulltime: {
          halftime: String, // "Home", "Away", "Draw"
          fulltime: String,
        },
        firstToScore: String, // "Home", "Away"
        lastToScore: String, // "Home", "Away"
        marginOfVictory: Number,
      },
      playerPerformance: [
        {
          player: { id: Number, name: String, team: String },
          goals: { anytime: Boolean, first: Boolean, last: Boolean },
          assists: Number,
          shots: { total: Number, onTarget: Number },
          cards: { yellow: Boolean, red: Boolean },
          manOfTheMatch: Boolean,
        },
      ],
      teamPerformance: {
        totalGoalsOverUnder: { threshold: Number, over: Boolean },
        cleanSheet: { home: Boolean, away: Boolean },
        bothTeamsToScore: Boolean,
        totalCorners: Number,
        totalFouls: { home: Number, away: Number },
      },
      bettingOdds: {
        bestValueBets: [String],
        safeBets: [String],
        highRiskBets: [String],
        arbitrageOpportunities: [String],
        liveBettingSuggestions: [String],
      },
      gameSpecific: {
        penaltyAwarded: Boolean,
        penaltyConverted: Boolean,
        substitutionImpact: String,
        injuryTimeGoalsProbability: Number,
      },
      streakAndForm: {
        teamWinningStreak: {
          home: Number, // Consecutive wins
          away: Number,
        },
        headToHeadComparison: String,
        homeAwayPerformance: {
          home: String, // "Strong", "Weak"
          away: String,
        },
      },
      weatherInfluence: {
        temperature: Number,
        condition: String, // "Rainy", "Sunny", etc.
        impactOnGame: String,
      },
    },
  },
  { timestamps: true }
);

// ✅ Index for Faster Queries
AIPredictionSchema.index({ "match.date": 1, "match.league.id": 1 });

module.exports = mongoose.model("SoccerAIPredictions", AIPredictionSchema);
