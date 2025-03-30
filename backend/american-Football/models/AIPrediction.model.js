const mongoose = require("mongoose");

const AmericanFootballPredictionSchema = new mongoose.Schema(
  {
    gameId: { type: Number, required: true, unique: true },
    match: {
      homeTeam: { id: Number, name: String },
      awayTeam: { id: Number, name: String },
      date: { type: Date, required: true },
      league: { id: Number, name: String },
    },
    predictions: {
      matchOutcome: {
        win: { home: Number, away: Number },
        correctScore: { home: Number, away: Number },
        halftimeFulltime: { halftime: String, fulltime: String },
        firstToScore: String, // "Home", "Away"
        marginOfVictory: Number,
        spreadBetting: { line: Number, homeOdds: Number, awayOdds: Number },
        overUnderTotalPoints: { threshold: Number, over: Boolean },
      },
      playerPerformance: [
        {
          player: { id: Number, name: String, team: String, position: String },
          stats: {
            passing: { yards: Number, touchdowns: Number, interceptions: Number, completionPercentage: Number },
            rushing: { yards: Number, touchdowns: Number, yardsPerCarry: Number },
            receiving: { receptions: Number, yards: Number, touchdowns: Number },
            defense: { sacks: Number, interceptions: Number, forcedFumbles: Number, tackles: Number },
            specialTeams: { fieldGoalsMade: Number, fieldGoalPercentage: Number, kickoffReturns: Number },
          },
        },
      ],
      teamPerformance: {
        totalPoints: Number,
        turnoversForced: Number,
        totalYardsGained: Number,
        timeOfPossession: Number,
        thirdDownConversions: Number,
        redZoneEfficiency: Number,
        defensiveTouchdowns: Number,
        specialTeamsPerformance: { returnYards: Number, fieldGoals: Number },
      },
      bettingOdds: {
        bestValueBets: [String],
        safeBets: [String],
        highRiskBets: [String],
        arbitrageOpportunities: [String],
        liveBettingSuggestions: [String],
      },
      gameSpecific: {
        penalties: Number,
        challenges: { total: Number, successful: Number },
        fourthDownConversions: Number,
        successfulOnsideKicks: Number,
        injuryImpact: String,
      },
      streakAndForm: {
        teamWinningStreak: { home: Number, away: Number },
        headToHeadComparison: String,
        homeAwayPerformance: { home: String, away: String },
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

AmericanFootballPredictionSchema.index({ "match.date": 1, "match.league.id": 1 });

module.exports = mongoose.model("AmericanFootballPredictions", AmericanFootballPredictionSchema);
