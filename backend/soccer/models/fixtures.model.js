const mongoose = require("mongoose");

const SoccerGameSchema = new mongoose.Schema(
  {
    fixtureId: { type: Number, required: true, unique: true }, // Fixture ID
    referee: { type: String },
    timezone: { type: String },
    date: { type: Date },
    timestamp: { type: Number },
    periods: {
      first: { type: Number },
      second: { type: Number },
    },
    venue: {
      id: { type: Number },
      name: { type: String },
      city: { type: String },
    },
    status: {
      long: { type: String },
      short: { type: String },
      elapsed: { type: Number },
    },
    league: {
      id: { type: Number },
      name: { type: String },
      country: { type: String },
      logo: { type: String },
      flag: { type: String },
      season: { type: Number },
      round: { type: String },
      standings: { type: Boolean },
    },
    teams: {
      home: {
        id: { type: Number },
        name: { type: String },
        logo: { type: String },
        winner: { type: Boolean },
      },
      away: {
        id: { type: Number },
        name: { type: String },
        logo: { type: String },
        winner: { type: Boolean },
      },
    },
    goals: {
      home: { type: Number },
      away: { type: Number },
    },
    score: {
      halftime: {
        home: { type: Number },
        away: { type: Number },
      },
      fulltime: {
        home: { type: Number },
        away: { type: Number },
      },
      extratime: {
        home: { type: Number, default: null },
        away: { type: Number, default: null },
      },
      penalty: {
        home: { type: Number, default: null },
        away: { type: Number, default: null },
      },
    },
    events: [
      {
        time: {
          elapsed: { type: Number },
          extra: { type: Number, default: null },
        },
        team: {
          id: { type: Number },
          name: { type: String },
          logo: { type: String },
        },
        player: {
          id: { type: Number },
          name: { type: String },
        },
        assist: {
          id: { type: Number, default: null },
          name: { type: String, default: null },
        },
        type: { type: String },
        detail: { type: String },
        comments: { type: String, default: null },
      },
    ],
    lineups: [
      {
        team: {
          id: { type: Number },
          name: { type: String },
          logo: { type: String },
        },
        coach: {
          id: { type: Number },
          name: { type: String },
          photo: { type: String },
        },
        formation: { type: String },
        startXI: [
          {
            player: {
              id: { type: Number },
              name: { type: String },
              number: { type: Number },
              pos: { type: String },
              grid: { type: String },
            },
          },
        ],
        substitutes: [
          {
            player: {
              id: { type: Number },
              name: { type: String },
              number: { type: Number },
              pos: { type: String },
              grid: { type: String, default: null },
            },
          },
        ],
      },
    ],
    statistics: [
      {
        team: {
          id: { type: Number },
          name: { type: String },
          logo: { type: String },
        },
        statistics: [
          {
            type: { type: String },
            value: { type: mongoose.Schema.Types.Mixed }, // Can be Number or String (e.g., "73%")
          },
        ],
      },
    ],
    players: [
      {
        team: {
          id: { type: Number },
          name: { type: String },
          logo: { type: String },
        },
        players: [
          {
            player: {
              id: { type: Number },
              name: { type: String },
              photo: { type: String },
            },
            statistics: [
              {
                games: {
                  minutes: { type: Number },
                  number: { type: Number },
                  position: { type: String },
                  rating: { type: String },
                  captain: { type: Boolean },
                  substitute: { type: Boolean },
                },
                offsides: { type: Number, default: null },
                shots: {
                  total: { type: Number, default: null },
                  on: { type: Number, default: null },
                },
                goals: {
                  total: { type: Number, default: null },
                  conceded: { type: Number, default: null },
                  assists: { type: Number, default: null },
                  saves: { type: Number, default: null },
                },
                passes: {
                  total: { type: Number, default: null },
                  key: { type: Number, default: null },
                  accuracy: { type: String, default: null },
                },
                tackles: {
                  total: { type: Number, default: null },
                  blocks: { type: Number, default: null },
                  interceptions: { type: Number, default: null },
                },
                duels: {
                  total: { type: Number, default: null },
                  won: { type: Number, default: null },
                },
                dribbles: {
                  attempts: { type: Number, default: null },
                  success: { type: Number, default: null },
                  past: { type: Number, default: null },
                },
                fouls: {
                  drawn: { type: Number, default: null },
                  committed: { type: Number, default: null },
                },
                cards: {
                  yellow: { type: Number, default: null },
                  red: { type: Number, default: null },
                },
                penalty: {
                  won: { type: Number, default: null },
                  commited: { type: Number, default: null },
                  scored: { type: Number, default: null },
                  missed: { type: Number, default: null },
                  saved: { type: Number, default: null },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoccerFixtures", SoccerGameSchema);
