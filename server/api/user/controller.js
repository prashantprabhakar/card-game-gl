
const UserModel = require('../../models/user.model')
const {handleCatch, shuffleArray,  addMillisecondsToDate} = require('../../utils')
const { startGame, pickACard, gameDetails } = require('../../service/game.service')
const { addUserValidation, pickCardValidation, gameDetailvalidation } = require('../../validation')
const logger = require('../../service/logger.service')

exports.test = (req, res) => {
    return res.json({success: true, message: 'Game route working'})
}

exports.register = async(req, res) => {
    try {
        logger.info("Inside register user function", {payload: req.body})
        const validationData = addUserValidation.validate(req.body);
        if(validationData.error) {
            throw validationData.error;
        }

        logger.info("Validation done", {validationData})
        let { name, id } = validationData.value

        // check if user already exists
        let existingUser = await UserModel.findOne({id})
        console.log({existingUser})
        if(existingUser) {
            return res.status(400).json({success: false, message: "user already exists"})
        }

        let user = await new UserModel({
            name, id, isAvailable: true
        }).save()


        return res.status(200).json({success: true, user: user._id })
    } catch(error) {
        return handleCatch(res, error)
    }
}