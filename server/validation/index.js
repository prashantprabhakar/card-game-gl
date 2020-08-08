const Joi = require('@hapi/joi');
const {throwError} = require('../utils');

const schema = {

    startGameValidation: Joi.object().keys({
        player1Id: Joi.number().min(1).required().error( _ => throwError('Player1Id is required and must be integer', 400)),
        player2Id: Joi.number().min(1).required().error( _ => throwError('Player2Id is required and must be integer', 400))
    }),

    pickCardValidation: Joi.object().keys({
        gameId: Joi.string().required().error( _ => throwError('Game Id is required and must be string', 400)),
        playerId: Joi.number().min(1).required().error( _ => throwError('Player Id is required and must be integer', 400)),
        choice: Joi.string().optional().valid('Club', 'Spade', 'Heart', 'Diamond', 'Red', 'Black').error(_ => throwError('Invalid choice value', 400))
    }),

    gameDetailvalidation: Joi.object().keys({
        gameId: Joi.string().required().error( _ => throwError('Game Id is required and must be string', 400)),
    }),


    addUserValidation: Joi.object().keys({
        name: Joi.string().min(2).required().error(_ => throwError("Name is mendatory", 400)),
        id: Joi.number().required().error(_ => 'User Id is required and must be int', 400),
    })

}

module.exports = schema;
