const mongoose = require('mongoose')

const schema = new mongoose.Schema({
   gameId: { type: mongoose.Schema.Types.ObjectId, ref: "games" },
   playerId: Number,
   moves: [Number],
   score: {type: Number, default: 0},
   updatedAt: Date,

})

module.exports = mongoose.model('game_players', schema)