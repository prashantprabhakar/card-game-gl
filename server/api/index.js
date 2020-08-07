const router = require('express').Router()
const GameRoute = require('./game')


router.use('/game', GameRoute)

module.exports = router