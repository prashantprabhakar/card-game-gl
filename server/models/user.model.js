const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: String,
    isPlaying: {type: Boolean, default: false},
})

module.exports = mongoose.model('users', schema)