const mongoose = require('mongoose')

const { GAME_STATUS, GAME_STATUS_ENUM } = require('../config/constants')


const schema = new mongoose.Schema({
    players: [Number],
    availableDeck: [Number],
    turn: Number,
    //moveExpiresOn: Date,
    status: { type: String, enum: GAME_STATUS_ENUM, default: GAME_STATUS.NEW},
    winner: Number,
    startedAt: Date,
    endAt: Date, // cab be skipped since last updated at will be end at, but let's seperate both for future
    updatedAt: Date,


})

module.exports = mongoose.model('games', schema)