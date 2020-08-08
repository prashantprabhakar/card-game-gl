const UserModel = require('../models/user.model')

exports.updateAvailibilityStatus = (players, status) => {
    return UserModel.updateMany({id: {$in: players}}, {$set: {isAvailable: status }})
}