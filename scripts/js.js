console.log('hello stratego')

//  grab canvas element 
const canvas = document.querySelector('#canvas')
const output = document.querySelector('#play')

const ctx = canvas.getContext('2d')
//  set canvas width and height
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

const gamemodeButton = document.querySelector('#gamemode-button')
gamemodeButton.addEventListener('click', ()=> {
    output.innerHTML = 'No other gamemodes available. Try again in the future.'
})
const instructionsButton = document.querySelector('#instructions-button')
const instructionsSection = document.querySelector('#instructions')
instructionsButton.addEventListener('click', ()=> {
    instructionsSection.scrollIntoView(true)
})
/*-------------IMPORTANT FUNCTIONS AND BOOLEANS-------------------------------------------*/

let gameStatus = true
let gameReady = false
let gameStarted = false
// https://masteringjs.io/tutorials/fundamentals/compare-arrays
// function to compare arrays, returns true if two arrays equal
function arrayEquals(a,b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.every((val,index) => val === b[index])
}

// function to reset the board with updated positions
const newBoard = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // re render the game board 
    gameSpaceArray.forEach(item => {
        item.renderSpace() 
    })
    //re render each team of soldiers(with the updated value from the move )
    redTeam.forEach(item => {
        if (item.alive === true) {
            item.renderSoldier()
        }
    })
    blueTeam.forEach(item => {
        if (item.alive===true) {
            item.renderSoldier()
        }
    })
    
}

// function to shuffle an array 
// Fisher-Yates Shuffle 
function shuffle(array) {
let currentIndex = array.length,  randomIndex;

// While there remain elements to shuffle.
while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
    array[randomIndex], array[currentIndex]];
}

return array;
}

// function to determine the position of an object (space, redsoldier, bluesoldier)
// gives position as [column,row]
// when a player clicks, we need to know which token is being clicked
// designate by row and column of clicking event 
function findPosition(x,y) {
let column = 0
let row = 0
switch(true) {
    case (x<(1*canvas.width/8)): 
        column = 0
        break
    case (x<(2*canvas.width/8)): 
        column = 1
        break
    case (x<(3*canvas.width/8)): 
        column = 2
        break
    case (x<(4*canvas.width/8)): 
        column = 3
        break
    case (x<(5*canvas.width/8)): 
        column = 4
        break
    case (x<(6*canvas.width/8)): 
        column = 5
        break
    case (x<(7*canvas.width/8)): 
        column = 6
        break
    case (x<(canvas.width)): 
        column = 7
        break
}
switch(true) {
    case (y<(1*canvas.height/8)): 
        row = 0
        break
    case (y<(2*canvas.height/8)): 
        row = 1
        break
    case (y<(3*canvas.height/8)): 
        row = 2
        break
    case (y<(4*canvas.height/8)): 
        row = 3
        break
    case (y<(5*canvas.height/8)): 
        row = 4
        break
    case (y<(6*canvas.height/8)): 
        row = 5
        break
    case (y<(7*canvas.height/8)): 
        row = 6
        break
    case (y<(8*canvas.height/8)): 
        row = 7
        break
}
return [column, row]
// this gives us our x and y coordinates on the grid( 
// where X is the column# and Y is the row#)
// can we combine these into a single 'space'? 

// create an array that stores the information for each space? 
// build that into our gameSpaceArray 
// -- needs to have a soldier property 
}

// handles keyboard input 
// https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
const movementHandler = function(item) {
    // console.log(e.key)
    const movementFunction = function(e) {
        switch(e.key) {
            case('w'):
            case('ArrowUp'):
                if (item.moveForward()===false) {
                    playerTurn()
                }
                else {
                    console.log('player turn is over')
                    if (gameStatus ===true) {
                        setTimeout(cpuTurn,2000)
                    } else {
                        console.log('game over!')
                    }
                }
                break
            case('s'):
            case('ArrowDown'):
                if (item.moveBack()===false) {
                    playerTurn()
                }
                else {
                    console.log('player turn is over')
                    if (gameStatus ===true) {
                        setTimeout(cpuTurn,2000)
                    } else {
                        console.log('game over!')
                    }
                }
                break
            case('a'):
            case('ArrowLeft'):
                if (item.moveLeft()===false){
                    playerTurn()
                } else {
                    console.log('player turn is over')
                    if (gameStatus ===true) {
                        setTimeout(cpuTurn,2000)
                    } else {
                        console.log('game over!')
                    }
                }
                break
            case('d'):
            case('ArrowRight'):
                if (item.moveRight()===false) {
                    playerTurn()
                } else {
                    console.log('player turn is over')
                    if (gameStatus ===true) {
                        setTimeout(cpuTurn,2000)
                    } else {
                        console.log('game over!')
                    }
                }
                break
            default: 
                playerTurn()
        }
        e.stopPropagation()
        newBoard()
    }
    
    return movementFunction
}
const skirmish = function(attackingPiece, defendingPiece) {
    // attacking piece will always be a soldier(since flag cannot move)
    // defending piece might be flag. double check
    attackingPiece.revealed = true
    defendingPiece.revealed = true
    const fightingSpacePosition = gameSpaceArray.findIndex((space) => {
        return arrayEquals(space.position, defendingPiece.position)
    })
    const fightingSpace = gameSpaceArray[fightingSpacePosition]
    if (defendingPiece.rank === 'f') {
        gameStatus = false
        console.log(`The flag has been captured! ${attackingPiece.color} wins!`)
        output.innerHTML=`The flag has been captured! ${attackingPiece.color} wins!`
    }
    // if the defender has a weaker (higher number) rank, he loses and is removed. 
    else if (defendingPiece.rank>attackingPiece.rank) {
        console.log(`${attackingPiece.color} ${attackingPiece.rank} beats ${defendingPiece.color} ${defendingPiece.rank}`)
        defendingPiece.alive = false
        defendingPiece.position = null
        fightingSpace.teamColor = attackingPiece.color
        output.innerHTML= `${attackingPiece.color} ${attackingPiece.rank} beats ${defendingPiece.color} ${defendingPiece.rank}`
    }
    // if the defender is stronger, he wins and kicks the other player out 
    else if (defendingPiece.rank<attackingPiece.rank) {
        console.log(`${attackingPiece.color} ${attackingPiece.rank} loses to ${defendingPiece.color} ${defendingPiece.rank}`)
        attackingPiece.alive = false
        attackingPiece.position = null
        fightingSpace.teamColor = defendingPiece.color
        output.innerHTML= `${attackingPiece.color} ${attackingPiece.rank} loses to ${defendingPiece.color} ${defendingPiece.rank}`
    }
    else if (defendingPiece.rank===attackingPiece.rank) {
        console.log('Draw. Both soldiers are out')
        attackingPiece.alive = false
        defendingPiece.position = null
        defendingPiece.alive = false
        attackingPiece.position = null
        fightingSpace.teamColor = ""
        output.innerHTML = `${attackingPiece.color} ${attackingPiece.rank} and ${defendingPiece.color} ${defendingPiece.rank} took each other out!`
    }
    
}

/*---------------GAME FLOW --------------------------------------------------------------------*/

// set up the board
// gamespace class 
class GameSpace {
    constructor(column, row, color, isOpen) {
        // the x position is the width of the entire board(canvas.width) times the column number
        // and divided by 8. 
        this.x = canvas.width*column/8
        this.y = canvas.height*row/8
        this.width = canvas.width/8
        this.height = canvas.height/8
        // position on the grid: 
        this.position = findPosition(this.x, this.y) 
        this.color = color 
        // movable space? 
        this.openSpace = isOpen
        // cannot move onto a space shared by a teammate. we need to know which team color occupies the space, if any
        this.teamColor = ""
        // store the rank of the soldier occupying the space, if there is one
        this.currentSoldier = ""
        // if openSpace = false, player won't be able to move there
    }
    renderSpace() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}
// make an array of the entire gameboard using for loop
// added to array for easy access/manipulation
let gameSpaceArray = []
for (let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
        //We have designated "lake" spaces that are not passable. Make them lightblue. 
        if (
            (i===3 && j===1) || (i===4 && j===1) ||
            (i==3 && j===2) || (i===4 && j===2)  ||
            (i==3 && j===5) || (i===4 && j===5)  ||
            (i==3 && j===6) || (i===4 && j===6) ) {
            let nextSpace = new GameSpace(j,i, '#69fcff', false)
            gameSpaceArray.push(nextSpace) 
            } 
        // create checkerboard appearance 
        else if (
            i%2===0 && j%2===0 || 
            i%2>0 && j%2>0 ) {
                let nextSpace = new GameSpace(j,i, '#b4f7a1', true)
                gameSpaceArray.push(nextSpace)  
            } 
            else {
                let nextSpace = new GameSpace(j,i, 'lightgreen', true)
                gameSpaceArray.push(nextSpace)  
            }
        
                 
    }
}


// create a class for all player pieces on each team

// array to store all possible soldier ranks 
let redSoldierRanks = [1,2,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,6,7,7,7,7,7,'f']

// Blue team (player 1)
class BlueSoldier {
    static total = 24
    constructor(x, y) {
        this.rank = '#'
        this.x = x 
        this.y = y
        // soldier status (alive or not)
        this.alive=true
        this.color = 'blue'
        this.revealed = true
        // this helps us correlate position of soldier with position on grid 
        this.position = findPosition(this.x,this.y)
    }
    //render function for the soldier
    renderSoldier() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y, canvas.width/12, canvas.height/12)
        // blue team rank will always show
        this.showRank()
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        gameSpaceArray[currentSpace].teamColor = this.color
        gameSpaceArray[currentSpace].currentSoldier = this.rank
        
    }
    showRank() {
        ctx.fillStyle = 'white'
        ctx.font = '20px Comic Sans MS'
        if (this.rank==='f') {
            ctx.fillText('⛳️', this.x+(canvas.width/45) , this.y+(canvas.width/17))
        }
        else {
            ctx.fillText(this.rank, this.x+(canvas.width/45) , this.y+(canvas.width/17))
        }     
    }

    moveForward() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        // if at the top of the board, cannot move forward
        if (this.position[1]===0) {
            output.innerHTML = 'Cannot move there.'
            return false
            
        }
        else {
            const potentialSpace = gameSpaceArray.findIndex((space) => {
                return arrayEquals(space.position, [this.position[0], this.position[1]-1])
            })
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
                this.y -= canvas.height/8
                this.position[1] -=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = redTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = redTeam[defenderIndex]
                    
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                }
                else {output.innerHTML = 'CPU Turn'}
            }
            else {
                console.log('space is not open')
                output.innerHTML = 'Cannot move there.'
                return false
            }
        }
    }
    moveLeft() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        // if we are in the left-most column, cannot move left
        if (this.position[0]===0) {
            output.innerHTML = 'Cannot move there.'
            return false
        }
        else {
            const potentialSpace = gameSpaceArray.findIndex((space) => {
                return arrayEquals(space.position, [this.position[0]-1, this.position[1]])
            })
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
                this.x -= canvas.width/8
                this.position[0] -=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = redTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = redTeam[defenderIndex]
                    
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                }
                else {output.innerHTML = 'CPU Turn'}
            }
            else {
                console.log('space is not open')
                output.innerHTML = 'Cannot move there.'
                return false
            }
        }
    }
        moveRight() {
            const currentSpace = gameSpaceArray.findIndex((space) => {
                return arrayEquals(space.position, this.position)           
            })
            if (this.position[0]===7) {
                output.innerHTML = 'Cannot move there.'
                return false
            }
            else {
            const potentialSpace = gameSpaceArray.findIndex((space) => {
                return arrayEquals(space.position, [this.position[0]+1, this.position[1]])
            })
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
                this.x += canvas.width/8
                this.position[0] +=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = redTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = redTeam[defenderIndex]
                    
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                }
                else {output.innerHTML = 'CPU Turn'}
            }
            else {
                console.log('space is not open')
                output.innerHTML = 'Cannot move there.'
                return false
            }
        }
    }
    moveBack() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)
        })
        // if we are in the bottom row, we cannot move backwards
        if (this.position[1]===7) {
            output.innerHTML = 'Cannot move there.'
            return false
        }
        else {
            const potentialSpace = gameSpaceArray.findIndex((space) => {
                return arrayEquals(space.position, [this.position[0], this.position[1]+1])
            })
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
                this.y += canvas.height/8
                this.position[1] +=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = redTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = redTeam[defenderIndex]
                    
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                }
                else {output.innerHTML = 'CPU Turn'}
            }
            else {
                console.log('space is not open')
                output.innerHTML = 'Cannot move there.'
                return false
            }
        }
    }
}

// Red Team (CPU)
class RedSoldier {
    static total = 24
    constructor(x, y) {
        this.rank = '#'
        this.x = x 
        this.y = y
        this.alive=true
        this.color = 'red'
        this.position = findPosition(this.x,this.y)
        this.revealed = false
    }
    //render function for the soldier
    renderSoldier() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y, canvas.width/12, canvas.height/12)
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        // red team rank only shows if revealed is true, which only happens after a skirmish
        this.showRank()
        gameSpaceArray[currentSpace].teamColor = this.color
        gameSpaceArray[currentSpace].currentSoldier = this.rank
    }
    showRank() {
        if (this.revealed) {
            ctx.fillStyle = 'white'
        ctx.font = '20px Comic Sans MS'
        ctx.fillText(this.rank, this.x+(canvas.width/45) , this.y+(canvas.width/17))
        }
    }
    moveForward() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0], this.position[1]+1])
        })
        if (potentialSpace!==-1) {
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'red') {
                this.y += canvas.height/8
                this.position[1] +=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='blue') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = blueTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = blueTeam[defenderIndex]
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                }
                else {output.innerHTML = 'Your Turn'}
            }
            else {
    
                return false
            }
        }
       
        else {

            return false
        }
    }
    moveLeft() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0]+1, this.position[1]])
        })
        if (potentialSpace!== -1) {
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'red') {
                this.x += canvas.width/8
                this.position[0] +=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='blue') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = blueTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = blueTeam[defenderIndex]
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                }
                else {output.innerHTML = 'Your Turn'}
            } else {
    
                return false
            }
        }
       
        else {

            return false
        }
    }
    moveRight() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0]-1, this.position[1]])
        })
        if (potentialSpace!== -1) {
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'red') {
                this.x -= canvas.width/8
                this.position[0] -=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='blue') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = blueTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = blueTeam[defenderIndex]
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                } else {output.innerHTML = 'Your Turn'}
            }
            else {
    
                return false
            }
        }
        
        else {

            return false
        }
    }
    moveBack() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0], this.position[1]-1])
        })
        if (potentialSpace!==-1) {
            if ((gameSpaceArray[potentialSpace].openSpace) && (gameSpaceArray[potentialSpace].teamColor !== 'red')) {
                this.y -= canvas.height/8
                this.position[1] -=1
                //Since we have moved, remove soldier attributes from previous space
                gameSpaceArray[currentSpace].teamColor = ''
                gameSpaceArray[currentSpace].currentSoldier = ''
                // now check if opponent is there
                if (gameSpaceArray[potentialSpace].teamColor ==='blue') {
                    // game checks if there is a battle
                    // if yes, battle and remove inferior piece
                    // identify the defender 
                    const defenderIndex = blueTeam.findIndex((space) => {
                        return arrayEquals(space.position, this.position)
                    })
                    const defender = blueTeam[defenderIndex]
                    skirmish(this, defender)
                        // then check if the game is won
                            // end the game 
                } else {output.innerHTML = 'Your Turn'}
            }
            else {
    
                return false
            }
        }
        
        else {

            return false
        }
    }
}
let redTeam = []
for (let i=0; i<24; i++) {
    let newX = gameSpaceArray[i].x + canvas.width/48
    let newY = gameSpaceArray[i].y + canvas.height/48
    const soldier = new RedSoldier(newX,newY)
    redTeam.push(soldier)
}
// randomize configuration of pieces 
redTeam.forEach(item => {
    item.rank = shuffle(redSoldierRanks).pop()
})

let blueTeam = []
// start i=63 and go to 39 to fill the bottom 4 rows of the gameboard
// (since gamespaceArray[39-63] is the bottom 4 rows of the gameboard)
for (let i=63; i>39; i--) {
    let newX = gameSpaceArray[i].x + canvas.width/48
    let newY = gameSpaceArray[i].y + canvas.height/48
    const soldier = new BlueSoldier(newX,newY)
    blueTeam.push(soldier)
   
}



// render the initial board
newBoard()

 // if random button is clicked, add random ranks (just for ease of testing)
 document.querySelector('#randomize-setup').addEventListener('click', () => {
    if (gameStarted===false) {    
        let randBlueSoldierRanks = [1,2,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,6,7,7,7,7,7,'f']
        blueTeam.forEach(item => {
            item.rank = shuffle(randBlueSoldierRanks).pop()
            newBoard()
            gameReady = true
        })
    } else {
        console.log('cannot change configuration after the game starts. press reset to start over')
        output.innerHTML='Cannot change configuration after game starts. Press reset to start over.'
    }
})
// if choose setup is picked, run the following function that will allow to 
// click on a soldier, then enter a valid rank
let blueSoldierRanks = [1,2,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,6,7,7,7,7,7,'f']
function playerConfiguration() {
   if (gameStarted ===false) { 
        output.innerHTML=`Click on a blue soldier and type in one of the following ranks: ${blueSoldierRanks}`    
        canvas.addEventListener('click', e => {
            const clickPosition = findPosition(e.offsetX,e.offsetY)
            let clickedSoldier = ""
            // if column and row matches that of a player soldier (blue team), 
            // we select that soldier as "clickedSoldier"
            blueTeam.forEach(item => {
                // check if there is a blue soldier on that position
                if (arrayEquals(item.position, clickPosition)) {
                    clickedSoldier = item
                }
            })
            console.log(clickedSoldier)
            // if there is a clicked soldier, add event listener
            if (clickedSoldier!=="") {
                document.addEventListener('keydown', e=> {
                    console.log(clickedSoldier)
                    blueSoldierRanks.forEach((item, index) => {
                        if (clickedSoldier.rank==='#') {    
                            if (item == e.key) {
                                clickedSoldier.rank = item
                                blueSoldierRanks.splice(index,1)
                                newBoard()
                                output.innerHTML=`Need to add following ranks: ${blueSoldierRanks}`
                            } 
                        } 
                    })
                    if (blueSoldierRanks.length === 0) {
                        console.log('ready? hit start!')
                        output.innerHTML='Ready? Hit start!'
                        gameReady = true
                        
                    }
                    else {
                        playerConfiguration()
                    }
                }, {once: true})

            }
            else {
                playerConfiguration()
            }
        },{once: true})
    } else {
        console.log('game has been started. cannot change configuration')
        output.innerHTML='Game has already been started. Cannot change configuration.'
    }
}
// when choose setup button is clicked, player can choose setup manually
document.getElementById('choose-setup').addEventListener('click', playerConfiguration)

// when start button is clicked, make sure gameBoard is setup correctly
// then start playerTurn. 
// remove start and randomize buttons

document.querySelector('#start').addEventListener('click', () => {
    if (gameStarted===false){    
        if(gameReady === true) {
            console.log('let the games begin')
            output.innerHTML='Click on a soldier and move with WASD or the arrow keys.'
            playerTurn()
            gameStarted = true
        }
        else {
            console.log('board is not set up correctly')
            output.innerHTML=`Cannot start game until the following ranks are added: ${blueSoldierRanks}`

        }
    } else {
        output.innerHTML='You have already started the game. Press reset if you wish to start over.'
    } 
})
function findSoldier(e) {
    console.log(`${e.offsetX} is X, ${e.offsetY} is Y`)
    // use findPosition to get column and row 
    const clickPosition = findPosition(e.offsetX,e.offsetY)
    let clickedSoldier = ""
    // if column and row matches that of a player soldier (blue team), 
    // we select that soldier as "clickedSoldier"
    blueTeam.forEach(item => {
        // check if there is a blue soldier on that position
        if (arrayEquals(item.position, clickPosition)) {
            clickedSoldier = item
        }
    })
    console.log(clickedSoldier)
    // if there is a clicked soldier that isn't the flag, add event listener
if (clickedSoldier!=="" && clickedSoldier.rank!=='f') {
        document.addEventListener('keydown',movementHandler(clickedSoldier), {once: true})
    }
    // if clicked on flag, no move can occur. 
    else if (clickedSoldier.rank ==='f') {
        console.log('cannot move the flag')
        output.innerHTML='The flag cannot be moved'
        playerTurn()
    }
    // if there isn't a clicked soldier, we need to run the function again
    else {
        playerTurn()
    }
}
function playerTurn() {   
        // add click event listener
        // FLAG currently, when i reset, this event listener stacks on itself
        canvas.addEventListener('click', findSoldier,{once: true})
}

// player moves the piece
// ** must be valid space, or has to try again (call the function again ->
// if the move is invalid )**    


// wait 2 seconds, then CPU turn, always will be valid
// cpuTurn is nested into player turn, only occurs once player turn is over and 
// gameStatus is still true
function cpuTurn() {
    let cpuTurn = true 
    // CPU selects random piece, random movement direction, checks if 
    // it is a viable move. If it is, it moves, if not, it selects 2 new random values and 
    // checks again until a viable move is found 

    while (cpuTurn === true) {
        const randomSoldier = redTeam[Math.floor(Math.random()*redTeam.length)];
        // the flag cannot move 
        if (randomSoldier.rank === 'f') {
            // restart the while loop 
            continue
        }
        if (randomSoldier.alive === false) {
            continue
        }
        const randomDirection = Math.floor(Math.random()*3)
        if (randomDirection ===0) {
            if (randomSoldier.moveForward()===false) {
                cpuTurn = true
            } else {
                cpuTurn = false
                
            }
        }
        if (randomDirection ===1) {
            continue
            // if (randomSoldier.moveBack()===false) {
            //     cpuTurn = true
            // } else {
            //     cpuTurn = false
            //     console.log('we move',randomSoldier,randomDirection)

            // }
        }
        if (randomDirection ===2) {
            
            if (randomSoldier.moveLeft()===false) {
                cpuTurn = true
            } else {
                cpuTurn = false
            }
        }
        if (randomDirection ===3) {
            
            if (randomSoldier.moveRight()===false) {
                cpuTurn = true
            } else {
                cpuTurn = false
            }
        }
    }
    // rerender the board and pieces to see the new move 
    newBoard()
    if (gameStatus===true) {
        console.log('next Turn!')
        playerTurn()

    }
    else {
        console.log('GAME OVER')
    }
}
    // game checks if battle 
        // if so, battle and result
            // check if game is won
                // end the game

        // move on to player turn 


document.querySelector('#reset').addEventListener('click', () => {
    console.log('reset')
    output.innerHTML = 'Set up the board by clicking Choose Setup or Random Setup.'
    // remove event listener from canvas 
    canvas.removeEventListener('click', findSoldier )
    // set booleans to default 
    gameStatus = true
    gameReady = false 
    gameStarted = false
    // reset every array and rerender the items in them
    gameSpaceArray = []
    for (let i=0;i<8;i++) {
        for (let j=0;j<8;j++) {
            //We have designated "lake" spaces that are not passable. Make them lightblue. 
            if (
                (i===3 && j===1) || (i===4 && j===1) ||
                (i==3 && j===2) || (i===4 && j===2)  ||
                (i==3 && j===5) || (i===4 && j===5)  ||
                (i==3 && j===6) || (i===4 && j===6) ) {
                let nextSpace = new GameSpace(j,i, '#69fcff', false)
                gameSpaceArray.push(nextSpace) 
                } 
            // create checkerboard appearance 
            else if (
                i%2===0 && j%2===0 || 
                i%2>0 && j%2>0 ) {
                    let nextSpace = new GameSpace(j,i, '#b4f7a1', true)
                    gameSpaceArray.push(nextSpace)  
                } 
                else {
                    let nextSpace = new GameSpace(j,i, 'lightgreen', true)
                    gameSpaceArray.push(nextSpace)  
                }
            
                    
        }
    }
    redTeam = []
    for (let i=0; i<24; i++) {
        let newX = gameSpaceArray[i].x + canvas.width/48
        let newY = gameSpaceArray[i].y + canvas.height/48
        const soldier = new RedSoldier(newX,newY)
        redTeam.push(soldier)
    }
    // randomize configuration of pieces 
    redSoldierRanks = [1,2,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,6,7,7,7,7,7,'f']
    redTeam.forEach(item => {
        item.rank = shuffle(redSoldierRanks).pop()
    })

    blueTeam = []
    // start i=63 and go to 39 to fill the bottom 4 rows of the gameboard
    // (since gamespaceArray[39-63] is the bottom 4 rows of the gameboard)
    for (let i=63; i>39; i--) {
        let newX = gameSpaceArray[i].x + 10
        let newY = gameSpaceArray[i].y + 10
        const soldier = new BlueSoldier(newX,newY)
        blueTeam.push(soldier)
    }
    blueSoldierRanks = [1,2,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,6,7,7,7,7,7,'f']
    
    // render the initial board
    newBoard()
    

})