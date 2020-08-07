const {handleCatch, shuffleArray,  addMillisecondsToDate} = require('../../utils')
const { startGame, pickACard, gameDetails } = require('../../service/game.service')

const { startGameValidation, pickCardValidation, gameDetailvalidation } = require('../../validation')

exports.test = (req, res) => {
    return res.json({success: true, message: 'Game route working'})
}

exports.startGame = async(req, res) => {
    try {
        const validationData = startGameValidation.validate(req.body);
        if(validationData.error) {
            throw validationData.error;
        }

        console.log({validationData})

        let { player1Id, player2Id } = validationData.value

        if(player1Id === player2Id) return res.status(400).json({success: false, message: 'Player can not join twice'}) 

        // add validation on inputs
        let result = await startGame(player1Id, player2Id)

        if(!result.success) {
            return res.status(400).json(result)
        }

        return res.status(200).json(result)
    } catch(error) {
        return handleCatch(res, error)
    }
}

exports.pickACard = async(req, res) => {
    try {
        const validationData = pickCardValidation.validate(req.body)
        if(validationData.error) {
            throw validationData.error;
        }

        let { gameId, playerId, choice} = validationData.value
        let result = await pickACard(gameId, playerId, choice)
        if(!result.success) {
            return res.status(400).json(result)
        }
        return res.status(200).json(result)
    } catch(error) {
        return handleCatch(res, error)
    }
}

exports.gameDetails = async(req, res) => {
    try {
        const validationData = gameDetailvalidation.validate(req.query)
        if(validationData.error) {
            throw validationData.error;
        }

        let {gameId} = validationData.value
        let data = await gameDetails(gameId)
        return res.status(200).json(data)

    } catch(error) {
        return handleCatch(res, error)
    }
}