console.log('hello stratego')

//  grab canvas element 
const canvas = document.querySelector('#canvas')
const output = document.querySelector('#play')

const ctx = canvas.getContext('2d')
//  set canvas width and height
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

const gamemodeButton = document.querySelector('#gamemode-button')

// const instructionsButton = document.querySelector('#instructions-button')
// instructionsButton.addEventListener('click', ()=> {
    
// })
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
    case (x<(1*canvas.width/10)): 
        column = 0
        break
    case (x<(2*canvas.width/10)): 
        column = 1
        break
    case (x<(3*canvas.width/10)): 
        column = 2
        break
    case (x<(4*canvas.width/10)): 
        column = 3
        break
    case (x<(5*canvas.width/10)): 
        column = 4
        break
    case (x<(6*canvas.width/10)): 
        column = 5
        break
    case (x<(7*canvas.width/10)): 
        column = 6
        break
    case (x<(8*canvas.width/10)): 
        column = 7
        break
    case (x<(9*canvas.width/10)): 
        column = 8
        break
    case (x<(10*canvas.width/10)): 
        column = 9
        break
}
switch(true) {
    case (y<(1*canvas.height/10)): 
        row = 0
        break
    case (y<(2*canvas.height/10)): 
        row = 1
        break
    case (y<(3*canvas.height/10)): 
        row = 2
        break
    case (y<(4*canvas.height/10)): 
        row = 3
        break
    case (y<(5*canvas.height/10)): 
        row = 4
        break
    case (y<(6*canvas.height/10)): 
        row = 5
        break
    case (y<(7*canvas.height/10)): 
        row = 6
        break
    case (y<(8*canvas.height/10)): 
        row = 7
        break
    case (y<(9*canvas.height/10)): 
        row = 8
        break
    case (y<(10*canvas.height/10)): 
        row = 9
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
        intel(defendingPiece)
        redTeam.forEach(item => {
            item.revealed=true
        })
        newBoard()
    }
    if (defendingPiece.rank === 'b') {
        console.log('kaboom?')
        if (attackingPiece.rank===8) {
            defendingPiece.alive= false
            defendingPiece.position = null
            fightingSpace.teamColor = attackingPiece.color
            output.innerHTML = 'Miner diffused a bomb.'
            intel(defendingPiece)
        }
        else {
            attackingPiece.alive=false
            attackingPiece.position = null
            fightingSpace.teamColor = defendingPiece.color
            output.innerHTML = `Kabooom. ${attackingPiece.color} ${attackingPiece.rank} found a bomb 💣😱.`
            intel(attackingPiece)
        }
    }
    if (defendingPiece.rank==='s') {
        if (attackingPiece.rank==='s') {
            attackingPiece.alive = false
            defendingPiece.position = null
            defendingPiece.alive = false
            attackingPiece.position = null
            fightingSpace.teamColor = ""
            output.innerHTML = `${attackingPiece.color} ${attackingPiece.rank} and ${defendingPiece.color} ${defendingPiece.rank} took each other out!`
            intel(attackingPiece)
            intel(defendingPiece)
        }
        else {
            defendingPiece.alive = false
            defendingPiece.position = null
            fightingSpace.teamColor = attackingPiece.color
            output.innerHTML = `${attackingPiece.color} ${attackingPiece.rank} takes out the ${defendingPiece.color} spy!`
            intel(defendingPiece)

        }
    }
    if (attackingPiece.rank === 's') {
        if (defendingPiece.rank===1) {
            console.log('assassination')
            defendingPiece.position = null
            defendingPiece.alive = false
            fightingSpace.teamColor = attackingPiece.color
            output.innerHTML = `${attackingPiece.color} assassinates the ${defendingPiece.color} Marshall 😳`
            intel(defendingPiece)
        }
        else {
            attackingPiece.alive=false 
            attackingPiece.position=null
            fightingSpace.teamColor = defendingPiece.color
            output.innerHTML = `${attackingPiece.color} Spy has been stopped by ${defendingPiece.color} ${defendingPiece.rank}`
            intel(attackingPiece)
        }
    }
    // if the defender has a weaker (higher number) rank, he loses and is removed. 
    else if (defendingPiece.rank>attackingPiece.rank) {
        console.log(`${attackingPiece.color} ${attackingPiece.rank} beats ${defendingPiece.color} ${defendingPiece.rank}`)
        defendingPiece.alive = false
        defendingPiece.position = null
        fightingSpace.teamColor = attackingPiece.color
        output.innerHTML= `${attackingPiece.color} ${attackingPiece.rank} beats ${defendingPiece.color} ${defendingPiece.rank}`
        intel(defendingPiece)
    }
    // if the defender is stronger, he wins and kicks the other player out 
    else if (defendingPiece.rank<attackingPiece.rank) {
        console.log(`${attackingPiece.color} ${attackingPiece.rank} loses to ${defendingPiece.color} ${defendingPiece.rank}`)
        attackingPiece.alive = false
        attackingPiece.position = null
        fightingSpace.teamColor = defendingPiece.color
        output.innerHTML= `${attackingPiece.color} ${attackingPiece.rank} loses to ${defendingPiece.color} ${defendingPiece.rank}`
        intel(attackingPiece)
    }
    else if (defendingPiece.rank===attackingPiece.rank) {
        console.log('Draw. Both soldiers are out')
        attackingPiece.alive = false
        defendingPiece.position = null
        defendingPiece.alive = false
        attackingPiece.position = null
        fightingSpace.teamColor = ""
        output.innerHTML = `${attackingPiece.color} ${attackingPiece.rank} and ${defendingPiece.color} ${defendingPiece.rank} took each other out!`
        intel(attackingPiece)
        intel(defendingPiece)
    }
    
}


// function to output the total captured soldiers for each side 
defeatedRedTeam = []
defeatedBlueTeam = []
const redCapturedOutput = document.querySelector('#redCaptured')
const blueCapturedOutput =document.querySelector('#blueCaptured')
//function Intel 
const intel = function(defeatedSoldier) {
    if (defeatedSoldier.color==='red') {
        defeatedRedTeam.push(defeatedSoldier.rank)
        redCapturedOutput.innerHTML = defeatedRedTeam.join(', ')
        }
    else {
        defeatedBlueTeam.push(defeatedSoldier.rank)
        blueCapturedOutput.innerHTML = defeatedBlueTeam.join(', ')
    }
    // add function to end game if all movable pieces are captured. 
    let blueMoves = []
    let redMoves = []
    blueTeam.forEach(item => {
        
        if (item.alive===true) {
            // for all the pieces remaining, check if there is a 1,2,3,4,5,6,7,8,9,s
            if (item.rank===1 || item.rank===2 || item.rank===3 || 
                item.rank===4 || item.rank===5 || item.rank===6 ||
                item.rank===7 || item.rank===8 || item.rank===9 ||
                item.rank==='s') {
                    // add to blue moves 
                    blueMoves.push(item.rank)
                    
                }
        }
        
    })
    // if bluemoves is empty, blue has no more moveable pieces. game over. 
    if (blueMoves.length === 0) {
        gameStatus = false
        output.innerHTML='Game Over. You do not have any moveable pieces left. You lose.'
        redTeam.forEach(item => {
            item.revealed=true
        })
        newBoard()
    }
    redTeam.forEach(item => {
        
        if (item.alive===true) {
            // for all the pieces remaining, check if there is a 1,2,3,4,5,6,7,8,9,s
            if (item.rank===1 || item.rank===2 || item.rank===3 || 
                item.rank===4 || item.rank===5 || item.rank===6 ||
                item.rank===7 || item.rank===8 || item.rank===9 ||
                item.rank==='s') {
                    // add to blue moves 
                    redMoves.push(item.rank)
                    
                }
        }
        
    })
    // if redmoves is empty, red has no more moveable pieces. game over. 
    if (redMoves.length === 0) {
        gameStatus = false
        output.innerHTML = 'You win! Red has no more movable pieces.'
        redTeam.forEach(item => {
            item.revealed=true
        })
        newBoard()
    }
    console.log(redMoves.length)
}

 


/*---------------GAME FLOW --------------------------------------------------------------------*/

// set up the board
// gamespace class 
class GameSpace {
    constructor(column, row, color, isOpen) {
        // the x position is the width of the entire board(canvas.width) times the column number
        // and divided by 8. 
        this.x = canvas.width*column/10
        this.y = canvas.height*row/10
        this.width = canvas.width/10
        this.height = canvas.height/10
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
        // ctx.fillStyle = this.color
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}
// make an array of the entire gameboard using for loop
// added to array for easy access/manipulation
let gameSpaceArray = []
for (let i=0;i<10;i++) {
    for (let j=0;j<10;j++) {
        //We have designated "lake" spaces that are not passable. Make them lightblue. 
        if (
            (i===4 && j===2) || (i===5 && j===2) ||
            (i==4 && j===3) || (i===5 && j===3)  ||
            (i==4 && j===6) || (i===5 && j===6)  ||
            (i==4 && j===7) || (i===5 && j===7) ) {
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
let redSoldierRanks = [1,2,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,9,9,'s','b','b','b','b','b','b','f']

// Blue team (player 1)
class BlueSoldier {
    static total = 24
    constructor(x, y) {
        this.rank = ''
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
        ctx.fillRect(this.x,this.y, canvas.width/15, canvas.height/15)
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
            ctx.fillText('⛳️', this.x+(canvas.width/65) , this.y+(canvas.height/22))
        }
        else if (this.rank==='b') {
            ctx.fillText('💣', this.x+(canvas.width/65) , this.y+(canvas.height/20))
        }
        else {
            ctx.fillText(this.rank, this.x+(canvas.width/45) , this.y+(canvas.height/20))
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
                this.y -= canvas.height/10
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
                this.x -= canvas.width/10
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
            if (this.position[0]===9) {
                output.innerHTML = 'Cannot move there.'
                return false
            }
            else {
            const potentialSpace = gameSpaceArray.findIndex((space) => {
                return arrayEquals(space.position, [this.position[0]+1, this.position[1]])
            })
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
                this.x += canvas.width/10
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
        if (this.position[1]===9) {
            output.innerHTML = 'Cannot move there.'
            return false
        }
        else {
            const potentialSpace = gameSpaceArray.findIndex((space) => {
                return arrayEquals(space.position, [this.position[0], this.position[1]+1])
            })
            if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
                this.y += canvas.height/10
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
    static total = 40
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
        ctx.fillRect(this.x,this.y, canvas.width/15, canvas.height/15)
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
            if (this.rank==='f') {
                ctx.fillText('⛳️', this.x+(canvas.width/65) , this.y+(canvas.height/22))
            }
            else if (this.rank==='b') {
                ctx.fillText('💣', this.x+(canvas.width/65) , this.y+(canvas.height/20))
            }
            else {
                ctx.fillText(this.rank, this.x+(canvas.width/45) , this.y+(canvas.height/20))
            }     
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
                this.y += canvas.height/10
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
                this.x += canvas.width/10
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
                this.x -= canvas.width/10
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
                this.y -= canvas.height/10
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
for (let i=0; i<40; i++) {
    let newX = gameSpaceArray[i].x + canvas.width/60
    let newY = gameSpaceArray[i].y + canvas.height/60
    const soldier = new RedSoldier(newX,newY)
    redTeam.push(soldier)
}
// randomize configuration of pieces 

// for difficulty hard, choose random of the following arrays instead 

redTeam.forEach(item => {
    item.rank = shuffle(redSoldierRanks).pop()
})
gamemodeButton.addEventListener('click', ()=> {
    gamemodeButton.classList.add('selected')
    const redSoldierLayouts = [
        [5,9,9,6,9,5,8,1,9,5,
        6,7,'b','s',2,9,4,4,3,9,
        7,'b',7,4,3,6,'b',6,5,7,
        9,8,'b',9,8,'b','f','b',8,8],
        [1,5,6,8,9,5,9,9,9,5,
        7,9,3,3,2,9,7,'b','b',6,
        4,9,4,'s',5,6,'b',7,6,9,
        4,8,8,8,7,'b','f','b','b',8],
        [5,9,7,2,5,9,9,1,9,5,
        6,9,4,6,'b',9,4,4,3,8,
        7,3,'s',8,'b',9,5,6,6,'b',
        8,'b',7,'b',7,9,8,8,'b','f'],
        [9,3,6,9,5,9,2,8,9,5,
        1,9,4,3,9,5,'b',6,'b',6,
        5,7,4,'s',4,6,'b',7,'b',7,
        8,9,8,8,7,'b','f','b',8,9],
        [9,9,'b','f','b','b',7,9,9,9,
        4,2,3,'b',1,4,'b',8,3,4,
        6,7,5,5,8,8,5,9,5,6,
        9,7,8,6,9,'s',7,'b',6,8],
        ['b',2,'s',3,9,6,8,3,9,6,
        7,'b',8,5,4,1,9,9,4,9,
        'b',7,'b',9,9,6,7,5,9,5,
        'f','b',7,'b',5,8,8,8,6,4],
        [9,9,8,4,'b','b',7,7,'b','b',
        2,3,'s',8,5,3,5,5,4,7,
        'b',1,6,8,8,4,5,6,6,6,
        'f','b',9,9,9,9,9,9,8,7]
    ]
    if (gameStarted===true) {
        output.innerHTML= 'Press restart to change difficulty'
    }
    else {
        let randomLayout=Math.floor(Math.random()*7)
        console.log(randomLayout)
        redTeam.forEach(item => {
            item.rank = redSoldierLayouts[randomLayout].pop()
            newBoard()
        })
        output.innerHTML= 'Hard Mode Selected. CPU will be smart during setup.'
    }
})


let blueTeam = []
// start i=63 and go to 39 to fill the bottom 4 rows of the gameboard
// (since gamespaceArray[39-63] is the bottom 4 rows of the gameboard)
for (let i=99; i>59; i--) {
    let newX = gameSpaceArray[i].x + canvas.width/60
    let newY = gameSpaceArray[i].y + canvas.height/60
    const soldier = new BlueSoldier(newX,newY)
    blueTeam.push(soldier)
   
}



// render the initial board
newBoard()

 // if random button is clicked, add random ranks (just for ease of testing)
 document.querySelector('#randomize-setup').addEventListener('click', () => {
    if (gameStarted===false) {    
        let randBlueSoldierRanks = [1,2,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,9,9,'s','b','b','b','b','b','b','f']
        blueTeam.forEach(item => {
            item.rank = shuffle(randBlueSoldierRanks).pop()
            newBoard()
            gameReady = true
            output.innerHTML = 'Randomized ranks. Randomize again, reset, or press start to continue.'
        })
    } else {
        console.log('cannot change configuration after the game starts. press reset to start over')
        output.innerHTML='Cannot change configuration after game starts. Press reset to start over.'
    }
})
// if choose setup is picked, run the following function that will allow to 
// click on a soldier, then enter a valid rank
let blueSoldierRanks = [1,2,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,9,9,'s','b','b','b','b','b','b','f']
function playerConfiguration() {
   if (gameStarted ===false && gameReady ===false) { 
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
                        if (clickedSoldier.rank==='') {    
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
    } else if (gameStarted ===false && gameReady === true) {
        output.innerHTML = 'Press reset to add custom configuration'
    }
    else {
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
if (clickedSoldier!=="" && clickedSoldier.rank!=='f' && clickedSoldier.rank!=='b') {
        // if (clickedSoldier.rank===9) {
        //     output.innerHTML='You have selected a scout. Press WASD for normal movement or arrow keys for extended movement.'
        //     document.addEventListener('keydown',movementHandler(clickedSoldier), {once: true})
        // }

        output.innerHTML=`You have selected ${clickedSoldier.rank}. Press WASD or arrow keys for movement.`
        document.addEventListener('keydown',movementHandler(clickedSoldier), {once: true})
    }
    // if clicked on flag, no move can occur. 
    else if (clickedSoldier.rank ==='f') {
        console.log('cannot move the flag')
        output.innerHTML='The flag cannot be moved'
        playerTurn()
    }
    else if (clickedSoldier.rank === 'b') {
        output.innerHTML = 'Bombs cannot be moved'
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
        // the flag and bombs cannot move 
        if (randomSoldier.rank === 'f' || randomSoldier.rank === 'b') {
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
    gamemodeButton.classList.remove('selected')
    output.innerHTML = 'Set up the board by clicking Choose Setup or Random Setup.'
    // remove event listener from canvas 
    canvas.removeEventListener('click', findSoldier )
    // set booleans to default 
    gameStatus = true
    gameReady = false 
    gameStarted = false
    // reset every array and rerender the items in them
    defeatedRedTeam = []
    defeatedBlueTeam = []
    blueCapturedOutput.innerHTML = ''
    redCapturedOutput.innerHTML = ''
    gameSpaceArray = []
    for (let i=0;i<10;i++) {
        for (let j=0;j<10;j++) {
            //We have designated "lake" spaces that are not passable. Make them lightblue. 
            if (
                (i===4 && j===2) || (i===5 && j===2) ||
                (i==4 && j===3) || (i===5 && j===3)  ||
                (i==4 && j===6) || (i===5 && j===6)  ||
                (i==4 && j===7) || (i===5 && j===7) ) {
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
    for (let i=0; i<40; i++) {
        let newX = gameSpaceArray[i].x + canvas.width/60
        let newY = gameSpaceArray[i].y + canvas.height/60
        const soldier = new RedSoldier(newX,newY)
        redTeam.push(soldier)
    }
    // randomize configuration of pieces 
    redSoldierRanks = [1,2,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,9,9,'s','b','b','b','b','b','b','f']
    redTeam.forEach(item => {
        item.rank = shuffle(redSoldierRanks).pop()
    })

    blueTeam = []
    // start i=63 and go to 39 to fill the bottom 4 rows of the gameboard
    // (since gamespaceArray[39-63] is the bottom 4 rows of the gameboard)
    for (let i=99; i>59; i--) {
        let newX = gameSpaceArray[i].x + canvas.width/60
        let newY = gameSpaceArray[i].y + canvas.height/60
        const soldier = new BlueSoldier(newX,newY)
        blueTeam.push(soldier)
       
    }
    blueSoldierRanks = [1,2,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,9,9,'s','b','b','b','b','b','b','f']
    
    // render the initial board
    newBoard()
    
    
    

})