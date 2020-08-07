module.exports = {

    mongo: {
        url: "mongodb://localhost/card-game",
        poolSize: 5,
    },
    
    server_port: 8080,
    WINNING_SCORE:  3,
    move_expiry_time: 20*60*1000, // 2 mins

    logging: {
        level: 'info',
        logDir: 'logs',
        logFile: 'game'
    }
}