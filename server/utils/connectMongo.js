const mongoose = require('mongoose')

module.exports = async ({url, poolSize})=>{
  let db = await mongoose.connect(url, {useNewUrlParser: true, poolSize: poolSize || 5, })

  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err)
    process.exit(-1)
  })

  return db
}
