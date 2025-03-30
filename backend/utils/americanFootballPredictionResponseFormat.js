const responseFormat = `{ 
    gameId: {Integer},
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
          away: {Integer} 
        },
        correctScore: { 
          home: {Integer},
          away: {Integer}
        },
        halftimeFulltime: {
          halftime: {String}, 
          fulltime: {String}
        },
        firstToScore: {String}, // "Home", "Away"
        marginOfVictory: {Integer},
        spreadBetting: { 
          line: {Number},
          homeOdds: {Number},
          awayOdds: {Number}
        },
        overUnderTotalPoints: { 
          threshold: {Number},
          over: {Boolean}
        }
      },
      playerPerformance: [
        {
          player: {
            id: {Integer},
            name: {String},
            team: {String},
            position: {String}
          },
          stats: {
            passing: { 
              yards: {Integer}, 
              touchdowns: {Integer}, 
              interceptions: {Integer}, 
              completionPercentage: {Number}
            },
            rushing: { 
              yards: {Integer}, 
              touchdowns: {Integer}, 
              yardsPerCarry: {Number}
            },
            receiving: { 
              receptions: {Integer}, 
              yards: {Integer}, 
              touchdowns: {Integer}
            },
            defense: { 
              sacks: {Integer}, 
              interceptions: {Integer}, 
              forcedFumbles: {Integer}, 
              tackles: {Integer}
            },
            specialTeams: { 
              fieldGoalsMade: {Integer}, 
              fieldGoalPercentage: {Number}, 
              kickoffReturns: {Integer}
            }
          }
        }
      ],
      teamPerformance: {
        totalPoints: {Integer},
        turnoversForced: {Integer},
        totalYardsGained: {Integer},
        timeOfPossession: {Number}, // in minutes
        thirdDownConversions: {Integer},
        redZoneEfficiency: {Number}, // Percentage
        defensiveTouchdowns: {Integer},
        specialTeamsPerformance: { 
          returnYards: {Integer}, 
          fieldGoals: {Integer}
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
        penalties: {Integer},
        challenges: { 
          total: {Integer}, 
          successful: {Integer} 
        },
        fourthDownConversions: {Integer},
        successfulOnsideKicks: {Integer},
        injuryImpact: {String}
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
        temperature: {Integer}, // °C or °F
        condition: {String}, // "Rainy", "Sunny", etc.
        impactOnGame: {String}
      }
    }
  }`;
  
  module.exports = responseFormat;
  