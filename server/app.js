
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const connectMongo = require('./utils/connectMongo')
const { server_port, mongo } = require('./config')
const logger = require('./service/logger.service')
const apis = require('./api')

const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// API routes
app.use('/api/v1', apis)

connectMongo(mongo).then(()=>{
    app.listen(server_port, ()=>{
        logger.info(`Server started on port: http://localhost:${server_port}`)
    })
})
  