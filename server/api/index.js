const router = require('express').Router()
const GameRoute = require('./game')
const UserRoute = require('./user')


router.use('/game', GameRoute)
router.use('/user', UserRoute)

module.exports = router