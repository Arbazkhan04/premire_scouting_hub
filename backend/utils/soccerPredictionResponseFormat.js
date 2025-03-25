const responseFormat = `{ 



fixtureId: {Integer},
match: { 
  homeTeam: { 
    id: {Integer},
    name: {String} 
  },
  awayTeam: { 
    id: {Integer}, 
    name: {String} 
  },
  date: {Date},
  league: { 
    id: {Integer}, 
    name: {String} 
  }
},
predictions: {
  matchOutcome: {
    win: { 
      home: {Integer}, 
      away: {Integer}, 
      draw: {Integer} 
    },
    correctScore: { 
      home: {Integer},
      away: {Integer}
    },
    halftimeFulltime: {
      halftime: {String}, 
      fulltime: {String}
    },
    firstToScore: {String},
    lastToScore: {String},
    marginOfVictory: {Integer}
  },
  playerPerformance: [
    {
      player: {
        id: {Integer},
        name: {String},
        team: {String}
      },
      goals: { 
        anytime: {Boolean},
        first: {Boolean},
        last: {Boolean}
      },
      assists: {Integer},
      shots: {
        total: {Integer},
        onTarget: {Integer}
      },
      cards: {
        yellow: {Boolean},
        red: {Boolean}
      },
      manOfTheMatch: {Boolean}
    }
  ],
  teamPerformance: {
    totalGoalsOverUnder: { 
      threshold: {Number},
      over: {Boolean} 
    },
    cleanSheet: {
      home: {Boolean},
      away: {Boolean}
    },
    bothTeamsToScore: {Boolean},
    totalCorners: {Integer},
    totalFouls: {
      home: {Integer},
      away: {Integer}
    }
  },
  bettingOdds: {
    bestValueBets: [{String}],
    safeBets: [{String}],
    highRiskBets: [{String}],
    arbitrageOpportunities: [{String}],
    liveBettingSuggestions: [{String}]
  },
  gameSpecific: {
    penaltyAwarded: {Boolean},
    penaltyConverted: {Boolean},
    substitutionImpact: {String},
    injuryTimeGoalsProbability: {Integer}
  },
  streakAndForm: {
    teamWinningStreak: {
      home: {Integer},
      away: {Integer}
    },
    headToHeadComparison: {String},
    homeAwayPerformance: {
      home: {String},
      away: {String}
    }
  },
  weatherInfluence: {
    temperature: {Integer},
    condition: {String},
    impactOnGame: {String}
  }
}
}`;


module.exports = responseFormat;