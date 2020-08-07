
exports.handleCatch = (res, error, metaData={}) => {
  let message = error.message || 'Something went wrong'
  console.log(message, {error, metaData})
  return res.status(500).json({success: false, message})

}

exports.shuffleArray = (array) =>  {
  let arr = []
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      arr[i] = array[j]
      arr[j] = array[i]
    }
    return arr
}

exports.throwError = (message='Unkown message', status, errName) =>  {
  const err = new Error(message);
  err.statusCode = status || 400;
  if (errName) {
    err.errName = errName;
  }
  throw err;
},


exports.addMillisecondsToDate = (date, ms) =>  new Date(+new Date(date)+ms)
