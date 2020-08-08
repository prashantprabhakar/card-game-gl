
const UserModel = require('../../models/user.model')
const {handleCatch} = require('../../utils')
const { startGame, pickACard, gameDetails } = require('../../service/game.service')
const { updateAvailibilityStatus } = require('../../service/user.service')
const { startGameValidation, pickCardValidation, gameDetailvalidation } = require('../../validation')
const  { GAME_STATUS } = require('../../config/constants')
const logger = require('../../service/logger.service')


exports.test = (req, res) => {
    return res.json({success: true, message: 'Game route working'})
}

exports.startGame = async(req, res) => {
    try {
        logger.info("Inside start game route", {payload: req.body})
        const validationData = startGameValidation.validate(req.body);
        if(validationData.error) {
            throw validationData.error;
        }

        logger.info("Validation done", {validationData})
        let { player1Id, player2Id } = validationData.value

        if(player1Id === player2Id) {
            logger.error("Same player id was provided for both player1 and player2", {player1Id, player2Id})
            return res.status(400).json({success: false, message: 'Player can not join twice'}) 
        }

        // check if players are free: Commented for now; since we are not maintaining user collection and hence no check if user is already playing
        // can be done in single query
        let [player1, player2] = await Promise.all([
            UserModel.findOne({id: player1Id}),
            UserModel.findOne({id: player2Id})
        ])

        if(!player1 || !player2) {
            return res.status(400).json({success: false, message: 'Either of the player does not exist'})
        }

        if(!player1.isAvailable) return res.status(400).json({success: false, message: `Player 1: ${player1Id} is not available`})
        if(!player2.isAvailable) return res.status(400).json({success: false, message: `Player 2: ${player2Id} is not available`})


        // add validation on inputs
        let result = await startGame(player1Id, player2Id)

        if(!result.success) {
            return res.status(400).json(result)
        }

        // update isPlaying status in db
        await updateAvailibilityStatus([player1Id, player2Id], false)

        return res.status(200).json(result)
    } catch(error) {
        return handleCatch(res, error)
    }
}

exports.pickACard = async(req, res) => {
    try {
        logger.info("Inside pick card route", {payload: req.body})
        const validationData = pickCardValidation.validate(req.body)
        if(validationData.error) {
            throw validationData.error;
        }

        logger.info("Validation done", {validationData})
        let { gameId, playerId, choice} = validationData.value
        let result = await pickACard(gameId, playerId, choice)

        if(!result.success) {
            return res.status(400).json(result)
        }

        if(result.data.gameStatus === GAME_STATUS.COMPLETED || result.data.gameStatus === GAME_STATUS.ABORTED) {
            await updateAvailibilityStatus([result.data.movedBy, result.data.turn],  true)
        }

        return res.status(200).json(result)
    } catch(error) {
        return handleCatch(res, error)
    }
}

exports.gameDetails = async(req, res) => {
    try {
        logger.info("inside game details route", {payload: req.query})
        const validationData = gameDetailvalidation.validate(req.query)
        if(validationData.error) {
            throw validationData.error;
        }
        logger.info("Validation done", {validationData})
        let {gameId} = validationData.value
        let data = await gameDetails(gameId)
        return res.status(200).json(data)

    } catch(error) {
        return handleCatch(res, error)
    }
}