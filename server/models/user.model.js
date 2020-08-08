const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: String,
    id: {type: Number, required: true},
    isAvailable: {type: Boolean, default: true},
})

module.exports = mongoose.model('users', schema)