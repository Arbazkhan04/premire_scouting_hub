const mongoose = require("mongoose");
const CustomError = require("../../utils/customError");

const PlayerSchema = new mongoose.Schema(
  {
    playerId: {
      type: Number, // API's Player ID
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    age: {
      type: Number,
    },
    birth: {
      date: { type: Date },
      place: { type: String },
      country: { type: String },
    },
    nationality: {
      type: String,
    },
    height: {
      type: String, // API provides as "180 cm"
    },
    weight: {
      type: String, // API provides as "70 kg"
    },
    number: {
      type: Number, // Jersey number
    },
    position: {
      type: String,
    },
    photo: {
      type: String, // URL to player’s photo
    },
    seasons: [
        {
          type: Number, // Array of years only (e.g., 2020, 2021)
        },
      ],
      statistics: [
        {
          type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds referencing PlayerStatistics
          ref: "PlayerStatistics",
        },
      ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// // Middleware to validate referenced fields
// PlayerSchema.pre("save", async function (next) {
//   try {
//     if (this.statistics) {
//       const statsExists = await mongoose.model("PlayerStatistics").findById(this.statistics);
//       if (!statsExists) {
//         return next(new CustomError(`PlayerStatistics with ID ${this.statistics} does not exist.`, 400));
//       }
//     }
//     next();
//   } catch (error) {
//     next(error instanceof CustomError ? error : new CustomError(error.message, 500));
//   }
// });

module.exports = mongoose.model("SoccerPlayer", PlayerSchema);
