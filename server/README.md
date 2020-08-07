
## Web Based Card Game

This is a web based card game with following features:
    * 2 players can play simultaneosuly
    * Each player will draw a card alernatively
    * If user gets 4 consecutive cards with higer denomination; player wins
    * Players can ask for card of specific suit or color
    * Game ends when either player wins or game is draw

### How to run
- git clone the repo
- cd server
- npm i
- node app.js


### APIs:

**Start Game**:
- URL: /game/start (POST)
- Params: playe1Id, player2Id
- returns: { success: true, gameId: <new Games Id>

**Pick A Card**:
- URL: /game/pick-card (POST)
- Params:
    - gameId: Id of game
    - playerId: Id of player picking card
    - choice: Choice ( can only be 'Club', 'Spade', 'Heart', 'Diamond', 'Red', 'Black')
- Returns: 
  ```sh
        {
            "success": true,
            "data": {
                "gameStatus": "COMPLETED",
                "winner": 2,
                "turn": 1,
                "pickedCard": 22,
                "playerScore": 3,
                "pickedCardDetails": {
                    "value": 9,
                    "color": "Black",
                    "suit": "Spade"
                }
            }
        }
    ```
    
** Game Details:**
- URL: /game/details (GET)
- Params: gameId
- Returns
    ```sh
    {
    "success": true,
    "data": {
        "turn": 1,
        "status": "COMPLETED",
        "winner": 2,
        "startedAt": "2020-08-07T05:34:37.259Z",
        "endAt": "2020-08-07T05:37:56.443Z",
        "updatedAt": "2020-08-07T05:37:56.443Z",
        "players": [
            {
                "playerId": 1,
                "moves": [
                    {
                        "value": 1,
                        "color": "Red",
                        "suit": "Heart"
                    },
                    {
                        "value": 8,
                        "color": "Red",
                        "suit": "Heart"
                    },
                    {
                        "value": 4,
                        "color": "Red",
                        "suit": "Diamond"
                    },
                    {
                        "value": 1,
                        "color": "Red",
                        "suit": "Club"
                    },
                    {
                        "value": 10,
                        "color": "Red",
                        "suit": "Diamond"
                    }
                ],
                "score": 1
            },
            {
                "playerId": 2,
                "moves": 
                    {
                        "value": 2,
                        "color": "Black",
                        "suit": "Spade"
                    },
                    {
                        "value": 3,
                        "color": "Red",
                        "suit": "Diamond"
                    },
                    {
                        "value": 4,
                        "color": "Black",
                        "suit": "Spade"
                    },
                    {
                        "value": 7,
                        "color": "Red",
                        "suit": "Heart"
                    }
                ],
                "score": 3
            }
        ]
    }
}
    ```
    



#### Optimization/Enhancements to be done:
- Implement cache
- Sepeatae In Progress games and completed games in DB for making faster read/write 
- Implement transactions in DB queries