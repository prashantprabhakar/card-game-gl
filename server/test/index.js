const {shuffleArray, countUnique} = require('../utils')
const { CARDS } = require('../config/constants')


const testShuffle = () => {
    console.log("Testing card shuffling")
    let failedCounts = 0, testCount = 100
    for(let i=0; i<testCount; i++) {
        let shuffledCards = shuffleArray(CARDS)
        let uniqueCards = countUnique(shuffledCards)
        //console.log({uniqueCards, shuffledCards: shuffledCards})
        if(uniqueCards != CARDS.length) failedCounts++

    }
    if(failedCounts == 0) console.log(`Passed ${testCount} tests`) 
}


testShuffle()

