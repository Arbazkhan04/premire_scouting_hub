// const mongoose = require("mongoose");

// const FavoritesSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to User Model
//       required: true,
//     },

//     players: [
//       {
//         playerRef: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "SoccerPlayer", // Reference to SoccerPlayer Model
//           required: true,
//         },
//         playerId: {
//           type: String, // API Player ID
//           required: true,
//         },
//       },
//     ],
//     teams: [
//       {
//         teamRef: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "SoccerTeam", // Reference to Team Model
//           required: true,
//         },
//         teamId: {
//           type: String, // API Team ID
//           required: true,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true, // Automatically add createdAt and updatedAt
//   }
// );

// module.exports = mongoose.model("Favorites", FavoritesSchema);








const mongoose = require("mongoose");

const FavoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User Model
      required: true,
    },
    
    favourites: [
      {
        sportName: {
          type: String,
          enum: ["soccer", "football", "basketball"], // Allowed sports
          required: true,
        },
        players: [
          {
            playerRef: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "SoccerPlayer", // Generic reference to a Player Model
              required: true,
            },
            playerId: {
              type: String, // API Player ID
              required: true,
            },
          },
        ],
        teams: [
          {
            teamRef: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "SoccerTeam", // Generic reference to a Team Model
              required: true,
            },
            teamId: {
              type: String, // API Team ID
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

module.exports = mongoose.model("Favorites", FavoritesSchema);
