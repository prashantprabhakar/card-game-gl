
const GameModel = require('../models/game.model')
const UserModel = require('../models/user.model')
const GamePlayerModel = require('../models/gamePlayer.model')

const cardDetail = require('../utils/cardDetail')
const {shuffleArray,  addMillisecondsToDate} = require('../utils')
const {GAME_STATUS, CARDS } = require('../config/constants')
const { move_expiry_time, WINNING_SCORE } = require('../config')
const logger = require('./logger.service')

/**
 * 
 */
exports.startGame = async(player1Id, player2Id) => {
    try {

        logger.info("Inside start game service", { player1Id, player2Id})

        // initialize a game
        let shuffledDeck = shuffleArray(CARDS)
        
        logger.info("Creating new game")
        let game = await new GameModel({
            players: [player1Id, player2Id],
            availableDeck: shuffledDeck,
            turn: player1Id,
            status: GAME_STATUS.INPROGRESS,
            startedAt: new Date(),
            updatedAt: new Date(),

        }).save()

        logger.info("Adding entries in game player db")

        // add entry in game player db
        await GamePlayerModel.insertMany([
            { gameId: game.id, playerId: player1Id, moves: [], score: 0, updatedAt: new Date()},
            { gameId: game.id, playerId: player2Id, moves: [], score: 0, updatedAt: new Date()},
        ])

        logger.info("Game added successfully",{ gameId: game.id })
        return {success: true, gameId: game.id }

    } catch(err) {
       throw err
    }

}

/**
 * Validate player and game
 * Check if move time expired
 */
exports.pickACard = async(gameId, playerId, choice) => {
    try {
        logger.info("Inside pick card service", { gameId, playerId, choice})
        // check if game and player are valid
        let game = await GameModel.findOne({ _id: gameId, status: GAME_STATUS.INPROGRESS})
        if(!game) {
            logger.info('The Game is either completed or is invalid')
            return { success: false, message: 'The Game is either completed or is invalid'}
        }
        
        // check if valid player is making move
        if(game.turn !== playerId) {
            logger.info("Invalid player turn", { turn: game.turn, playerId })
            return { success: false, message: 'Not your turn'}
        }

        let player2 = game.players.filter(p => p!=playerId)[0]

        // check if time expired: Should be in seperate fn
        let expiryTime = addMillisecondsToDate(game.updatedAt, move_expiry_time)
        if(new Date() > expiryTime) {
            logger.info("Time to pick card expired", { expiryTime, currentTime: new Date() })

            // @TODO: We can declare other player winner here; but for now; we have kept the status to be ABORTED and no one wins
            
            await GameModel.updateOne({
                _id: gameId
            }, {
                $set: {
                    updatedAt: new Date(),
                    endAt: new Date(),
                    comment: `Player ${game.turn} left the game`,
                    status: GAME_STATUS.ABORTED
                }
            })
            return { success: true, data: {
                gameStatus: GAME_STATUS.ABORTED,
                movedBy: playerId,
                turn: player2
            }}

        }

        //perform operation
        let pickedCard = chooseCard(game.availableDeck, choice)
        let pickedCardDetails = cardDetail[pickedCard]
        logger.info("Picked card", { pickedCard, pickedCardDetails })

        // fetch last 4 cards from array of player move ( @TODO: Optimize this)
        let gamePlayer = await GamePlayerModel.findOne({ gameId, playerId }, {'moves': {'$slice': -1}})

        let lastCard = gamePlayer.moves[0] || 0
        let playerScore = lastCard ? ( pickedCardDetails.value > cardDetail[lastCard].value ? gamePlayer.score+1 : 1 ) :  1

        
        let isWinningCond = playerScore == WINNING_SCORE
        let isDrawCond = isWinningCond ? false : game.availableDeck.length == 0 


        logger.info("Game Details", { lastCard, lastCardDetail: cardDetail[lastCard], newTurn: player2, isWinningCond, isDrawCond, playerScore })
        logger.info("Adding move in gane player DB")
        
        // update gane player model
        await GamePlayerModel.updateOne({
            _id: gamePlayer._id
        }, {
            $set: {
                score: playerScore,
                updatedAt: new Date(),
            },
            $push: { moves: pickedCard }
        })


        let gameUpdateObj = {
            updatedAt: new Date(),
            availableDeck: game.availableDeck, // check if pop worked
            turn: player2,
            status: (isWinningCond || isDrawCond) ? GAME_STATUS.COMPLETED : GAME_STATUS.INPROGRESS,
            endAt: (isWinningCond || isDrawCond) ? new Date() : undefined,
            winner: isWinningCond ? playerId : undefined
        }
        
        logger.info("Updating info in game table", { gameUpdateObj })
        await GameModel.updateOne({ _id: gameId}, {$set: gameUpdateObj })

        return {success: true, data: {
            gameStatus: gameUpdateObj.status,
            winner: gameUpdateObj.winner,
            turn: player2,
            pickedCard,
            playerScore,
            pickedCardDetails,
            movedBy: playerId,
        }}
        

    } catch(err) {
       throw err
    }
}

exports.gameDetails = async(gameId) => {
    try {
        logger.info("Inside game details service", { gameId })
        let [game, gamePlayers] = await Promise.all([
            GameModel.findOne({_id: gameId }),
            GamePlayerModel.find({gameId})
        ])

       let players = gamePlayers.map(gp => ({
           playerId: gp.playerId,
           moves: gp.moves.map(move => cardDetail[move]),
           score: gp.score
       }))

        let data = { 
            // availableDeck: game.availableDeck, // Can not reveal to UI
            turn: game.turn,
            //moveExpiresOn,
            status: game.status,
            winner: game.winner,
            startedAt: game.startedAt,
            endAt: game.endAt,
            updatedAt: game.updatedAt,
            players,
        }

        logger.info("Game details", {data})
        
       return { success: true, data }
        
    } catch(err) {
        throw err
    }
}

// Complexity is O(n) if choice is provided else is O(1)
// O(n) can further be reduced to O(1) if we break deck into each suite and store accordingly
const chooseCard = (deck, choice) => {
    if(!choice) return deck.pop()
    let lastIndex = deck.length-1
    let choiceCriteria = (choice === "Red" || choice === "Black") ? 'color' : 'suit'
    for(let i=lastIndex; i>=0; i--) {
        let card = cardDetail[deck[i]]
        if(card[choiceCriteria] == choice) {
            // swap last and this card
            [deck[lastIndex], deck[i]] = [deck[i], deck[lastIndex]] 
            return deck.pop()
        }
    }

    // Can return error here
    logger.info("No card found with given choice")
    return deck.pop()
}