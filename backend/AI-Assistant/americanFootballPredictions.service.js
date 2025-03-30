require("dotenv").config();

const {
  ChatPerplexity,
} = require("@langchain/community/chat_models/perplexity");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const llm = new ChatPerplexity({
  model: "sonar-pro",
  temperature: 0,
  maxTokens: 4096,
  timeout: undefined,
  maxRetries: 2,
  // other params...
});

// const responseFormat = `{ "translation": "<translated_text>" }`;

// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     "system",
//     "You are a football prediction expert. Please analyze the asked match, and provide predictions with the following details: " +
//       "(1) Match Outcome: Win/Loss/Draw probability, correct score prediction, half-time/full-time result, first/last team to score, and margin of victory. " +
//       "(2) Player Performance: Likely goal scorers, anytime goal scorers, first/last goal scorers, assists leader, shot attempts & on-target shots, yellow/red card predictions, and man of the match. " +
//       "(3) Team Performance: Total goals over/under, clean sheet probability, both teams to score (BTTS), total corners over/under, total fouls committed. " +
//       "(4) Betting Odds & Recommendations: Best value bets, safe vs. high-risk bets, arbitrage opportunities, live in-game betting suggestions. " +
//       "(5) Game-Specific Predictions: Penalty predictions, substitutions impact, injury time goals probability. " +
//       "(6) Streak & Form-Based Predictions: Team winning streaks, head-to-head comparisons, home/away performance trends. " +
//       "(7) Weather & External Factors Impact: Weather-based predictions, referee influence. Response strictly in following JSON format {responseFormat}.",
//   ],
//   ["human", "{input}"],
// ]);

// const chain = prompt.pipe(llm);

// const callPerplexity = async (prompt) => {
//   try {
//     const result = await chain.invoke(prompt);

//     console.log(result);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// const generatePredictions = async (input) => {
//   try {
//     const prompt = ChatPromptTemplate.fromMessages([
//       [
//         "system",
//         "You are an expert in American football predictions. Please analyze the given game and provide predictions with the following details: " +
//           "(1) Match Outcome: Win probability for each team, correct score prediction, half-time/full-time result, first team to score, margin of victory, spread betting analysis (line, home/away odds), and over/under total points prediction. " +
//           "(2) Player Performance: Expected passing, rushing, receiving stats (yards, touchdowns, completion %, sacks, interceptions, forced fumbles, tackles), special teams performance (field goals made, field goal %, kickoff return yards). " +
//           "(3) Team Performance: Expected total points, turnovers forced, total yards gained, time of possession, third-down conversions, red zone efficiency, defensive touchdowns, and special teams performance. " +
//           "(4) Betting Odds & Recommendations: Best value bets, safe vs. high-risk bets, arbitrage opportunities, and live betting suggestions. " +
//           "(5) Game-Specific Predictions: Expected penalties, successful coach challenges, fourth-down conversion rate, onside kick success probability, and impact of injuries. " +
//           "(6) Streak & Form-Based Predictions: Team winning streaks, head-to-head comparisons, and home/away performance trends. " +
//           "(7) Weather & External Factors Impact: Weather-based predictions, impact on passing and rushing plays, and overall game conditions. " +
//           "Response strictly in the following JSON format: {responseFormatt}.",
//       ],
//       ["human", "{input}"],
//     ]);

//     const chain = prompt.pipe(llm);
//     const result = await chain.invoke(input);
//     console.log("Full Response:", JSON.stringify(result.content, null, 2));
//     return result.content;
//   } catch (error) {
//     console.error("Error generating predictions:", error);
//     return null;
//   }
// };

const generatePredictions = async (input) => {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert in American football predictions. Please analyze the given game and provide predictions strictly in the following JSON format without any extra text:{responseFormat}.Ensure that all fields are filled according to the schema. If data is unavailable, use null or a reasonable placeholder.`,
      ],
      ["human", input],
    ]);

    const chain = prompt.pipe(llm);
    const result = await chain.invoke(input);

    console.log("Full Response:", JSON.stringify(result.content, null, 2));

    return JSON.parse(result.content); // Ensure it's a valid JSON object
  } catch (error) {
    console.error("Error generating predictions:", error);
    return null;
  }
};

// Step 2: Reformat the Response to Match Schema
const reformatResponse = async (response) => {
  try {
    console.log(response);
    const reformatPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Reformat the given JSON response to match the {responseFormatt} monogodb schema.Response strictly in JSON format",
      ],
      ["human", "{escapedResponse}"],
    ]);

    const chain = reformatPrompt.pipe(llm);
    const formattedResult = await chain.invoke(response);
    console.log(
      "Formatted Response:",
      JSON.stringify(formattedResult.content, null, 2)
    );
    return JSON.parse(formattedResult.content); // Ensure response is JSON
  } catch (error) {
    console.error("Error reformatting response:", error);
    return null;
  }
};

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

// callPerplexity({
//   responseFormat: responseFormat,
//   // input_language: "English",
//   // output_language: "German",
//   input: "Nottm Forest vs West Ham on Tue,1 April 2025, Premier League",
// });

const predictonSchema = `
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


`;

// Run the pipeline
const runPipeline = async (input) => {
  // const input = {
  //   responseFormatt: `${JSON.stringify(responseFormat)}`,
  //   // input_language: "English",
  //   // output_language: "German",
  //   input: "Nottm Forest vs West Ham on Tue,1 April 2025, Premier League",
  // };

  const rawResponse = await generatePredictions(input);
  if (!rawResponse) return;
  console.log("Full Response:", JSON.stringify(rawResponse, null, 2));
//   const escapedResponse = escapeJSON(JSON.stringify(rawResponse));
//   const formattedResponse = await reformatResponse({
//     escapedResponse,
//     responseFormatt: responseFormat,
//   });
//   if (!formattedResponse) return;
  return rawResponse;
  // await saveToDatabase(formattedResponse);
};

const escapeJSON = (jsonString) => {
  return jsonString.replace(/{/g, "{{").replace(/}/g, "}}");
};

// await runPipeline();

module.exports = {
  generatePredictions,
  reformatResponse,
  runPipeline,
};
