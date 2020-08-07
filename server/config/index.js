module.exports = {

    mongo: {
        url: "mongodb://localhost/card-game",
        poolSize: 5,
    },
    
    server_port: 3000,
    WINNING_SCORE:  3,
    move_expiry_time: 2*60*1000, // 2 mins
}