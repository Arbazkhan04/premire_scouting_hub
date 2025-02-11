const mongoose = require("mongoose");

const SoccerTeamStatisticsSchema = new mongoose.Schema(
  {
    league: {
      type: String, // Stores league ID
      required: true,
    },
    team: {
      type: String, // Stores team ID
      required: true,
    },
    season: {
      type: Number, // Stores the season year
      required: true,
    },
    form: {
      type: String,
    },
    fixtures: {
      played: {
        home: Number,
        away: Number,
        total: Number,
      },
      wins: {
        home: Number,
        away: Number,
        total: Number,
      },
      draws: {
        home: Number,
        away: Number,
        total: Number,
      },
      loses: {
        home: Number,
        away: Number,
        total: Number,
      },
    },
    goals: {
      for: {
        total: {
          home: Number,
          away: Number,
          total: Number,
        },
        average: {
          home: String,
          away: String,
          total: String,
        },
        minute: mongoose.Schema.Types.Mixed, // Stores goal distribution by minutes
        under_over: mongoose.Schema.Types.Mixed, // Stores goal stats like over/under 0.5, 1.5, etc.
      },
      against: {
        total: {
          home: Number,
          away: Number,
          total: Number,
        },
        average: {
          home: String,
          away: String,
          total: String,
        },
        minute: mongoose.Schema.Types.Mixed,
        under_over: mongoose.Schema.Types.Mixed,
      },
    },
    biggest: {
      streak: {
        wins: Number,
        draws: Number,
        loses: Number,
      },
      wins: {
        home: String,
        away: String,
      },
      loses: {
        home: String,
        away: String,
      },
      goals: {
        for: {
          home: Number,
          away: Number,
        },
        against: {
          home: Number,
          away: Number,
        },
      },
    },
    clean_sheet: {
      home: Number,
      away: Number,
      total: Number,
    },
    failed_to_score: {
      home: Number,
      away: Number,
      total: Number,
    },
    penalty: {
      scored: {
        total: Number,
        percentage: String,
      },
      missed: {
        total: Number,
        percentage: String,
      },
      total: Number,
    },
    lineups: [
      {
        formation: String,
        played: Number,
      },
    ],
    cards: {
      yellow: mongoose.Schema.Types.Mixed, // Stores yellow card distribution
      red: mongoose.Schema.Types.Mixed, // Stores red card distribution
    },
  },
  { timestamps: true }
);

const SoccerTeamStatistics = mongoose.model("SoccerTeamStatistics", SoccerTeamStatisticsSchema);

module.exports = SoccerTeamStatistics;
