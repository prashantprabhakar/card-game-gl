
const logger = require('../service/logger.service')

exports.handleCatch = (res, error, metaData={}) => {
  let message = error.message || 'Something went wrong'
  logger.error(message, {error, metaData})
  return res.status(500).json({success: false, message})

}

exports.shuffleArray = (array) =>  {
  let arr = [].concat(array)
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
}


exports.countUnique = (iterable) => new Set(iterable).size;

exports.throwError = (message='Unkown message', status, errName) =>  {
  const err = new Error(message);
  err.statusCode = status || 400;
  if (errName) {
    err.errName = errName;
  }
  throw err;
},


exports.addMillisecondsToDate = (date, ms) =>  new Date(+new Date(date)+ms)
