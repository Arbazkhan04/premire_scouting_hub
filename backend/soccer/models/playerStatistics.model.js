const mongoose = require("mongoose");

const PlayerStatisticSchema = new mongoose.Schema({
  playerId: Number, 
  season: Number,
  statistics: [
    {
      team: {
        id: Number,
        name: String,
        logo: String,
      },
      league: {
        id: Number,
        name: String,
        country: String,
        logo: String,
        flag: String,
        season: String,
      },
      games: {
        appearances: Number,
        lineups: Number,
        minutes: Number,
        number: Number,
        position: String,
        rating: String,
        captain: Boolean,
      },
      substitutes: {
        in: Number,
        out: Number,
        bench: Number,
      },
      shots: {
        total: Number,
        on: Number,
      },
      goals: {
        total: Number,
        conceded: Number,
        assists: Number,
        saves: Number,
      },
      passes: {
        total: Number,
        key: Number,
        accuracy: Number,
      },
      tackles: {
        total: Number,
        blocks: Number,
        interceptions: Number,
      },
      duels: {
        total: Number,
        won: Number,
      },
      dribbles: {
        attempts: Number,
        success: Number,
        past: Number,
      },
      fouls: {
        drawn: Number,
        committed: Number,
      },
      cards: {
        yellow: Number,
        yellowred: Number,
        red: Number,
      },
      penalty: {
        won: Number,
        committed: Number,
        scored: Number,
        missed: Number,
        saved: Number,
      },
    },
  ],
});



// push the stats id into the user profile statistics field

["save", "findOneAndUpdate"].forEach((hook) => {
    PlayerStatisticSchema.post(hook, async function (doc, next) {
      if (!doc) return next?.(); // Ensure doc exists for update operations
  
      try {
        const Player = mongoose.model("SoccerPlayer");
  
        const updatedPlayer = await Player.findOneAndUpdate(
          { playerId: doc.playerId },
          { $addToSet: { statistics: doc._id } }, // Prevent duplicate IDs
          { new: true, upsert: false }
        );
  
        if (!updatedPlayer) {
          return next(new CustomError(`SoccerPlayer with playerId ${doc.playerId} not found.`, 404));
        }
  
        next?.();
      } catch (error) {
        next?.(error instanceof CustomError ? error : new CustomError(error.message, 500));
      }
    });
  });

const PlayerStatistic = mongoose.model("PlayerStatistic", PlayerStatisticSchema);

module.exports = PlayerStatistic;
