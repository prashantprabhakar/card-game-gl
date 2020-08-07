const router = require('express').Router()
const controller = require('./controller')


router.get('/test', controller.test)
router.post('/start', controller.startGame)
router.post('/pick-card', controller.pickACard)
router.get('/details', controller.gameDetails)

module.exports = router