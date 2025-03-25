// // import "dotenv/config";
// require("dotenv").config();

// const { ChatPerplexity } =require("@langchain/community/chat_models/perplexity");
// const { ChatPromptTemplate }= require("@langchain/core/prompts");
// const CustomError = require("../utils/customError");

// const llm = new ChatPerplexity({
//   model: "sonar",
//   temperature: 0,
//   maxTokens: undefined,
//   timeout: undefined,
//   maxRetries: 2,
//   // other params...
// });

// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     "system",
//     "You are a football prediction expert. Please analyze the asked match, and provide predictions with the following details: "
//       + "(1) Match Outcome: Win/Loss/Draw probability, correct score prediction, half-time/full-time result, first/last team to score, and margin of victory. "
//       + "(2) Player Performance: Likely goal scorers, anytime goal scorers, first/last goal scorers, assists leader, shot attempts & on-target shots, yellow/red card predictions, and man of the match. "
//       + "(3) Team Performance: Total goals over/under, clean sheet probability, both teams to score (BTTS), total corners over/under, total fouls committed. "
//       + "(4) Betting Odds & Recommendations: Best value bets, safe vs. high-risk bets, arbitrage opportunities, live in-game betting suggestions. "
//       + "(5) Game-Specific Predictions: Penalty predictions, substitutions impact, injury time goals probability. "
//       + "(6) Streak & Form-Based Predictions: Team winning streaks, head-to-head comparisons, home/away performance trends. "
//       + "(7) Weather & External Factors Impact: Weather-based predictions, referee influence. Provide your answer in a structured format for these predictions.",
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

// module.exports = {
//   callPerplexity,
// };

require("dotenv").config();

const { ChatPerplexity }=require("@langchain/community/chat_models/perplexity");
const { ChatPromptTemplate }=require("@langchain/core/prompts");

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

const generatePredictions = async (input) => {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a football prediction expert. Please analyze the asked match, and provide predictions with the following details: " +
          "(1) Match Outcome: Win/Loss/Draw probability, correct score prediction, half-time/full-time result, first/last team to score, and margin of victory. " +
          "(2) Player Performance: Likely goal scorers, anytime goal scorers, first/last goal scorers, assists leader, shot attempts & on-target shots, yellow/red card predictions, and man of the match. " +
          "(3) Team Performance: Total goals over/under, clean sheet probability, both teams to score (BTTS), total corners over/under, total fouls committed. " +
          "(4) Betting Odds & Recommendations: Best value bets, safe vs. high-risk bets, arbitrage opportunities, live in-game betting suggestions. " +
          "(5) Game-Specific Predictions: Penalty predictions, substitutions impact, injury time goals probability. " +
          "(6) Streak & Form-Based Predictions: Team winning streaks, head-to-head comparisons, home/away performance trends. " +
          "(7) Weather & External Factors Impact: Weather-based predictions, referee influence. Response strictly in following JSON format {responseFormatt}.",
      ],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(llm);
    const result = await chain.invoke(input);
    console.log("Full Response:", JSON.stringify(result.content, null, 2));
    return result.content;
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
          home: {Float}, 
          away: {Float}, 
          draw: {Float} 
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
          assists: {Float},
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
          threshold: {Float},
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
        injuryTimeGoalsProbability: {Float}
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
        temperature: {Float},
        condition: {String},
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
  const escapedResponse = escapeJSON(JSON.stringify(rawResponse));
  const formattedResponse = await reformatResponse({
    escapedResponse,
    responseFormatt: responseFormat,
  });
  if (!formattedResponse) return;
  return formattedResponse;
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
