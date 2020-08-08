const router = require('express').Router()
const controller = require('./controller')


router.get('/test', controller.test)
router.post('/register', controller.register)

module.exports = router